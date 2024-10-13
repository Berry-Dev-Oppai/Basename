import { headers } from 'next/headers';

async function getFrameData() {
  try {
    const host = headers().get('host');
    if (!host) {
      throw new Error('Host header is missing');
    }

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const imageName = 'Basename Frame.png';
    const imageUrl = `${baseUrl}/${imageName}`;

    console.log('Generated image URL:', imageUrl);

    // Attempt to fetch the image to verify its existence
    const imageResponse = await fetch(imageUrl, { method: 'HEAD' });
    if (!imageResponse.ok) {
      throw new Error(`Image not found: ${imageUrl}`);
    }

    const frameData = {
      frame: {
        version: 'vNext',
        image: imageUrl,
        buttons: [{ label: 'Click me!' }]
      }
    };

    console.log('Frame data generated:', JSON.stringify(frameData));
    return frameData;
  } catch (error) {
    console.error('Error in getFrameData:', error instanceof Error ? error.message : error);
    return null;
  }
}

export default async function Home() {
  const frameData = await getFrameData();

  if (!frameData) {
    console.error('Frame data is null');
    return (
      <html>
        <head>
          <title>Error - Basename Frame</title>
        </head>
        <body>
          <h1>Error loading frame data</h1>
          <p>Please check the server logs for more information.</p>
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <title>Basename Frame</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content={frameData.frame.image} />
        <meta property="fc:frame:button:1" content={frameData.frame.buttons[0].label} />
      </head>
      <body>
        <h1>Welcome to Basename Frame</h1>
        <img src={frameData.frame.image} alt="Frame Image" onError={(e) => {
          console.error('Image failed to load:', e);
          e.currentTarget.style.display = 'none';
        }} />
        <p>Frame data: {JSON.stringify(frameData)}</p>
      </body>
    </html>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
