import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VowelIllustration from '../images/home_brain-mouth.png';

const BG_COLOR = '#F7D9CB';

const Container = styled.div`
  min-height: calc(100vh - 64px);
  width: 100vw;
  background: ${BG_COLOR};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1200px;
  gap: 4vw;
  @media (max-width: 900px) {
    flex-direction: column;
    gap: 3rem;
  }
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  min-width: 350px;
  max-width: 500px;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 900;
  color: #23243a;
  margin-bottom: 1.2rem;
  text-align: left;
  line-height: 1.05;
`;

const Subtitle = styled.div`
  font-size: 1.35rem;
  color: #444;
  font-weight: 600;
  margin-bottom: 2.8rem;
  text-align: left;
  line-height: 1.3;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.3rem;
`;

const BaseButton = styled.button`
  background: ${BG_COLOR};
  color: #23243a;
  border: 2px solid #232323;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1.1rem 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  text-align: left;
  &:hover {
    background: #F26522;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    transform: translateY(-2px);
  }
`;

const OrangeButton = styled(BaseButton)`
  margin-bottom: 0.5rem;
`;

const OutlineButton = styled(BaseButton)``;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 320px;
`;

const Illustration = styled.img`
  max-width: 420px;
  width: 100%;
  height: auto;
  display: block;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <MainContent>
        <Left>
          <Title>Start Your Vowel Journey</Title>
          <Subtitle>
            Your Brain Knows English.<br />
            Let's Get Your Mouth On Board.
          </Subtitle>
          <ButtonStack>
            <OrangeButton onClick={() => navigate('/learn')}>Decode Vowel Sounds</OrangeButton>
            <OutlineButton onClick={() => navigate('/quiz')}>Challenge Yourself</OutlineButton>
          </ButtonStack>
        </Left>
        <Right>
          <Illustration src={VowelIllustration} alt="Mouth and brain shaking hands" />
        </Right>
      </MainContent>
    </Container>
  );
};

export default HomePage; 