import React, { useState, useCallback, useMemo } from 'react';
import { Box, Center } from '@mantine/core';
import { Text } from '@components/typography/PageTypography';
import { Vowels101Instructions } from '@components/ui/InstructionWrappers';
import { MediaCell } from '@components/display';
import styled from 'styled-components';
import TongueGrid from './TongueGrid';
import vowelsData from '@api/fallback/vowels-101.json';

// Import images directly (webpack will handle them)
import iTongue from '@assets/images/tongue/1-high-front_1-i-side-mouth.png';
import ɪTongue from '@assets/images/tongue/1-high-front_2-ɪ-side-mouth.png';
import ɛTongue from '@assets/images/tongue/2-mid-front_4-ɛ-side-mouth.png';
import æTongue from '@assets/images/tongue/3-low-front_5-æ-side-mouth.png';
import ʌTongue from '@assets/images/tongue/5-mid-central_6-ʌ-side-mouth.png';
import əTongue from '@assets/images/tongue/5-mid-central_7-ə-side-mouth.png';
import ʊTongue from '@assets/images/tongue/7-high-back_11-ʊ-side-mouth.png';
import uTongue from '@assets/images/tongue/7-high-back_12-u-side-mouth.png';
import ɔTongue from '@assets/images/tongue/8-mid-back_8-ɔ-side-mouth.png';
import ɑTongue from '@assets/images/tongue/9-low-back_6-ɑ-side-mouth.png';

// Styled container for the grid
const GridContainer = styled.div`
  width: fit-content;
  max-width: 380px; /* Match the grid size */
  margin: 0 auto;
  padding: 0.15rem; /* Even smaller padding */
  background-color: transparent; /* Changed from theme.colors.backgroundAccent to transparent */
  border-radius: ${({ theme }) => theme.borderRadius};
  /* Removed box-shadow for transparency */
  overflow: hidden; /* Prevent content from overflowing */
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

// Styled container for the media section
const MediaContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  padding-top: 1rem;
`;

const MediaTitle = styled.div`
  font-size: 1.25rem;
  color: #8b2252;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  visibility: hidden; /* Hidden but preserves spacing */
`;

const MediaContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// Styled container for the tongue diagram image with consistent dimensions
const TongueDiagramContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end; /* Align to bottom */
  width: 100%;
  max-width: 300px;
  min-height: 350px; /* Maintain consistent height */
  margin: 0 auto;
  margin-top: auto; /* Push content to bottom */
  padding-bottom: 2rem;
`;

const TongueImageWrapper = styled.div`
  width: 100%;
  height: 280px; /* Fixed height for the image area */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const VowelLabel = styled(Text)`
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
`;

// Define vowel type for better type safety
type VowelSymbol = 'i' | 'ɪ' | 'e' | 'ɛ' | 'æ' | 'ʌ' | 'ə' | 'ʊ' | 'u' | 'o' | 'ɔ' | 'ɑ';

// Map of vowel symbols to their tongue position images
const tongueImages: Record<VowelSymbol, string> = {
    'i': iTongue,
    'ɪ': ɪTongue,
    'e': ɛTongue, // No exact match, using closest
    'ɛ': ɛTongue,
    'æ': æTongue,
    'ʌ': ʌTongue,
    'ə': əTongue,
    'ʊ': ʊTongue,
    'u': uTongue,
    'o': ɔTongue, // No exact match, using closest
    'ɔ': ɔTongue,
    'ɑ': ɑTongue,
};

// Helper function to find the audio URLs for a vowel based on its IPA symbol
const getVowelAudioUrls = (vowelIpa: VowelSymbol): string[] => {
    // Search through all the vowels in the grid
    for (const row of vowelsData.content.tongue_position.grid) {
        for (const col of row) {
            if (!col) continue;

            const vowel = col.find(v => v.ipa === vowelIpa);
            if (vowel) {
                return vowel.audio_url;
            }
        }
    }
    return [];
};

// Note: This component doesn't need a container as Vowels101Layout 
// already provides a three-column structure

export default function TongueSection() {
    const [activeVowel, setActiveVowel] = useState<VowelSymbol | null>(null);
    const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
    const [currentAudioIndex, setCurrentAudioIndex] = useState(0);

    // Handle vowel click events with useCallback to prevent unnecessary re-renders
    const handleVowelClick = useCallback((vowel: string, audioUrl: string) => {
        // Check if the vowel is a valid VowelSymbol
        if (!Object.keys(tongueImages).includes(vowel)) {
            console.error(`No tongue diagram for vowel: ${vowel}`);
            return;
        }

        const validVowel = vowel as VowelSymbol;

        // If clicking the same vowel again, replay the audio
        if (validVowel === activeVowel && audioElement) {
            audioElement.currentTime = 0;
            audioElement.play().catch(err => console.error('Error playing audio:', err));
            return;
        }

        // Stop any currently playing audio
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }

        setActiveVowel(validVowel);

        // Reset audio index to try first URL first
        setCurrentAudioIndex(0);

        // Get all possible audio URLs for this vowel
        const audioUrls = getVowelAudioUrls(validVowel);

        if (audioUrls.length > 0) {
            playAudio(validVowel, audioUrls, 0);
        } else {
            console.warn(`No audio URLs found for vowel: ${validVowel}`);
        }
    }, [activeVowel, audioElement]);

    // Helper function to play audio with fallback logic
    const playAudio = useCallback((vowel: VowelSymbol, audioUrls: string[], index: number) => {
        if (index >= audioUrls.length) {
            console.error(`No working audio URL for vowel: ${vowel}`);
            return;
        }

        const url = audioUrls[index];
        console.log(`Playing audio from: ${url}`);

        const audio = new Audio(url);
        setAudioElement(audio);
        setCurrentAudioIndex(index);

        // Handle errors - try the next URL if this one fails
        audio.onerror = () => {
            console.error(`Failed to load audio for vowel: ${vowel} from URL: ${url}`);
            // Try the next URL if available
            if (index < audioUrls.length - 1) {
                playAudio(vowel, audioUrls, index + 1);
            }
        };

        // Play the audio
        audio.play().catch(err => {
            console.error('Error playing audio:', err);
            // Try the next URL if available
            if (index < audioUrls.length - 1) {
                playAudio(vowel, audioUrls, index + 1);
            }
        });
    }, []);

    // Memoize the sections to prevent unnecessary re-renders
    const instructionsSection = useMemo(() => (
        <Vowels101Instructions />
    ), []);

    const gridSection = useMemo(() => (
        <GridContainer>
            <TongueGrid onVowelClick={handleVowelClick} />
        </GridContainer>
    ), [handleVowelClick]);

    const mediaSection = useMemo(() => (
        <MediaContainer>
            <MediaTitle>Tongue Diagram</MediaTitle>
            <MediaContent>
                <TongueDiagramContainer>
                    <TongueImageWrapper>
                        {activeVowel && tongueImages[activeVowel] ? (
                            <img
                                src={tongueImages[activeVowel]}
                                alt={`Tongue position for the vowel ${activeVowel}`}
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        ) : (
                            <Text>Select a vowel to see its tongue position</Text>
                        )}
                    </TongueImageWrapper>
                    <VowelLabel>
                        {activeVowel ? `Vowel: ${activeVowel}` : ''}
                    </VowelLabel>
                </TongueDiagramContainer>
            </MediaContent>
        </MediaContainer>
    ), [activeVowel]);

    // Return all three sections as siblings - Vowels101Layout will arrange them in columns
    return (
        <>
            {instructionsSection}
            {gridSection}
            {mediaSection}
        </>
    );
}
