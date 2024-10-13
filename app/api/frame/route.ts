import { NextRequest, NextResponse } from 'next/server';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { ethers } from 'ethers';

console.log('New version of route.ts is being executed - ' + new Date().toISOString());
console.log('Environment variables:', {
  NEYNAR_API_KEY: process.env.NEYNAR_API_KEY ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV,
});

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_RPC_URL);

// Base ENS contract address (you'll need to verify this)
const BASE_ENS_CONTRACT = '0x4a067EE58e73ac5E4a43722E008DFdf65B2bF348';

async function getBasename(address: string): Promise<string | null> {
  const abi = ["function tokenURI(uint256 tokenId) view returns (string)"];
  const contract = new ethers.Contract(BASE_ENS_CONTRACT, abi, provider);

  try {
    // This is a simplified approach. You might need to adjust based on how Base ENS NFTs are structured
    const balance = await contract.balanceOf(address);
    if (balance.gt(0)) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, 0);
      const tokenURI = await contract.tokenURI(tokenId);
      // Parse the tokenURI to extract the basename
      // This will depend on how the tokenURI is structured
      return parseBasenameFromTokenURI(tokenURI);
    }
  } catch (error) {
    console.error('Error fetching basename:', error);
  }
  return null;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  console.log('POST request received - ' + new Date().toISOString());

  try {
    const data = await req.json();
    console.log('Request data:', JSON.stringify(data, null, 2));

    const { untrustedData } = data;
    const inputText = untrustedData?.inputText;

    console.log('Input text:', inputText);

    const searchResult = await neynarClient.searchUser(inputText);
    console.log('API response:', JSON.stringify(searchResult, null, 2));

    if (searchResult.result.users && searchResult.result.users.length > 0) {
      const user = searchResult.result.users[0];
      const ethAddress = user.verified_addresses?.eth_addresses?.[0];

      let basename = 'No basename found';
      if (ethAddress) {
        basename = await getBasename(ethAddress) || 'No basename found';
      }

      const response = `Found user @${user.username}. Custody address: ${user.custody_address}. Basename: ${basename}`;
      const imageUrl = user.pfp_url || 'http://localhost:3000/default-image.png';

      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${imageUrl}" />
            <meta property="fc:frame:input:text" content="Enter username" />
            <meta property="fc:frame:button:1" content="Search" />
          </head>
          <body>
            <p>${response}</p>
          </body>
        </html>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    } else {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="http://localhost:3000/profile-not-found.png" />
            <meta property="fc:frame:input:text" content="Enter username" />
            <meta property="fc:frame:button:1" content="Search" />
          </head>
          <body>
            <p>User @${inputText} not found.</p>
          </body>
        </html>`,
        {
          status: 200,
          headers: { 'Content-Type': 'text/html' },
        }
      );
    }
  } catch (error) {
    console.error('Error in POST function:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="http://localhost:3000/error.png" />
          <meta property="fc:frame:input:text" content="Enter username" />
          <meta property="fc:frame:button:1" content="Try Again" />
        </head>
        <body>
          <p>Error: ${error.message}</p>
        </body>
      </html>`,
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const baseUrl = getBaseUrl(req);
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${baseUrl}${process.env.DEFAULT_FRAME_IMAGE || '/default-frame.png'}" />
        <meta property="fc:frame:input:text" content="Enter username" />
        <meta property="fc:frame:button:1" content="Search" />
      </head>
      <body>
        <p>Enter a Farcaster username to look up their basename.</p>
      </body>
    </html>`,
    {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    }
  );
}
