import core from 'common/core';
import { ViewConfig } from 'common/types';
import { Theme, ViewContext } from 'dashboard/types';
import React, { useEffect, useState } from 'react';
import darkTheme from '../../themes/dark/dark';
import lightTheme from '../../themes/light/light';

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
