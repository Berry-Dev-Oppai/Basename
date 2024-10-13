import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient, User } from "@neynar/nodejs-sdk";
import axios from 'axios';

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');

interface BNSProfile {
  name: string;
  image?: string;
  description?: string;
}

async function getEthAddressForUser(username: string): Promise<string> {
  const userResponse = await neynarClient.lookupUserByUsername(username);
  const user = userResponse.result.user as User & { ethereum_address?: string };
  if (!user.ethereum_address) {
    throw new Error(`Ethereum address not found for user: ${username}`);
  }
  return user.ethereum_address;
}

async function getBNSNameForAddress(ethAddress: string): Promise<string> {
  const response = await axios.get<{ name: string }>(`https://api.basedomain.io/address/${ethAddress}`);
  if (!response.data.name) {
    throw new Error(`No BNS name found for address: ${ethAddress}`);
  }
  return response.data.name;
}

async function getBNSProfile(bnsName: string): Promise<BNSProfile> {
  const response = await axios.get<BNSProfile>(`https://api.basename.io/${bnsName}`);
  return response.data;
}

export async function GET() {
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>BNS Lookup Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="https://your-image-url.com/image.png" />
        <meta property="fc:frame:button:1" content="Look up BNS" />
        <meta property="fc:frame:input:text" content="Enter Warpcast username" />
      </head>
      <body>
        <h1>Enter a Warpcast username to look up their BNS profile</h1>
      </body>
    </html>`,
    {
      headers: { 'Content-Type': 'text/html' },
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const username = body.untrustedData.inputText;
    if (!username) {
      throw new Error('Username is required');
    }

    const ethAddress = await getEthAddressForUser(username);
    const bnsName = await getBNSNameForAddress(ethAddress);
    const bnsProfile = await getBNSProfile(bnsName);

    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>BNS Profile Found</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${bnsProfile.image || 'https://default-image-url.com/image.png'}" />
          <meta property="fc:frame:button:1" content="Look up BNS"
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  } catch (error) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>BNS Lookup Frame</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="https://your-image-url.com/image.png" />
          <meta property="fc:frame:button:1" content="Look up BNS"
      `,
      {
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}
