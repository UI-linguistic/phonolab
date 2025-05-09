// src/components/navigation/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft } from 'lucide-react';

const Btn = styled.button`
  background: none;
  border: none;
  color: #333;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 1rem;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.small};
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;


interface BackButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    to?: string;
    label?: string;
}

export default function BackButton({
    to,
    label = 'Go back',
    ...rest
}: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <Btn
            onClick={() => (to ? navigate(to) : navigate(-1))}
            aria-label={label}
            title={label}
            {...rest}
        >
            <ArrowLeft size={24} strokeWidth={3} />
        </Btn>
    );
}
