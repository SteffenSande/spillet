import type { APIRoute } from "astro";
import type { ServerAction } from "../../lib/types";

const clients = new Map<string, ReadableStreamDefaultController>();
const clientQueue = new Map<string, ServerAction[]>();

export const GET: APIRoute = async ({ request }) => {
  let control: ReadableStreamDefaultController;

  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((cookie) => {
      const [key, value] = cookie.split("=");
      return [key, value];
    })
  );
  const user = cookies["session-mafia-grande"];

  const stream = new ReadableStream({
    start(controller) {
      control = controller;
      clients.set(user, controller);
      const queue = clientQueue.get(user);
      if (queue) {
        for (const message of queue) {
          send(message, user);
        }
      }
    },
    cancel(reason) {
      // Called when client disconnects (tab closed)
      clients.delete(user);
      console.log("SSE stream closed. Reason:", reason);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

export const send = (serverAction: ServerAction, user: string) => {
  const encoder = new TextEncoder();
  const client = clients.get(user);
  const msg = formatMessage(serverAction);
  if (client) {
    client.enqueue(encoder.encode(msg));
    // TODO: Might store it to db
  } else {
    const queue = clientQueue.get(user) || [];
    clientQueue.set(user, [...queue, serverAction]);
  }
};

export const sendAll = (serverAction: ServerAction) => {
  for (const client of clients) {
    send(serverAction, client[0]);
  }
};

const formatMessage = (input: any) => {
  return `data: ${JSON.stringify(input)}\n\n`;
};
