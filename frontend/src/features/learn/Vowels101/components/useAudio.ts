// Vowels101/components/useAudio.ts (no style changes)
import { useRef } from 'react';

export function useAudio() {
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    const play = (src: string) => {
        if (audioRef.current.src !== src) {
            audioRef.current.pause();
            audioRef.current = new Audio(src);
        }
        audioRef.current.play();
    };

    return { play };
}