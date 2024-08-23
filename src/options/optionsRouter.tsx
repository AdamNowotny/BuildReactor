import PageContext from 'components/pageContext';
import ServicePage from 'options/pages/servicePage';
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import AddPage from 'settings/pages/addPage';
import ConfigurationPage from 'settings/pages/configurationPage';
import NotificationsPage from 'settings/pages/notificationsPage';
import ViewPage from 'settings/pages/viewPage';
import Layout from './layout';

export const optionsRouter = createBrowserRouter(
    [
        {
            path: '/',
            element: (
                <PageContext>
                    <Layout />
                </PageContext>
            ),
            children: [
                { index: true, element: <AddPage /> },
                { path: 'new/:serviceTypeId/:serviceId', element: <ServicePage /> },
                { path: 'service/:serviceId', element: <ServicePage /> },
                { path: 'view', element: <ViewPage /> },
                { path: 'notifications', element: <NotificationsPage /> },
                { path: 'configuration', element: <ConfigurationPage /> },
            ],
        },
        {
            path: '*',
            element: <h1>Routing error</h1>,
        },
    ],
    {
        basename: '/src/options/options.html',
    },
);
