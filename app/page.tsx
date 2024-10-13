import { headers } from 'next/headers';

async function getFrameData() {
  try {
    const host = headers().get('host');
    const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const apiUrl = `${baseUrl}/api/frame`;

    const res = await fetch(apiUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching frame data:', error);
    return null;
  }
}

export default async function Home() {
  const frameData = await getFrameData();

  if (!frameData) {
    return <div>Error loading frame data</div>;
  }

  return (
    <html>
      <head>
        <title>Basename Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameData.image} />
        <meta property="fc:frame:button:1" content={frameData.buttons?.[0]?.label || 'Click me!'} />
      </head>
      <body>
        <h1>Welcome to Basename Frame</h1>
        {frameData.image && <img src={frameData.image} alt="Frame Image" />}
        <p>Frame data: {JSON.stringify(frameData)}</p>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
