import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Received request');

    const baseUrl = request.nextUrl.origin;
    console.log('Base URL:', baseUrl);

    const imageName = 'Basename Frame.png';
    const imageUrl = `${baseUrl}/${imageName}`;
    console.log('Generated image URL:', imageUrl);

    // Attempt to fetch the image to verify its existence
    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    if (!imageResponse.ok) {
      throw new Error(`Image not found: ${imageUrl}`);
    }

    const frameData = {
      frame: {
        version: 'vNext',
        image: imageUrl,
        buttons: [{ label: 'Click me!' }]
      }
    };

    console.log('API Route: Returning frame data:', JSON.stringify(frameData));
    return new NextResponse(JSON.stringify(frameData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('API Route: Error in GET request:', error);
    return new NextResponse(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export const dynamic = 'force-dynamic';
