import { headers } from 'next/headers';
import ClientImage from './ClientImage';

async function getFrameData() {
  // ... (keep your existing getFrameData function)
}

export default async function Home() {
  const frameData = await getFrameData();

  return (
    <html>
      <head>
        <title>Basename Frame</title>
      </head>
      <body>
        <h1>Basename Frame</h1>
        {frameData && (
          <ClientImage src={frameData.frame.image} alt="Basename Frame" />
        )}
        <p>Frame data: {JSON.stringify(frameData)}</p>
      </body>
    </html>
  );
}
