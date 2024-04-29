import { StreamingTextResponse } from 'ai';

const ollama_url = process.env.NEXT_PUBLIC_OLLAMA_URL;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await fetch(`${ollama_url}/api/chat`, {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama3',
      messages,
    }),
  });

  const data = response.body;

  if (!data) return new Response('No response', { status: 500 });

  return new StreamingTextResponse(data);
}
