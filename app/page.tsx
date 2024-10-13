import { headers } from 'next/headers';

async function getFrame() {
  try {
    const host = headers().get('host');
    const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
    const url = `${protocol}://${host}/api/frame`;
    console.log('Page: Fetching frame from:', url);
    
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Basename-Frame/1.0'
      },
      cache: 'no-store'
    });
    
    console.log('Page: Response status:', res.status);
    console.log('Page: Response headers:', JSON.stringify(Object.fromEntries(res.headers)));
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}, statusText: ${res.statusText}`);
    }
    
    const text = await res.text();
    console.log('Page: Raw response:', text);
    
    const data = JSON.parse(text);
    console.log('Page: Parsed frame data:', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Page: Error fetching frame:', error);
    return { frame: { image: '/fallback-image.png', buttons: [{ label: 'Error' }] } };
  }
}

export default async function Home() {
  const { frame } = await getFrame();

  return (
    <html>
      <head>
        <title>Basename Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frame.image} />
        <meta property="fc:frame:button:1" content={frame.buttons[0].label} />
      </head>
      <body>
        <h1>Welcome to Basename Frame</h1>
        <img src={frame.image} alt="Frame Image" />
        <p>Frame data: {JSON.stringify(frame)}</p>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
