export async function POST(request) {
  try {
    // Retrieve the content-type header from the incoming request.
    const contentType = request.headers.get("content-type") || "";

    // Proxy the request to the external chat API, now including the duplex option.
    const externalRes = await fetch("https://zingapi.agino.tech/chat", {
      method: "POST",
      headers: {
        "content-type": contentType,
      },
      duplex: "half",
      body: request.body,
    });

    // Build a headers object for the response, forwarding only the essential headers.
    const headers = new Headers();
    externalRes.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    return new Response(externalRes.body, {
      status: externalRes.status,
      headers,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
