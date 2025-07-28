import { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";
import type { ServerAction } from "../../lib/types";

const MASTER_KEY = "sse_master_tab";
const HEARTBEAT_KEY = "sse_master_heartbeat";
const HEARTBEAT_INTERVAL = 1000; // 1 second
const MASTER_TIMEOUT = 5000; // 5 seconds

export function useServerActions() {
  const [serverAction, setServerAction] = useState<ServerAction | null>(null);
  const [isMaster, setIsMaster] = useState(false);
  const tabId = useRef(uuid());

  const eventSourceRef = useRef<EventSource | null>(null);
  const broadcastRef = useRef<BroadcastChannel | null>(null);

  // Attempt to become master
  function tryBecomeMaster() {
    const currentMaster = localStorage.getItem(MASTER_KEY);
    const lastHeartbeat = Number(localStorage.getItem(HEARTBEAT_KEY) || "0");
    const now = Date.now();

    if (
      !currentMaster ||
      now - lastHeartbeat > MASTER_TIMEOUT ||
      currentMaster === tabId.current
    ) {
      localStorage.setItem(MASTER_KEY, tabId.current);
      localStorage.setItem(HEARTBEAT_KEY, now.toString());
      setIsMaster(true);
      return true;
    }
    setIsMaster(false);
    return false;
  }

  // Heartbeat loop
  useEffect(() => {
    tryBecomeMaster(); // Initial attempt

    const heartbeatTimer = setInterval(() => {
      const now = Date.now();
      const currentMaster = localStorage.getItem(MASTER_KEY);
      const isStillMaster = currentMaster === tabId.current;

      if (isStillMaster) {
        localStorage.setItem(HEARTBEAT_KEY, now.toString());
        setIsMaster(true);
      } else {
        tryBecomeMaster();
      }
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(heartbeatTimer);
    };
  }, []);

  // BroadcastChannel setup
  useEffect(() => {
    const bc = new BroadcastChannel("serverActions");
    broadcastRef.current = bc;

    bc.onmessage = (event) => {
      if (event.data) {
        setServerAction(JSON.parse(event.data));
      }
    };

    return () => {
      bc.close();
    };
  }, []);

  // SSE connection when master
  useEffect(() => {
    if (!isMaster) return;

    const es = new EventSource("/api/events");
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      console.log(event)
      const newHint = event.data;
      setServerAction(JSON.parse(newHint));
      broadcastRef.current?.postMessage(newHint);
    };

    es.onerror = () => {
      console.error("SSE error. Letting browser attempt reconnect...");
      // Do not manually close here — let browser retry
    };

    return () => {
      es.close();
    };
  }, [isMaster]);

  return { serverAction };
}
