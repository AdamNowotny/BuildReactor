import 'bootstrap/dist/css/bootstrap.css';
import PageContext from 'common/components/pageContext';
import core from 'common/core';
import logger from 'common/logger';
import 'font-awesome/scss/font-awesome.scss';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import DashboardTheme from './components/dashboardTheme';
import './popup.css';

core.init();
logger.init({ prefix: 'popup', debug: true });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(
    <PageContext>
        <DashboardTheme popup={true} />
    </PageContext>,
);
