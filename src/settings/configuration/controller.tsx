import PageContext from 'components/pageContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import ConfigurationPage from 'settings/pages/configurationPage';

export default app.controller('ConfigurationCtrl', function () {
    const notificationsPage = document.getElementById('configuration-page');
    if (notificationsPage) {
        createRoot(notificationsPage).render(
            <PageContext>
                <ConfigurationPage />
            </PageContext>,
        );
    }
});
