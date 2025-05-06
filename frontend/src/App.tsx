import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalStyle from './styles/GlobalStyle';
import { theme } from './styles/theme';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import LearnPathPage from './pages/LearnPathPage';
import QuizPage from './pages/QuizPage';
import QuizInstructionsPage from './pages/QuizInstructionsPage';
import QuizResultPage from './pages/QuizResultPage';
import VowelLessonPage from './pages/VowelLessonPage';
import Navigation from './components/Navigation';
import MapVowelSpace from './pages/MapVowelSpace';
import VowelMapPage from './pages/VowelMapPage';
import MinimalPairsPage from './pages/MinimalPairsPage';
import PairPlay from './pages/PairPlay';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPathPage />} />
          <Route path="/learn/vowels-101/:lessonId" element={<VowelMapPage />} />
          <Route path="/learn/map-vowel-space" element={<MapVowelSpace />} />
          <Route path="/learn/mouth-right/:lessonId" element={<VowelLessonPage />} />
          <Route path="/learn/:lessonId" element={<LearnPage />} />
          <Route path="/learn/tricky-pairs" element={<MinimalPairsPage />} />
          <Route path="/learn/pair-play" element={<PairPlay />} />
          <Route path="/quiz" element={<QuizInstructionsPage />} />
          <Route path="/quiz/:questionId" element={<QuizPage />} />
          <Route path="/quiz/result" element={<QuizResultPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
