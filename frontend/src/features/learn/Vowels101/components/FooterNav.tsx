// ============================================
// File: src/features/learn/Vowels101/components/FooterNav.tsx
// ============================================
import React from 'react';
import { FooterNavRow } from '../Vowels101.styles';
import Button from '@components/ui/Button';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
}

export function FooterNav({ onPrev, onNext, disablePrev, disableNext }: Props) {
  return (
    <FooterNavRow>
      <Button variant="outline" onClick={onPrev} disabled={disablePrev}>
        Previous
      </Button>
      <Button variant="outline" onClick={onNext} disabled={disableNext}>
        Next
      </Button>
    </FooterNavRow>
  );
}
