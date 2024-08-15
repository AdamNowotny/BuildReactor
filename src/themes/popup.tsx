import core from 'common/core';
import logger from 'common/logger';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';
// themes
import darkTheme from './dark/dark';
import lightTheme from './light/light';

core.init();
logger.init({ prefix: 'popup' });

const themes = {
    dark: darkTheme,
    light: lightTheme,
};

const Popup = () => {
    const [serviceStates, setServiceStates] = useState<any[]>([]);
    const [viewConfig, setViewConfig] = useState<any>({});

    useEffect(() => {
        core.views.subscribe(config => {
            setViewConfig(config);
        });

        core.activeProjects.subscribe((states: any) => {
            setServiceStates(states);
        });
    });
    const ThemeComponent = themes[viewConfig.theme]?.Popup ?? themes['dark'].Popup;
    return (
        <div className={`theme-${viewConfig.theme}`}>
            <ThemeComponent viewConfig={viewConfig} serviceStates={serviceStates} />
        </div>
    );
};

const container = document.getElementById('app');
if (!container) throw new Error("Could not find 'app' element");
createRoot(container).render(<Popup />);
