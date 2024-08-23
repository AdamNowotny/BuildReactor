import 'bootstrap/dist/css/bootstrap.css';
import core from 'common/core';
import logger from 'common/logger';
import 'font-awesome/scss/font-awesome.scss';
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { optionsRouter } from './optionsRouter';

core.init({ test: true });
logger.init({ prefix: 'options', debug: false });

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(
    <React.StrictMode>
        <RouterProvider router={optionsRouter} />
    </React.StrictMode>,
);
