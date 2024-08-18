import 'bootstrap/dist/css/bootstrap.css';
import core from 'common/core';
import logger from 'common/logger';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import './dashboard.css';
import ThemeProvider from './components/theme/themeProvider';

core.init({ test: false });
logger.init({ prefix: 'dashboard' });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(<ThemeProvider popup={false} />);
