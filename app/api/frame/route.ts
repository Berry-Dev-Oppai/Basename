import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

function getFrameContent(username = '') {
  return {
    buttons: [
      {
        label: username ? "Search Again" : "Search Basename",
      }
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/frame-image.png`,
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    input: {
      text: "Type a Username"
    }
  };
}

export async function GET() {
  const frameContent = getFrameContent();
  console.log('GET Frame Content:', frameContent);
  return new NextResponse(getFrameHtmlResponse(frameContent));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  console.log('Received POST body:', body);

  const { untrustedData } = body;
  const username = untrustedData?.inputText || '';

  console.log('Received username:', username);

  const frameContent = getFrameContent(username);
  console.log('POST Frame Content:', frameContent);
  return new NextResponse(getFrameHtmlResponse(frameContent));
}

export const dynamic = 'force-dynamic';
