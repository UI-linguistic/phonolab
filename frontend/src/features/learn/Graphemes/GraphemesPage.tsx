// src/features/learn/Graphemes/GraphemesPage.tsx
import LayoutPresets from '@components/ui/LearnLayout';

const { GetYourGraphemesLayout } = LayoutPresets;

// ────────────────────────────────────────────────────────────
// 1) GetYourGraphemesPage
//    A three‑row layout for explaining graphemes.
// ────────────────────────────────────────────────────────────
export default function GetYourGraphemesPage() {
    return (
        <GetYourGraphemesLayout
            title="Get Your Graphemes Right"
            subtitle="English vowels are not just five letters and sounds..."
            showBackButton={true}
        >
            {/* Row placeholders */}
            <div>Graphemes Explanation Component</div>
            <div>Examples Component</div>
            <div>Interactive Component</div>
        </GetYourGraphemesLayout>
    );
}
