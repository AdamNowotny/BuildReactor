import 'bootstrap/dist/css/bootstrap.css';
import core from 'common/core';
import logger from 'common/logger';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import DashboardTheme from './components/dashboardTheme/dashboardTheme';
import './dashboard.css';

core.init({ test: false });
logger.init({ prefix: 'dashboard', debug: false });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(<DashboardTheme popup={false} />);
