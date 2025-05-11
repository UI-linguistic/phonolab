import React from 'react';
import styled from 'styled-components';

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
`;

const ColorSwatch = styled.div<{ $color: string }>`
  width: 100%;
  height: 100px;
  background-color: ${({ $color }) => $color};
  border: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0.5rem;
  color: ${({ $color }) => {
        // Calculate relative luminance to determine text color
        const hex = $color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }};
`;

const ColorName = styled.div`
  font-size: 0.8rem;
  font-family: monospace;
`;

export function ColorTest() {
    const colors = {
        backgroundAccent: '#EFD9CE',
        primary: '#107E7D',
        secondary: '#FFA726',
        tertiary: '#63535B',
        accent: '#F05D23',
        secondaryAccent: '#6D1A36',
        background: '#EFD9CE',
        text: '#212121',
        textSubtle: '#757575',
    };

    return (
        <ColorGrid>
            {Object.entries(colors).map(([name, color]) => (
                <ColorSwatch key={name} $color={color}>
                    <ColorName>{name}: {color}</ColorName>
                </ColorSwatch>
            ))}
        </ColorGrid>
    );
} 