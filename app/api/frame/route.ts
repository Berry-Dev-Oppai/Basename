import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello from GET /api/frame' });
}

export async function POST(request: Request) {
  return NextResponse.json({ message: 'Hello from POST /api/frame' });
}
