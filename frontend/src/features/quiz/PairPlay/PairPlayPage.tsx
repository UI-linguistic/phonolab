// src/features/quiz/PairPlay/PairPlayPage.tsx
import { PairPlayLayout } from '@components/ui/QuizLayout';

export default function PairPlayPage() {
    return (
        <PairPlayLayout title="Pair Play" quizStageLabel="Minimal Pair Match">
            <div>Audio Prompt</div>
            <div>Pair Selection</div>
            <div>Submit + Status</div>
        </PairPlayLayout>
    );
}
