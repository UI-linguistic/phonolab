// Re‑export all the lesson’s specific UI components
export * from './components';

import React from 'react';
import styled from 'styled-components';
import { Cell } from '@components/display';
import { Vowels101Layout } from '@components/ui/LearnLayout';
import { Vowels101Instructions } from '@components/ui/InstructionWrappers';
import TongueGrid from './components/TongueGrid';

const TongueDiagram = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

const Vowels101Page = () => {
    const handleVowelClick = (vowel: string) => {
        // Here you would play the sound of the vowel
        console.log(`Playing sound for vowel: ${vowel}`);
    };

    return (
        <Vowels101Layout
            title="Vowels are organized in three ways:"
            showBackButton={true}
        >
            {/* Left Column: Instructions */}
            <Cell>
                <Vowels101Instructions />
            </Cell>

            {/* Middle Column: Vowel Grid */}
            <TongueGrid onVowelClick={handleVowelClick} />

            {/* Right Column: Tongue Diagram */}
            <TongueDiagram>
                <img
                    src="/images/tongue-diagram.svg"
                    alt="Tongue position diagram showing the articulation of vowels"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placeholder.com/400x300/fff/text=Tongue+Diagram';
                    }}
                />
            </TongueDiagram>
        </Vowels101Layout>
    );
};

export default Vowels101Page;