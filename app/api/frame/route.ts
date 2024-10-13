import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';

    console.log('Base URL:', baseUrl);

    const imageName = 'Basename Frame.png';
    const imageUrl = `${baseUrl}/${imageName}`;
    console.log('Image URL:', imageUrl);

    // Check if the image file exists in the public directory
    try {
      await fs.access(path.join(process.cwd(), 'public', imageName));
      console.log('Image file exists in public directory');
    } catch (error) {
      console.error('Image file not found in public directory:', error);
    }

    const html = `<!DOCTYPE html>
      <html>
        <head>
          <title>Basename Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Click me!" />
        </head>
        <body>
          <h1>Welcome to Basename Frame</h1>
        </body>
      </html>`;

    console.log('Generated HTML:', html);

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('Error in GET request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received POST request with body:', body);

    // Process the POST request here
    // For now, we're just returning a simple response
    return NextResponse.json({ message: 'Hello from POST /api/frame' });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
