import { NextResponse } from 'next/server';
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import axios from 'axios';

const neynarClient = new NeynarAPIClient(process.env.NEYNAR_API_KEY || '');

export async function GET(request: Request) {
  // Example usage of request
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // Example usage of axios
  const response = await axios.get(`https://api.example.com/data/${id}`);
  
  // Example usage of NeynarAPIClient
  const neynarResponse = await neynarClient.getUserByFid(1);

  return NextResponse.json({ 
    message: 'Hello from GET /api/frame',
    data: response.data,
    neynarData: neynarResponse
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  
  // Example usage of axios
  const response = await axios.post('https://api.example.com/data', body);
  
  // Example usage of NeynarAPIClient
  const neynarResponse = await neynarClient.publishCast(body.fid, body.message);

  return NextResponse.json({ 
    message: 'Hello from POST /api/frame',
    data: response.data,
    neynarData: neynarResponse
  });
}
