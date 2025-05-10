import React from 'react';
import type { QuizResult } from './VowelShuffle/vowelShuffleService';


export default function QuizFeedback({
    result,
    onRetake,
}: {
    result: QuizResult;
    onRetake: () => void;
}) {
    return (
        <div>
            <h1>Quiz Complete!</h1>
            <p>You scored {result.earned} / {result.total}</p>
            <button onClick={onRetake}>Retake Quiz</button>
            <button onClick={() => (window.location.href = '/learn/vowels-101')}>
                Back to Lesson
            </button>
        </div>
    );
}