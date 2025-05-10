// src/routes.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Layout } from '@components/layout';
import { LearnRoutes } from '@features/learn';
import { QuizRoutes } from '@features/quiz';
import { HomePage, NotFoundPage } from 'pages';


export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<HomePage />} />
                    {LearnRoutes}
                    {QuizRoutes}
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
