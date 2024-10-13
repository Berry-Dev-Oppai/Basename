import { NextRequest, NextResponse } from 'next/server';
import { getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NeynarAPIClient, User } from "@neynar/nodejs-sdk";
import axios from 'axios';

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');

interface BNSProfile {
  name: string;
  image?: string;
  description?: string;
}

async function getEthAddressForUser(username: string): Promise<string | null> {
  try {
    const userResponse = await neynarClient.lookupUserByUsername(username);
    const user = userResponse.result.user as User & { ethereum_address?: string };
    return user.ethereum_address || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

async function getBNSNameForAddress(ethAddress: string): Promise<string | null> {
  try {
    const response = await axios.get<{ name: string }>(`https://api.basedomain.io/address/${ethAddress}`);
    return response.data.name || null;
  } catch (error) {
    console.error('Error checking BNS ownership:', error);
    return null;
  }
}

async function getBNSProfile(bnsName: string): Promise<BNSProfile | null> {
  try {
    const response = await axios.get<BNSProfile>(`https://api.basename.io/${bnsName}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching BNS profile:', error);
    return null;
  }
}

export async function GET() {
  return new NextResponse(
    getFrameHtmlResponse({
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
    })
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { untrustedData } = body;
  const username = untrustedData?.inputText || '';

  try {
    const ethAddress = await getEthAddressForUser(username);
    if (!ethAddress) {
      throw new Error('Could not retrieve Ethereum address for user');
    }

    const bnsName = await getBNSNameForAddress(ethAddress);
    if (bnsName) {
      const bnsProfile = await getBNSProfile(bnsName);
      if (bnsProfile) {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [{ label: "Visit Profile" }],
            image: { src: bnsProfile.image || `${NEXT_PUBLIC_URL}/default-profile.png` },
            postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      } else {
        return new NextResponse(
          getFrameHtmlResponse({
            buttons: [{ label: "Try Again" }],
            image: { src: `${NEXT_PUBLIC_URL}/profile-not-found.png` },
            postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
          })
        );
      }
    } else {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [{ label: "Try Another" }],
          image: { src: `${NEXT_PUBLIC_URL}/no-bns-found.png` },
          postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
        })
      );
    }
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [{ label: "Try Again" }],
        image: { src: `${NEXT_PUBLIC_URL}/error.png` },
        postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      })
    );
  }
}

export const dynamic = 'force-dynamic';
