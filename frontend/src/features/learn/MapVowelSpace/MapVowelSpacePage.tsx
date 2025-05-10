// src/features/learn/MapVowelSpace/MapVowelSpacePage.tsx
import LayoutPresets from '@components/ui/LearnLayout';

const { MapVowelSpaceLayout } = LayoutPresets;

// ────────────────────────────────────────────────────────────
// 1) MapVowelSpacePage
//    A three‑column layout for mapping vowel space.
// ────────────────────────────────────────────────────────────
export default function MapVowelSpacePage() {
    return (
        <MapVowelSpaceLayout
            title="Map the Vowel Space"
            subtitle="Vowels exist on a spectrum—like colors in your mouth!"
            showBackButton={true}
        >
            {/* Column placeholders */}
            <div>Vowel Grid Component</div>
            <div>Vowel Spectrum Component</div>
            <div>Additional Diagram Component</div>
        </MapVowelSpaceLayout>
    );
}
