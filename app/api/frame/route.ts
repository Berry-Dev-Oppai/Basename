import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('API Route: Received request');

    const baseUrl = request.nextUrl.origin;
    console.log('Base URL:', baseUrl);

    const imageName = 'frame-image.png';
    const imageUrl = `${baseUrl}/${imageName}`;
    console.log('Generated image URL:', imageUrl);

    // Check if the image file exists in the public directory
    const publicDir = path.join(process.cwd(), 'public');
    const imagePath = path.join(publicDir, imageName);
    
    console.log('Current working directory:', process.cwd());
    console.log('Public directory path:', publicDir);
    console.log('Image path:', imagePath);
    console.log('Public directory exists:', fs.existsSync(publicDir));
    console.log('Public directory contents:', fs.readdirSync(publicDir));

    if (!fs.existsSync(imagePath)) {
      throw new Error(`Image file not found in public directory: ${imagePath}`);
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
  } catch (error: unknown) {
    console.error('API Route: Error in GET request:', error instanceof Error ? error.message : 'Unknown error occurred');
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }
}

export const dynamic = 'force-dynamic';
