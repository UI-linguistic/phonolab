// Vowels101/components/useAudio.ts (no style changes)
import { useState, useCallback } from 'react';

export const useAudio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Define local fallback paths
    const LOCAL_AUDIO_PATH = '/sounds/vowels/';

    const play = useCallback(async (url?: string) => {
        if (!url) return;

        setError(null);
        setIsPlaying(true);

        try {
            console.log(`Attempting to play audio: ${url}`);
            const audio = new Audio(url);

            audio.onerror = (e) => {
                console.error(`Error playing audio from ${url}:`, e);
                setError(`Failed to play audio: ${url}`);

                // Try local fallback if external URL fails
                if (!url.startsWith('/sounds/')) {
                    // Extract vowel name from the URL
                    const vowelMatch = url.match(/\/([^\/]+)\.mp3$/);
                    if (vowelMatch && vowelMatch[1]) {
                        const vowelName = vowelMatch[1];
                        const fallbackUrl = `${LOCAL_AUDIO_PATH}${vowelName}.mp3`;
                        console.log(`Trying local fallback: ${fallbackUrl}`);

                        const fallbackAudio = new Audio(fallbackUrl);
                        fallbackAudio.onerror = () => {
                            console.error(`Fallback audio also failed: ${fallbackUrl}`);
                            setError(`Failed to play audio: ${url} (fallback also failed)`);
                        };

                        fallbackAudio.onended = () => setIsPlaying(false);
                        fallbackAudio.play()
                            .then(() => console.log(`Playing fallback: ${fallbackUrl}`))
                            .catch(e => console.error(`Fallback play error: ${e.message}`));
                    }
                }
            };

            audio.onended = () => setIsPlaying(false);

            await audio.play();
            console.log(`Playing: ${url}`);
        } catch (err) {
            console.error('Audio play error:', err);
            setError(`Error playing audio: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setIsPlaying(false);
        }
    }, []);

    return {
        play,
        isPlaying,
        error
    };
};

export default useAudio;