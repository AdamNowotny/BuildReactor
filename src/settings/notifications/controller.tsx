import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import PageContext from 'settings/components/pageContext';
import NotificationsPage from 'settings/pages/notificationsPage';

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
