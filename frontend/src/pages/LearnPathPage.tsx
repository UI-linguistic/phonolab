import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LearnIllustration from '../images/learn_brain-mouth.png';

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

const BackArrow = styled.div`
  font-size: 2.5rem;
  color: #d3cfc7;
  margin-bottom: 0.5rem;
  user-select: none;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: #23243a;
  margin-bottom: 1.1rem;
  text-align: left;
`;

const Subtitle = styled.div`
  font-size: 1.15rem;
  color: #6d6d6d;
  font-weight: 500;
  margin-bottom: 2.5rem;
  text-align: left;
  line-height: 1.4;
`;

const ButtonStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.3rem;
  width: 100%;
`;

const OrangeButton = styled.button`
  background: #F26522;
  color: #fff;
  border: 2px solid #232323;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1.1rem 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.13);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  margin-bottom: 0.5rem;
  text-align: left;
  width: 270px;
  &:hover {
    background: #d94e0f;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
    transform: translateY(-2px);
  }
`;

const OutlineButton = styled.button`
  background: ${BG_COLOR};
  color: #23243a;
  border: 2px solid #F26522;
  border-radius: 16px;
  font-size: 1.25rem;
  font-weight: bold;
  padding: 1.1rem 2.5rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
  text-align: left;
  width: 270px;
  &:hover {
    background: #ffe5d3;
    box-shadow: 0 4px 16px rgba(0,0,0,0.13);
    transform: translateY(-2px);
  }
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 320px;
`;

const IllustrationCircle = styled.div`
  background: #e3d7d1;
  border: 3px solid #b6b0ad;
  border-radius: 50%;
  width: 420px;
  height: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 600px) {
    width: 90vw;
    height: 90vw;
    max-width: 350px;
    max-height: 350px;
  }
`;

const Illustration = styled.img`
  max-width: 320px;
  width: 100%;
  height: auto;
  display: block;
`;

const LearnPathPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <MainContent>
        <Left>
          <Title>Choose Your Learning Path</Title>
          <Subtitle>Master those slippery English vowels that<br/>trip up even fluent speakers.</Subtitle>
          <ButtonStack>
            <OrangeButton onClick={() => navigate('/learn/vowels-101/1')}>Vowels 101</OrangeButton>
            <OutlineButton onClick={() => navigate('/learn/tricky-pairs')}>Tackle Tricky Pairs</OutlineButton>
          </ButtonStack>
        </Left>
        <Right>
          <IllustrationCircle>
            <Illustration src={LearnIllustration} alt="Brain with lips" />
          </IllustrationCircle>
        </Right>
      </MainContent>
    </Container>
  );
};

export default LearnPathPage; 