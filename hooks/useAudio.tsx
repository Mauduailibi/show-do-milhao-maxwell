import { useCallback, useEffect, useState } from 'react';

export const useAudio = (url: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    setAudio(new Audio(url));
  }, [url]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio]);

  const stop = useCallback(() => {
    if(audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [audio])

  return { play, stop };
};