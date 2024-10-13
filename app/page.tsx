import { headers } from 'next/headers';

async function getFrameData() {
  const baseUrl = process?.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://basename-sooty.vercel.app';
  const imageName = 'Basename Frame.png';
  const imageUrl = `${baseUrl}/${imageName}`;

  return {
    frame: {
      version: 'vNext',
      image: imageUrl,
      buttons: [{ label: 'Click me!' }]
    }
  };
}

export default async function Home() {
  const { frame } = await getFrameData();

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
