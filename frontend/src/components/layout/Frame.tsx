// Frame.tsx
/**
 * Frame
 *
 * A self‑contained UI “frame” that lays out a single child (e.g. an IPA symbol or image),
 * intercepts pointer events to prevent accidental drags, and forwards click events to play audio.
 * Reusable anywhere you need a clickable, styled container with built‑in event handling.
 */
import React from 'react';

export interface FrameProps {
    children: React.ReactNode;
    /** Receives the click event, stopPropagation here if needed */
    onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Frame: React.FC<FrameProps> = ({ children, onClick }) => (
    <div
        className="frame"
        onPointerDown={e => e.stopPropagation()} // prevent drag start
        onClick={onClick}
    >
        {children}
    </div>
);