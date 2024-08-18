import 'bootstrap/dist/css/bootstrap.css';
import core from 'common/core';
import logger from 'common/logger';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import ThemeProvider from './components/theme/themeProvider';
import './dashboard.css';

core.init({ test: false });
logger.init({ prefix: 'dashboard', debug: true });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(<ThemeProvider popup={false} />);
