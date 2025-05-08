// src/features/learn/index.tsx
import React from 'react';
import { Route } from 'react-router-dom';

import LearnMenu from './LearnMenu';
import { Vowels101Page } from './Vowels101';
import { MapVowelSpacePage } from './MapVowelSpace';
import { GraphemesPage } from './Graphemes';
import { TrickyPairsPage } from './TrickyPairs';

export const LearnRoutes = (
  <Route path="learn">
    {/* /learn */}
    <Route index element={<LearnMenu />} />

    {/* /learn/vowels-101 */}
    <Route path="learn/vowels-101/:sectionSlug?" element={<Vowels101Page />} />

    <Route path="map-vowel-space" element={<MapVowelSpacePage />} />
    <Route path="graphemes" element={<GraphemesPage />} />
    <Route path="tricky-pairs" element={<TrickyPairsPage />} />
  </Route>
);
