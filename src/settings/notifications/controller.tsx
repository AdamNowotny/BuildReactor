import PageContext from 'components/pageContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import NotificationsPage from 'options/pages/notificationsPage';

export default app.controller('NotificationsCtrl', function () {
    const notificationsPage = document.getElementById('notifications-page');
    if (notificationsPage) {
        createRoot(notificationsPage).render(
            <PageContext>
                <NotificationsPage />
            </PageContext>,
        );
    }
});
