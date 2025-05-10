// src/features/learn/TrickyPairs/TrickyPairsPage.tsx
import { TackleMinimalPairsLayout } from '@components/ui/LearnLayout';


{/* <BackButton to="/learn" /> */ }
export default function TackleMinimalPairsPage() {
    return (
        <TackleMinimalPairsLayout
            title="Tackle Minimal Pairs"
            subtitle="Minimal pairs differ by only one phoneme."
            showBackButton={true}
        >
            {/* Column 1 placeholder */}
            <div>Audio/Description Component</div>

            {/* Column 2 placeholder */}
            <div>Minimal Pairs Selection Component</div>
        </TackleMinimalPairsLayout>
    );
}
