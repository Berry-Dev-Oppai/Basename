import { NextResponse } from 'next/server';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import axios from 'axios';

export async function GET(request: Request) {
  // Your GET handler logic here
  return NextResponse.json({ message: 'Hello from GET /api/frame' });
}

export async function POST(request: Request) {
  // Your POST handler logic here
  return NextResponse.json({ message: 'Hello from POST /api/frame' });
}
