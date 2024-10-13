import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const baseUrl = request.nextUrl.origin;
    const imageName = 'Basename Frame.png';
    const imageUrl = `${baseUrl}/${imageName}`;

    const frameMetadata = {
      version: 'vNext',
      image: imageUrl,
      buttons: [{ label: 'Click me!' }],
    };

    return NextResponse.json({ frame: frameMetadata });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
