import core from 'common/core';
import React, { useEffect, useState } from 'react';
import { Theme, ViewContext } from 'dashboard/theme-types';
import darkTheme from '../../dark/dark';
import lightTheme from '../../light/light';
import { ViewConfig } from 'common/types';

const themes: Record<string, Theme> = {
    dark: darkTheme,
    light: lightTheme,
};

const ThemeProvider = ({ popup }) => {
    const [viewConfig, setViewConfig] = useState<ViewConfig>({});

    useEffect(() => {
        core.views.subscribe(config => {
            setViewConfig(config);
        });
    });
    const themeName = viewConfig.theme ?? 'dark';
    const Dashboard = themes[themeName];
    return (
        <React.StrictMode>
            <ViewContext.Provider value={viewConfig}>
                <div className={`theme theme-${themeName}`}>
                    <Dashboard popup={popup} />
                </div>
            </ViewContext.Provider>
        </React.StrictMode>
    );
};

export default ThemeProvider;
