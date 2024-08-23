import PageContext from 'components/pageContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import ConfigurationPage from 'options/pages/configurationPage';

// eslint-disable-next-line prefer-arrow-callback
export default app.controller('ConfigurationCtrl', function () {
    const view = document.getElementById('configuration-page');
    if (view) {
        createRoot(view).render(
            <PageContext>
                <ConfigurationPage />
            </PageContext>,
        );
    }
});
