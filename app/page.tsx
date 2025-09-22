'use client';

import Image from 'next/image';
import Link from 'next/link';
import Maxwell from '@/public/images/maxwell.jpeg';
import { useEffect, useState } from 'react';
import { useAudio } from '@/hooks/useAudio';

export default function HomePage() {
  const { play, stop } = useAudio('/audio/tema.mp3');
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted) {
      play();
    }

    return () => {
      stop();
    };
  }, [hasInteracted, play, stop]);

  const handleInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <main onClick={handleInteraction} className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <Image src={Maxwell} alt="Maxwell" className='w-1/3 m-auto' />
        <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-lg mt-4">
          Show do Milhão do Eletromagnetismo
        </h1>
        <p className="mt-4 text-lg text-gray-300">
          Teste seus conhecimentos em Física III!
        </p>
        <Link 
          href="/quiz" 
          className="mt-8 inline-block rounded-full bg-blue-600 px-12 py-4 text-2xl font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-blue-500"
        >
          Começar o Jogo!
        </Link>
        {!hasInteracted && (
          <p className="mt-12 animate-pulse text-sm text-gray-400">
            Clique em qualquer lugar para ativar o som
          </p>
        )}
      </div>
    </main>
  );
}