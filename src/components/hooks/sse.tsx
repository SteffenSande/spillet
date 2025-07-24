import { useEffect, useState, useRef } from "react";
import { v4 as uuid } from "uuid";

const MASTER_KEY = "sse_master_tab";
const HEARTBEAT_KEY = "sse_master_heartbeat";
const HEARTBEAT_INTERVAL = 1000; // 1 second
const MASTER_TIMEOUT = 5000; // 5 seconds

export function useSSEHints() {
  const [hint, setHint] = useState<string | null>(null);
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
    const bc = new BroadcastChannel("hints");
    broadcastRef.current = bc;

    bc.onmessage = (event) => {
      if (event.data?.hint) {
        setHint(event.data.hint);
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
      const newHint = event.data;
      console.log(newHint)
      setHint(newHint);
      broadcastRef.current?.postMessage({ hint: newHint });
    };

    es.onerror = () => {
      console.error("SSE error. Letting browser attempt reconnect...");
      // Do not manually close here — let browser retry
    };

    return () => {
      es.close();
    };
  }, [isMaster]);

  return { hint, isMaster };
}
