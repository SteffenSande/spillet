import type { APIRoute } from "astro";

const clients = new Set<ReadableStreamDefaultController>();

export const GET: APIRoute = async ({ request }) => {
  let control: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      control = controller;
      clients.add(controller);
    },
    cancel(reason) {
      // Called when client disconnects (tab closed)
      clients.delete(control);
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

export const send = (hint: any) => {
  const encoder = new TextEncoder();
  console.log(clients);
  for (const client of clients) {
    const msg = formatMessage(hint);
    client.enqueue(encoder.encode(msg));
  }
};

const formatMessage = (input: any) => {
  return `data: ${JSON.stringify(input)}\n\n`;
};
