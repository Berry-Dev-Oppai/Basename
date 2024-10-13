import { headers } from 'next/headers';

async function getFrame() {
  const host = headers().get('host');
  const protocal = process?.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocal}://${host}/api/frame`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch frame');
  }
  return res.json();
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
      </body>
    </html>
  );
}
