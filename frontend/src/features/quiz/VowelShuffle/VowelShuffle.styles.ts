// VowelShuffle.styles.ts
import styled from "styled-components";

export const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem 2.5rem;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-items: stretch;
`

export const InstructionBox = styled.div`
  box-sizing: border-box;
  border: 4px solid ${({ theme }) => theme.colors.black};
  width: 100%;              /* fill its minmax column */
  max-width: 32rem;         /* never exceed this */

  min-height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  /* let the height grow with content, but don’t shrink too small */
  min-height: 14rem;        

  /* extra breathing room */
  padding: ${({ theme }) => `${theme.spacing.xlarge} ${theme.spacing.xlarge}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  line-height: ${({ theme }) => theme.lineHeights.md};
  background: ${({ theme }) => theme.colors.background};
`;


export const ButtonContainer = styled.div`
  text-align:   center;
  margin-top:   ${({ theme }) => theme.spacing.large};
  display: flex;
  justify-content: center;
`

export const StartButton = styled.button`
  width:        10rem;                                            /* ~240px wide */
  height:       3rem;                                             /* ~48px tall */
  font-size:    ${({ theme }) => theme.fontSizes.lg};
  font-weight:  bold;
  background:   ${({ theme }) => theme.colors.primary};
  color:        ${({ theme }) => theme.colors.white};
  border:       none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor:       pointer;
`

