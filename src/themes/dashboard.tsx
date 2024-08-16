import core from 'common/core';
import logger from 'common/logger';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './dashboard.css';
// themes
import darkTheme from './dark/dark';
import lightTheme from './light/light';

core.init({ test: true });
logger.init({ prefix: 'dashboard' });

const themes = {
    dark: darkTheme,
    light: lightTheme,
};

const Dashboard = () => {
    const [serviceStates, setServiceStates] = useState<any[]>([]);
    const [viewConfig, setViewConfig] = useState<any>({});

    useEffect(() => {
        core.views.subscribe(config => {
            setViewConfig(config);
        });
        core.activeProjects.subscribe((services: any) => {
            setServiceStates(services);
        });
    });
    const themeName = viewConfig.theme ?? 'dark';
    const ThemeComponent = themes[themeName].Dashboard;
    return (
        <div className={`theme theme-${themeName}`}>
            <ThemeComponent viewConfig={viewConfig} serviceStates={serviceStates} />
        </div>
    );
};

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(<Dashboard />);
