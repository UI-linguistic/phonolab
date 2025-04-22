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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<LearnPathPage />} />
          <Route path="/learn/vowels-101/:lessonId" element={<VowelLessonPage />} />
          <Route path="/learn/:lessonId" element={<LearnPage />} />
          <Route path="/quiz" element={<QuizInstructionsPage />} />
          <Route path="/quiz/:questionId" element={<QuizPage />} />
          <Route path="/quiz/result" element={<QuizResultPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
