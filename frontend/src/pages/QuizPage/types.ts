export interface QuizSample {
  id: string;
  text: string;
  audio: string;
  IPA: string;
}

export interface QuizOption {
  id: string;
  word: string;
  language: string;
  audio: string;
  IPA: string;
}

export interface QuizOptionsPool {
  correct_answers: QuizOption[];
  wrong_answers: QuizOption[];
}

export interface QuizFeedback {
  correct: string;
  incorrect: string;
}

export interface QuizQuestion {
  id: number;
  target: string;
  target_audio: string;
  samples: QuizSample[];
  options_pool: QuizOptionsPool;
  feedback: QuizFeedback;
}

export interface QuizData {
  quiz: QuizQuestion[];
} 