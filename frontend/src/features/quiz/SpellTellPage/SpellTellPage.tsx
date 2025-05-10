// src/features/quiz/SpellTell/SpellTellPage.tsx
import { SpellAndTellLayout } from '@components/ui/QuizLayout';

export default function SpellTellPage() {
    return (
        <SpellAndTellLayout title="Spell & Tell" quizStageLabel="Word Match Round">
            <div>Prompt Box</div>
            <div>Letter/Spelling Grid</div>
        </SpellAndTellLayout>
    );
}
