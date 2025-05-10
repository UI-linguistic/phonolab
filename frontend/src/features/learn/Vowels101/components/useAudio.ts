// Vowels101/components/useAudio.ts (no style changes)
import { useRef } from 'react';

export function useAudio() {
    const audioRef = useRef<HTMLAudioElement>(new Audio());

    const play = (src: string) => {
        // [0] is local path of files
        // [1] is s3 amazon link
        const urls = src.split(',');
        const audioSrc = urls.length > 1 ? urls[1] : src;

        if (audioRef.current.src !== audioSrc) {
            audioRef.current.pause();
            audioRef.current = new Audio(audioSrc);
        }
        audioRef.current.play();
    };

    return { play };
}