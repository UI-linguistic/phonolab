// src/components/ui/Illustration.tsx
import React from 'react';
import styled, { css } from 'styled-components';

export interface IllustrationProps {
  src: string;
  alt: string;

  /** ‘circle’ = circular mask, ‘square’ = no mask */
  shape?: 'circle' | 'square';

  /** size in pixels for both width & height */
  size?: number;
}

const Wrapper = styled.div<Pick<IllustrationProps, 'shape' | 'size'>>`
  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `}

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  ${({ shape }) =>
    shape === 'circle' &&
    css`
      border-radius: 50%;
    `}
  outline: 1px dashed rgba(0, 0, 0, 0.2); /* debug—remove later */
`;

const Image = styled.img`
  width: 100%;
  height: auto;
  object-fit: contain;
`;

export default function Illustration({
  src,
  alt,
  shape = 'square',
  size,
}: IllustrationProps) {
  return (
    <Wrapper shape={shape} size={size}>
      <Image src={src} alt={alt} />
    </Wrapper>
  );
}
