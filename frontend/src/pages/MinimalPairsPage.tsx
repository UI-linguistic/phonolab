/*





  Semih & Junho's original design





*/

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// Use the theme colors from theme.ts
const BG_COLOR = '#EFD9CE'; // Updated to match theme
const ORANGE = '#FF8C00'; // Updated to match theme
const DARK = '#333333'; // Updated to match theme
const PRIMARY = '#107E7D'; // Primary color from theme

const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  background: ${BG_COLOR};
  display: flex;
  flex-direction: column;
`;

const BackButtonRow = styled.div`
  padding: 1rem;
`;

const BackArrow = styled.div`
  font-size: 2.5rem;
  color: rgba(0, 0, 0, 0.3);
  user-select: none;
  cursor: pointer;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem 2rem 1rem;
`;

const Heading = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  color: ${DARK};
  margin: 0.5rem 0 2rem 0;
  text-align: center;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LeftColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DefinitionBox = styled.div`
  background: ${BG_COLOR};
  border: 2px solid ${DARK};
  border-radius: 8px;
  padding: 1.25rem 1.75rem;       /* keep some breathing room */
  font-size: 1rem;                /* slightly smaller text */
  text-align: center;
  color: ${DARK};
  max-width: 320px;               /* tweak to taste */
  width: 100%;
  align-self: center;             
`;

const StrongText = styled.strong`
  font-weight: 700;
`;

const TryLuckButton = styled.button`
  background: #F26522;
  color: #fff;
  border: 2px solid ${DARK};   
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 700;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  width: fit-content;             
  margin: 0 auto;              

`;

const ExamplesGrid = styled.div`
  flex: 1.2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;
`;

const ExampleCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 120px;
  border-radius: 8px;
  border: 2px solid ${DARK};
  background: ${props => props.color || BG_COLOR};
  cursor: pointer;
`;

const ExampleText = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: ${props => props.color || DARK};
  text-align: center;
  display: flex;
`;

const HighlightLetter = styled.span`
  color: ${props => props.color || ORANGE};
  font-weight: 800;
`;

const AudioIcon = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
`;

interface MinimalPair {
  ipa: [string, string];
  spell: [string, string];
  sounds: [string, string];
  highlight: [string, string];
  highlightSpell: [string, string];
}

const minimalPairs: MinimalPair[] = [
  {
    ipa: ['fɪl', 'fil'],
    spell: ['fill', 'feel'],
    sounds: ['/audio/fill.mp3', '/audio/feel.mp3'],
    highlight: ['ɪ', ''],
    highlightSpell: ['', 'ee'],
  }
];

const MinimalPairsPage: React.FC = () => {
  const [currentPair, setCurrentPair] = useState(0);
  const navigate = useNavigate();

  const playSound = (soundUrl: string) => {
    const audio = new Audio(soundUrl);
    audio.play();
  };

  const goToPairPlay = () => {
    navigate('/learn/pair-play');
  };

  const { ipa, spell, sounds, highlight, highlightSpell } = minimalPairs[currentPair];

  // Helper to render a word with highlighted part
  const renderWord = (word: string, highlightPart: string, color: string) => {
    if (!highlightPart || highlightPart.length === 0) return word;
    let idx = word.indexOf(highlightPart);
    if (idx === -1) return word;
    return (
      <>
        {word.slice(0, idx)}
        <HighlightLetter color={color}>{highlightPart}</HighlightLetter>
        {word.slice(idx + highlightPart.length)}
      </>
    );
  };

  // Speaker icon SVG component
  const SpeakerIcon: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 5L6 9H2V15H6L11 19V5Z" fill={dark ? "white" : "black"} />
      <path d="M15.54 8.46C16.4774 9.39764 17.0044 10.6692 17.0044 12C17.0044 13.3308 16.4774 14.6024 15.54 15.54" stroke={dark ? "white" : "black"} strokeWidth="2" />
      <path d="M18.07 5.93C19.9447 7.80528 20.9979 10.3478 20.9979 13C20.9979 15.6522 19.9447 18.1947 18.07 20.07" stroke={dark ? "white" : "black"} strokeWidth="2" />
    </svg>
  );

  return (
    <Container>
      <BackButtonRow>
        <BackArrow>←</BackArrow>
      </BackButtonRow>
      <Main>
        <Heading>Tricky Minimal Pairs</Heading>
        <ContentContainer>
          <LeftColumn>
            <DefinitionBox>
              <StrongText>Minimal pairs</StrongText> are two words that differ by only a <StrongText style={{ textDecoration: 'underline' }}>single</StrongText> sound (phoneme) yet have distinct meanings.
            </DefinitionBox>
            <TryLuckButton onClick={goToPairPlay}>
              Try your luck?
            </TryLuckButton>
          </LeftColumn>
          <ExamplesGrid>
            {/* First row: IPA/phonetic */}
            <ExampleCard>
              <AudioIcon>
                <SpeakerIcon />
              </AudioIcon>
              <ExampleText>
                {renderWord(ipa[0], highlight[0], PRIMARY)}
              </ExampleText>
            </ExampleCard>
            <ExampleCard color="#333">
              <AudioIcon>
                <SpeakerIcon dark />
              </AudioIcon>
              <ExampleText color="#EFD9CE">
                {renderWord(ipa[1], highlight[1], "#fff")}
              </ExampleText>
            </ExampleCard>
            {/* Second row: Spelling */}
            <ExampleCard>
              <ExampleText>
                {spell[0]}
              </ExampleText>
            </ExampleCard>
            <ExampleCard color="#333">
              <ExampleText color="#EFD9CE">
                {renderWord(spell[1], highlightSpell[1], ORANGE)}
              </ExampleText>
            </ExampleCard>
          </ExamplesGrid>
        </ContentContainer>
      </Main>
    </Container>
  );
};

export default MinimalPairsPage;