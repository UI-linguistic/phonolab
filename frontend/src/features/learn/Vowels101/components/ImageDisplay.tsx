// Vowels101/components/ImageDisplay.tsx
import React from 'react';
import { Img } from '../Vowels101.styles';

interface Props { src?: string; alt?: string; }
export const ImageDisplay: React.FC<Props> = ({ src, alt }) => {
    return src ? <Img src={src} alt={alt} /> : null;
};