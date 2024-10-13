'use client';

import Image from 'next/image';

export default function ClientImage({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} width={500} height={500} />;
}
