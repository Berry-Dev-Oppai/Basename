import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

function getFrameContent() {
  return {
    buttons: [
      {
        label: "Search Basename",
        action: "post"
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

export async function GET(req: NextRequest) {
  return new NextResponse(getFrameHtmlResponse(getFrameContent()));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { untrustedData } = body;
  const username = untrustedData?.inputText || '';

  // Here you would typically perform some action with the username
  console.log('Received username:', username);

  return new NextResponse(getFrameHtmlResponse(getFrameContent()));
}

export const dynamic = 'force-dynamic';

