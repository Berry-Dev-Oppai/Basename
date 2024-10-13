import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  return new NextResponse(`<!DOCTYPE html>
    <html>
      <head>
        <title>Basename Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}/Basename Frame.png" />
        <meta property="fc:frame:button:1" content="Click me!" />
      </head>
      <body>
        <h1>Welcome to Basename Frame</h1>
      </body>
    </html>`, {
    headers: { 'Content-Type': 'text/html' },
  });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Hello from POST /api/frame' });
}
