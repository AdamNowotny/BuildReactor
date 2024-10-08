import core from 'common/core';
import logger from 'common/logger';
import PageContext from 'common/components/pageContext';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout';
import AddPage from './pages/add/addPage';
import ConfigurationPage from './pages/configuration/configurationPage';
import NotificationsPage from './pages/notificationsPage';
import ServicePage from './pages/service/servicePage';
import ViewPage from './pages/viewPage';

core.init();
logger.init({ prefix: 'options', debug: false });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(
    <React.StrictMode>
        <HashRouter basename="/">
            <Routes>
                <Route
                    path="/"
                    element={
                        <PageContext>
                            <Layout />
                        </PageContext>
                    }
                >
                    <Route index element={<AddPage />} />
                    <Route
                        path="new/:serviceTypeId/:serviceId"
                        element={<ServicePage />}
                    />
                    <Route path="service/:serviceId" element={<ServicePage />} />
                    <Route path="view" element={<ViewPage />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="configuration" element={<ConfigurationPage />} />
                </Route>
                <Route path="*" element={<h1>Routing error</h1>} />
            </Routes>
        </HashRouter>
    </React.StrictMode>,
);
