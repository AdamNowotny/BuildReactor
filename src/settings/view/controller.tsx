import PageContext from 'components/pageContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import ViewPage from 'settings/pages/viewPage';

export default app.controller('ViewSettingsCtrl', function () {
    const viewPage = document.getElementById('view-page');
    if (viewPage) {
        createRoot(viewPage).render(
            <PageContext>
                <ViewPage />
            </PageContext>,
        );
    }
});
