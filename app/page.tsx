import { headers } from 'next/headers';
import ClientImage from './ClientImage';

interface FrameData {
  frame: {
    version: string;
    image: string;
    buttons: Array<{ label: string }>;
  }
}

async function getFrameData(): Promise<FrameData | null> {
  try {
    const host = headers().get('host');
    if (!host) {
      throw new Error('Host header is missing');
    }

    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;
    const imageName = 'frame-image.png';
    const imageUrl = `${baseUrl}/${imageName}`;

    return {
      frame: {
        version: 'vNext',
        image: imageUrl,
        buttons: [{ label: 'Click me!' }]
      }
    };
  } catch (error) {
    console.error('Error in getFrameData:', error);
    return null;
  }
}

export default async function Home() {
  const frameData = await getFrameData();

  return (
    <html lang="en">
      <head>
        <title>Basename Frame</title>
      </head>
      <body>
        <h1>Basename Frame</h1>
        {frameData && frameData.frame.image && (
          <ClientImage src={frameData.frame.image} alt="Basename Frame" />
        )}
        <p>Frame data: {JSON.stringify(frameData)}</p>
      </body>
    </html>
  );
}
