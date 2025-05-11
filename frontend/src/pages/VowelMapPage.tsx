import React, { useState } from 'react';
import styled from 'styled-components';
import unroundedLipImg from '../images/PNG/pronounmouthart-03.png';
import roundedLipImg from '../images/PNG/pronounmouthart-02.png';
import { useNavigate } from 'react-router-dom';


// Import all vowel images
const vowelImages: { [key: string]: string } = {
  'i': require('../images/GIF/1-high-front_1-i-side-mouth.png'),
  'ɪ': require('../images/GIF/1-high-front_2-ɪ-side-mouth.png'),
  'ʊ': require('../images/GIF/7-high-back_11-ʊ-side-mouth.png'),
  'u': require('../images/GIF/7-high-back_12-u-side-mouth.png'),
  'e': require('../images/GIF/2-mid-front_3-ei-dipthong-side-mouth.gif'),
  'ɛ': require('../images/GIF/2-mid-front_4-ɛ-side-mouth.png'),
  'ʌ': require('../images/GIF/5-mid-central_6-ʌ-side-mouth.png'),
  'ə': require('../images/GIF/5-mid-central_7-ə-side-mouth.png'),
  'o': require('../images/GIF/8-mid-back_9-diphthong-oʊ-side-mouth.gif'),
  'ɔ': require('../images/GIF/8-mid-back_8-ɔ-side-mouth.png'),
  'æ': require('../images/GIF/3-low-front_5-æ-side-mouth.png'),
  'ɑ': require('../images/GIF/9-low-back_6-ɑ-side-mouth.png'),
};

const BG_COLOR = '#F7D9CB';
const ORANGE = '#F26522';
const DARK = '#23243a';
const GRID_BORDER = '#232323';
const OUTLINE = '#F26522';

const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${BG_COLOR};
  display: flex;
  flex-direction: column;
`;
//when arrow exsits
// const BackButtonRow = styled.div`
//   padding: 1.5rem 2.5rem 0.5rem 2.5rem;
//   display: flex;
//   justify-content: flex-end; // Changed from space-between to flex-end
//   align-items: center;
// `;

// // The TrickyPairButton stays the same
// const TrickyPairButton = styled.button`
//   background: #EFD9CE;
//   color: #23243a;
//   border: 2px solid #232323;
//   border-radius: 16px;
//   font-size: 1.1rem;
//   font-weight: bold;
//   padding: 0.5rem 1.5rem;
//   cursor: pointer;
//   box-shadow: 0 2px 6px rgba(0,0,0,0.1);
//   transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  
//   &:hover {
//     background: #e5c9b9;
//     box-shadow: 0 3px 8px rgba(0,0,0,0.15);
//     transform: translateY(-1px);
//   }
// `;

// when back arrow exist
const BackButtonRow = styled.div`
  padding: 1.5rem 2.5rem 0.5rem 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BackArrow = styled.div`
  font-size: 2.5rem;
  color: #d3cfc7;
  user-select: none;
`;

// Add new styled component for the Tricky Pair button
const TrickyPairButton = styled.button`
  background: #EFD9CE;
  color: #23243a;
  border: 2px solid #F05D23;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: bold;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  
  &:hover {
    background: #e5c9b9;
    box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    transform: translateY(-1px);
  }
`;


const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem 2rem;
`;

const Heading = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  color: ${DARK};
  margin: 1.5rem 0 2.2rem 0;
  text-align: center;
`;

const Tabs = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto 2.5rem auto;
`;

const TabButton = styled.button<{ active?: boolean }>`
  background: ${({ active }) => (active ? ORANGE : BG_COLOR)};
  color: ${({ active }) => (active ? '#fff' : '#23243a')};
  border: 2px solid ${({ active }) => (active ? '#232323' : OUTLINE)};
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1.1rem 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  min-width: 200px;
  text-align: center;
  &:hover {
    background: ${({ active }) => (active ? '#d94e0f' : '#ffe5d3')};
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    transform: translateY(-2px);
  }
`;

const ContentRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  margin-top: 1.5rem;
`;

const DescriptionCol = styled.div`
  width: 22%;
  min-width: 220px;
  max-width: 300px;
  padding-right: 2rem;
  color: #23243a;
  font-size: 1.08rem;
  .front { color: #8a3c4a; font-weight: bold; }
  .high { color: #1a9a9a; font-weight: bold; }
  p { font-weight: bold; margin-bottom: 1.2rem; }
  margin-top: 50px;
`;

const GridCol = styled.div`
  width: 38%;
  min-width: 320px;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GridAlignArea = styled.div`
  display: grid;
  grid-template-columns: auto auto 1fr;
  grid-template-rows: auto 1fr;
  gap: 0;
`;

const VOWEL_CELL_SIZE = '6rem';
const GRID_WIDTH = `calc(3 * ${VOWEL_CELL_SIZE})`;
const GRID_HEIGHT = `calc(3 * ${VOWEL_CELL_SIZE})`;

const VerticalLabels = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  height: 18rem;
  margin-top: 1.2rem;
  margin-right: 1.2rem;
`;

const VerticalLabel = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #1a9a9a;
  font-weight: bold;
  font-size: 1.25rem;
  margin-right: 0.7rem;
`;

const VerticalArrowCol = styled.div`
  grid-row: 2 / 3;
  grid-column: 2 / 3;
  display: flex;
  align-items: center;
  height: 18rem;
  margin-top: 1rem;
`;

const HorizontalLabels = styled.div`
  grid-row: 1 / 2;
  grid-column: 3 / 4;
  display: grid;
  grid-template-columns: repeat(3, ${VOWEL_CELL_SIZE});
  justify-items: center;
  align-items: end;
  width: 18rem;
  margin-bottom: 0.2rem;
`;

const HorizontalLabel = styled.div`
  color: #8a3c4a;
  font-weight: bold;
  font-size: 1.1rem;
`;

const GridWithArrows = styled.div`
  grid-row: 2 / 3;
  grid-column: 3 / 4;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HorizontalArrow = styled.div`
  width: 18rem;
  display: flex;
  justify-content: center;
  margin-bottom: 0.2rem;
`;

const VowelGridWrapper = styled.div`
  position: relative;
  background: ${BG_COLOR};
  border: 4px solid #232323;
  padding: 1.2rem;
  border-radius: 6px;
`;

const VowelGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const VowelGridRow = styled.div`
  display: flex;
`;

// const VowelCell = styled.div<{ selected?: boolean; selectable?: boolean; }>`
//   display: flex;
//   flex-direction: row;
//   align-items: center;
//   justify-content: center;
//   font-size: 2.2rem;
//   font-weight: 700;
//   border: 1.5px solid ${GRID_BORDER};
//   background: ${({ selected }) => (selected ? '#F2652280' : 'transparent')};
//   color: #23243a;
//   cursor: pointer;
//   transition: background 0.2s, color 0.2s;
//   width: 6rem;
//   height: 6rem;
// `;
const VowelCell = styled.div<{
  selected?: boolean;
  selectable?: boolean;     /* NEW */
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 700;
  border: 1.5px solid ${GRID_BORDER};

  /* clicked‑state colour */
  background: ${({ selected }) => (selected ? '#F2652280' : 'transparent')};

  /* pointer only when there is something to click */
  cursor: ${({ selectable }) => (selectable ? 'pointer' : 'default')};
  transition: background 0.2s, color 0.2s;

  width: 6rem;
  height: 6rem;

  /* 🔸 highlight on hover */
  &:hover {
    background: ${({ selectable, selected }) =>
      selectable && !selected ? '#F2652230' : undefined};
  }
`;

const MouthCol = styled.div`
  width: 22%;
  min-width: 220px;
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const vowels = [
  // Row 1
  [["i", "ɪ"], [], ["ʊ", "u"]],
  // Row 2
  [["e", "ɛ"], ["ʌ", "ə"], ["o", "ɔ"]],
  // Row 3
  [["æ"], [], ["ɑ"]],
];

const vowelAudioMap: { [key: string]: string } = {
  'i': '/audio/vowels/1-i_close_front_unrounded_vowel.mp3',
  'ɪ': '/audio/vowels/2-ɪ_near-close_near-front_unrounded_vowel.mp3',
  'ʊ': '/audio/vowels/11-ʊ_near-close_near-back_rounded_vowel.mp3',
  'u': '/audio/vowels/10-u_close_back_rounded_vowel.mp3',
  'e': '/audio/vowels/3-e_close-mid_front_unrounded_vowel.mp3',
  'ɛ': '/audio/vowels/4-ɛ_near-close_near-front_unrounded_vowel.mp3',
  'ʌ': '/audio/vowels/7-ʌ_open-mid_back_unrounded_vowel.mp3',
  'ə': '/audio/vowels/12-ə_mid-central_vowel.mp3',
  'o': '/audio/vowels/9-o_close-mid_back_rounded_vowel.mp3',
  'ɔ': '/audio/vowels/8-ɔ_open-mid_back_rounded_vowel.mp3',
  'æ': '/audio/vowels/5-æ_near-open_front_unrounded_vowel.mp3',
  'ɑ': '/audio/vowels/6-ɑ_open_back_unrounded_vowel.mp3',
};

const lipVowelGrid = [
  ['i', 'ɪ', 'e', 'ɛ'],
  ['æ', 'ɑ', 'ə', 'ʌ'],
  ['ɔ', 'o', 'ʊ', 'u'],
];

const LipCircle = styled.div<{ active?: boolean }>`
  width: 220px;
  height: 220px;
  border-radius: 50%;
  background: #d3cfc7;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 2.5rem;
  box-shadow: ${({ active }) => (active ? '0 4px 16px #f2652240' : 'none')};
  border: 4px solid ${({ active }) => (active ? '#F26522' : '#bdbdbd')};
  cursor: pointer;
  transition: border 0.2s, box-shadow 0.2s;
`;

const LipLabel = styled.div<{ active?: boolean }>`
  text-align: center;
  margin-top: 1.2rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ active }) => (active ? '#1a9a9a' : '#888')};
`;

const LipCirclesRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-top: 2.5rem;
  margin-bottom: 0.5rem;
`;

const LipLabelsRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 8.5rem;
`;

const LipGridCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
`;

const LipVowelGridWrapper = styled.div`
  background: ${BG_COLOR};
  border: 4px solid #232323;
  padding: 1.2rem 1.2rem 0.7rem 1.2rem;
  border-radius: 6px;
  margin-top: 0.7rem;
`;

const LipVowelGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const LipVowelGridRow = styled.div`
  display: flex;
`;

const LipVowelCell = styled.div<{ highlight?: boolean }>`
  width: 3.5rem;
  height: 3.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
  font-weight: 700;
  border: 2px solid #232323;
  background: ${({ highlight }) => (highlight ? '#F26522' : BG_COLOR)};
  color: ${({ highlight }) => (highlight ? '#fff' : '#23243a')};
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
`;

const LipVowelGridTitle = styled.div`
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.2rem;
`;

const LipVowelGridSubtitle = styled.div`
  font-size: 1rem;
  color: #888;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const VowelMapPage: React.FC = () => {
  const [selectedVowel, setSelectedVowel] = useState('i');
  const [lipShape, setLipShape] = useState<'unrounded' | 'rounded'>('unrounded');
  const [activeTab, setActiveTab] = useState<'tongue' | 'lip' | 'length'>('tongue');
  const navigate = useNavigate();
  // Play sound for a given vowel symbol
  const playVowelSound = (vowel: string) => {
    const url = vowelAudioMap[vowel];
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
    setSelectedVowel(vowel);
  };

  // Helper to determine which vowels to highlight
  const highlightRows = lipShape === 'unrounded' ? [0, 1] : [2];

  return (
    <Container>
      <BackButtonRow>
        <BackArrow onClick={() => navigate('/learn')}>
          &larr;
        </BackArrow>

        <TrickyPairButton onClick={() => navigate('/learn/tricky-pairs')}>
          Next Learning Page
        </TrickyPairButton>
      </BackButtonRow>
      <Main>
        <Heading>Vowels are organized in three ways:</Heading>
        <Tabs>
          <TabButton active={activeTab === 'tongue'} onClick={() => setActiveTab('tongue')}>Tongue Position</TabButton>
          <TabButton active={activeTab === 'lip'} onClick={() => setActiveTab('lip')}>Lip Shape</TabButton>
          <TabButton active={activeTab === 'length'} onClick={() => setActiveTab('length')}>Length</TabButton>
        </Tabs>
        {activeTab === 'tongue' && (
          <ContentRow>
            {/* Left Description */}
            <DescriptionCol>
              <p>
                Vowels are distinguished by the part of the tongue used to make the sound
                (<span className="front">front to back</span>)...
              </p>
              <p>
                And the placement of the tongue relative to the roof of the mouth
                (<span className="high">high to low</span>).
              </p>
              <p>
                <strong>Click</strong> a vowel in the grid to hear it and learn how to place your tongue!
              </p>
            </DescriptionCol>
            {/* Middle Grid */}
            <GridCol>
              <GridAlignArea>
                <VerticalLabels>
                  <VerticalLabel>High</VerticalLabel>
                  <VerticalLabel>Mid</VerticalLabel>
                  <VerticalLabel>Low</VerticalLabel>
                </VerticalLabels>
                <VerticalArrowCol>
                  <svg width="16" height="240" viewBox="0 0 16 240">
                    <line x1="8" y1="10" x2="8" y2="230" stroke="#888" strokeWidth="2" />
                    <polygon points="8,10 4,20 12,20" fill="#888" />
                    <polygon points="8,230 4,220 12,220" fill="#888" />
                  </svg>
                </VerticalArrowCol>
                <HorizontalLabels>
                  <HorizontalLabel>Front</HorizontalLabel>
                  <HorizontalLabel>Central</HorizontalLabel>
                  <HorizontalLabel>Back</HorizontalLabel>
                </HorizontalLabels>
                <GridWithArrows>
                  <HorizontalArrow>
                    <svg width="180" height="16" viewBox="0 0 180 16">
                      <line x1="10" y1="8" x2="170" y2="8" stroke="#888" strokeWidth="2" />
                      <polygon points="10,8 20,4 20,12" fill="#888" />
                      <polygon points="170,8 160,4 160,12" fill="#888" />
                    </svg>
                  </HorizontalArrow>
                  <VowelGridWrapper>
                    <VowelGrid>
                      {vowels.map((row, rowIdx) => (
                        <VowelGridRow key={rowIdx}>
                          {row.map((cell, colIdx) => (
                            <VowelCell
                              key={rowIdx + '-' + colIdx}
                              selectable={cell.length > 0}                 
                              style={{ cursor: cell[0] ? 'pointer' : 'default' }}
                              selected={cell.some(vowel => vowel === selectedVowel)}
                            >
                              {cell.map((symbol, i) => (
                                <span
                                  key={symbol}
                                  style={{
                                    fontSize: '2.1rem',
                                    lineHeight: 1,
                                    margin: cell.length === 2 ? '0 0.3em' : 0,
                                    background: selectedVowel === symbol ? '#ffe94d' : undefined,
                                    borderRadius: selectedVowel === symbol ? 4 : undefined,
                                    padding: selectedVowel === symbol ? '0 0.2em' : undefined,
                                    cursor: 'pointer',
                                    transition: 'background 0.2s',
                                  }}
                                  onClick={() => playVowelSound(symbol)}
                                >
                                  {symbol}
                                </span>
                              ))}
                            </VowelCell>
                          ))}
                        </VowelGridRow>
                      ))}
                    </VowelGrid>
                  </VowelGridWrapper>
                </GridWithArrows>
              </GridAlignArea>
            </GridCol>
            {/* Right Mouth */}
            <MouthCol>
              <img 
                src={vowelImages[selectedVowel]} 
                alt={`Tongue position for ${selectedVowel}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '280px'
                }}
              />
            </MouthCol>
          </ContentRow>
        )}
        {activeTab === 'lip' && (
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '1100px',
              margin: '0 auto',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '2.5rem',
              gap: '8rem'
            }}
          >
            {/* Unrounded lips column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LipCircle active={lipShape === 'unrounded'} onClick={() => setLipShape('unrounded')}>
                <img src={unroundedLipImg} alt="Unrounded lips" style={{ width: '140px', height: 'auto' }} />
              </LipCircle>
              <LipLabel active={lipShape === 'unrounded'}>Unrounded</LipLabel>
            </div>
            {/* Rounded lips column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LipCircle active={lipShape === 'rounded'} onClick={() => setLipShape('rounded')}>
                <img src={roundedLipImg} alt="Rounded lips" style={{ width: '140px', height: 'auto' }} />
              </LipCircle>
              <LipLabel active={lipShape === 'rounded'}>Rounded</LipLabel>
            </div>
            {/* Vowel grid column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <LipVowelGridTitle>Vowels</LipVowelGridTitle>
              <LipVowelGridSubtitle>Click to hear the sound!</LipVowelGridSubtitle>
              <LipVowelGridWrapper>
                <LipVowelGrid>
                  {lipVowelGrid.map((row, rowIdx) => (
                    <LipVowelGridRow key={rowIdx}>
                      {row.map((symbol, colIdx) => (
                        <LipVowelCell
                          key={symbol}
                          highlight={highlightRows.includes(rowIdx)}
                          onClick={() => playVowelSound(symbol)}
                        >
                          {symbol}
                        </LipVowelCell>
                      ))}
                    </LipVowelGridRow>
                  ))}
                </LipVowelGrid>
              </LipVowelGridWrapper>
            </div>
          </div>
        )}
        {activeTab === 'length' && (
          <div style={{ display: 'flex', width: '100%', maxWidth: '1100px', margin: '0 auto', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '2.5rem', gap: '4rem' }}>
            {/* Left: Explanation Box */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <div style={{ border: '3px solid #232323', background: '#f7d9cb', padding: '2rem 2.2rem', borderRadius: '4px', minWidth: 270, maxWidth: 320, fontSize: '1.25rem', fontWeight: 600, color: '#23243a' }}>
                <span style={{ color: '#8a3c4a', fontWeight: 700 }}>Long</span> vowels are called <span style={{ color: '#8a3c4a', fontWeight: 700 }}>tense</span>.<br /><br />
                <span style={{ color: '#1a9a9a', fontWeight: 700 }}>Short</span> vowels are called <span style={{ color: '#1a9a9a', fontWeight: 700 }}>lax</span>.
              </div>
              <div style={{ color: '#888', fontWeight: 600, fontSize: '1.05rem', marginTop: '0.7rem', textAlign: 'left', width: '100%', maxWidth: 320 }}>
                <span style={{ color: '#23243a', fontWeight: 700 }}>Click</span> to hear the sound!
              </div>
            </div>
            {/* Center: Tense/Lax Grid with Arrows */}
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '2.5rem', marginBottom: '0.7rem' }}>
                <span style={{ color: '#8a3c4a', fontWeight: 700, fontSize: '1.2rem' }}>Tense</span>
                <span style={{ color: '#1a9a9a', fontWeight: 700, fontSize: '1.2rem', marginLeft: '3.5rem' }}>Lax</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2.5rem' }}>
                {/* Tense column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['i', 'e', 'u', 'o'].map((vowel) => (
                    <div
                      key={vowel}
                      onClick={() => playVowelSound(vowel)}
                      style={{
                        width: '3.2rem', height: '3.2rem', border: '2px solid #232323', borderRadius: 4, background: '#f7d9cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#23243a', cursor: 'pointer', marginBottom: '0.1rem', transition: 'background 0.2s',
                      }}
                    >
                      {vowel}
                    </div>
                  ))}
                </div>
                {/* Arrows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', alignItems: 'center', marginTop: '0.2rem' }}>
                  {[0,1,2,3].map((i) => (
                    <svg key={i} width="38" height="18" viewBox="0 0 38 18" style={{ margin: '0.2rem 0' }}>
                      <line x1="2" y1="9" x2="36" y2="9" stroke="#aaa" strokeWidth="2" />
                      <polygon points="36,9 30,5 30,13" fill="#aaa" />
                      <polygon points="2,9 8,5 8,13" fill="#aaa" />
                    </svg>
                  ))}
                </div>
                {/* Lax column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['ɪ', 'ɛ', 'ʊ', 'ɔ'].map((vowel) => (
                    <div
                      key={vowel}
                      onClick={() => playVowelSound(vowel)}
                      style={{
                        width: '3.2rem', height: '3.2rem', border: '2px solid #232323', borderRadius: 4, background: '#f7d9cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#23243a', cursor: 'pointer', marginBottom: '0.1rem', transition: 'background 0.2s',
                      }}
                    >
                      {vowel}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Right: Neither column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '1.5rem' }}>
              <div style={{ color: '#888', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.7rem', marginLeft: '0.5rem' }}>
                Some vowels are <span style={{ fontWeight: 700, color: '#23243a' }}>neither</span> lax<br />nor tense.
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1.5rem' }}>
                {['æ', 'ɑ', 'ʌ', 'ə'].map((vowel) => (
                  <div
                    key={vowel}
                    onClick={() => playVowelSound(vowel)}
                    style={{
                      width: '3.2rem', height: '3.2rem', border: '2px solid #232323', borderRadius: 4, background: '#f7d9cb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#23243a', cursor: 'pointer', marginBottom: '0.1rem', transition: 'background 0.2s',
                    }}
                  >
                    {vowel}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Main>
    </Container>
  );
};

export default VowelMapPage; 