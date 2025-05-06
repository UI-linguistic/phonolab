import React, { useState } from 'react';
import styled from 'styled-components';

interface VowelData {
  description: string;
  example: string;
  audioFile: string;
  position: {
    top: string;
    left: string;
  };
}

interface VowelDataMap {
  [key: string]: VowelData;
}

// Constants for vowel data
const VOWEL_DATA: VowelDataMap = {
  'i': {
    description: 'High-Front Tense',
    example: "ee in 'see'",
    audioFile: '/audio/vowels/1-i_close_front_unrounded_vowel.mp3',
    position: { top: '10%', left: '10%' }
  },
  'ɪ': {
    description: 'High-Front Lax',
    example: "i in 'bit'",
    audioFile: '/audio/vowels/2-ɪ_near-close_near-front_unrounded_vowel.mp3',
    position: { top: '20%', left: '20%' }
  },
  'e': {
    description: 'Mid-Front Tense',
    example: "ay in 'say'",
    audioFile: '/audio/vowels/3-e_close-mid_front_unrounded_vowel.mp3',
    position: { top: '30%', left: '15%' }
  },
  'ɛ': {
    description: 'Mid-Front Lax',
    example: "e in 'bed'",
    audioFile: '/audio/vowels/4-ɛ_near-close_near-front_unrounded_vowel.mp3',
    position: { top: '40%', left: '20%' }
  },
  'æ': {
    description: 'Low-Front Lax',
    example: "a in 'cat'",
    audioFile: '/audio/vowels/5-æ_near-open_front_unrounded_vowel.mp3',
    position: { top: '70%', left: '15%' }
  },
  'ɑ': {
    description: 'Low-Back Lax',
    example: "ah in 'father'",
    audioFile: '/audio/vowels/6-ɑ_open_back_unrounded_vowel.mp3',
    position: { top: '80%', left: '80%' }
  },
  'ʌ': {
    description: 'Mid-Back Lax',
    example: "u in 'but'",
    audioFile: '/audio/vowels/7-ʌ_open-mid_back_unrounded_vowel.mp3',
    position: { top: '50%', left: '60%' }
  },
  'ɔ': {
    description: 'Low-Back Rounded',
    example: "aw in 'law'",
    audioFile: '/audio/vowels/8-ɔ_open-mid_back_rounded_vowel.mp3',
    position: { top: '70%', left: '70%' }
  },
  'o': {
    description: 'Mid-Back Rounded',
    example: "o in 'go'",
    audioFile: '/audio/vowels/9-o_close-mid_back_rounded_vowel.mp3',
    position: { top: '30%', left: '75%' }
  },
  'u': {
    description: 'High-Back Rounded',
    example: "oo in 'blue'",
    audioFile: '/audio/vowels/10-u_close_back_rounded_vowel.mp3',
    position: { top: '10%', left: '85%' }
  },
  'ʊ': {
    description: 'High-Back Lax Rounded',
    example: "oo in 'book'",
    audioFile: '/audio/vowels/11-ʊ_near-close_near-back_rounded_vowel.mp3',
    position: { top: '20%', left: '75%' }
  },
  'ə': {
    description: 'Mid-Central (Schwa)',
    example: "a in 'sofa'",
    audioFile: '/audio/vowels/12-ə_mid-central_vowel.mp3',
    position: { top: '45%', left: '45%' }
  }
};

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #F7D9CB;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #23243a;
  text-align: center;
  margin-bottom: 2rem;
`;

const ContentArea = styled.div`
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  width: 100%;
`;

const ChartContainer = styled.div`
  flex: 1;
  position: relative;
  min-height: 600px;
  border: 3px solid #232323;
  border-radius: 8px;
  background: #fff;
  padding: 2rem;
`;

const VowelTrapezoid = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
  background: linear-gradient(135deg, #fff8f5 0%, #ffe9e0 100%);
  border: 2px solid #232323;
`;

const VowelSymbol = styled.div<{ top: string; left: string; active: boolean }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  transform: translate(-50%, -50%);
  font-size: 1.8rem;
  font-weight: 500;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.active ? '#F2652280' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: #F2652280;
    transform: translate(-50%, -50%) scale(1.1);
  }
`;

const InfoBox = styled.div`
  width: 300px;
  padding: 2rem;
  background: #fff;
  border: 3px solid #232323;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

const InfoTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: #23243a;
  text-align: center;
`;

const InfoDescription = styled.p`
  font-size: 1.2rem;
  color: #23243a;
  margin-bottom: 0.5rem;
  text-align: center;
`;

const InfoExample = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const PlayButton = styled.button`
  background: #F26522;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;

  &:hover {
    background: #d94e0f;
  }
`;

const MapVowelSpace: React.FC = () => {
  const [activeVowel, setActiveVowel] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleVowelHover = (vowel: string) => {
    setActiveVowel(vowel);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    const newAudio = new Audio(VOWEL_DATA[vowel].audioFile);
    setAudio(newAudio);
    newAudio.play();
  };

  const handleVowelLeave = () => {
    setActiveVowel(null);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <Container>
      <Main>
        <Title>Explore the Vowel Space</Title>
        <ContentArea>
          <ChartContainer>
            <VowelTrapezoid>
              {Object.entries(VOWEL_DATA).map(([symbol, data]) => (
                <VowelSymbol
                  key={symbol}
                  top={data.position.top}
                  left={data.position.left}
                  active={activeVowel === symbol}
                  onMouseEnter={() => handleVowelHover(symbol)}
                  onMouseLeave={handleVowelLeave}
                >
                  {symbol}
                </VowelSymbol>
              ))}
            </VowelTrapezoid>
          </ChartContainer>
          <InfoBox>
            {activeVowel ? (
              <>
                <InfoTitle>{activeVowel}</InfoTitle>
                <InfoDescription>{VOWEL_DATA[activeVowel].description}</InfoDescription>
                <InfoExample>{VOWEL_DATA[activeVowel].example}</InfoExample>
                <PlayButton onClick={() => {
                  if (audio) {
                    audio.currentTime = 0;
                    audio.play();
                  }
                }}>
                  Play Sound
                </PlayButton>
              </>
            ) : (
              <>
                <InfoTitle>Vowel Map</InfoTitle>
                <InfoDescription>Hover over a vowel symbol to learn more</InfoDescription>
              </>
            )}
          </InfoBox>
        </ContentArea>
      </Main>
    </Container>
  );
};

export default MapVowelSpace;
