import { createRoot } from 'react-dom/client';
import React from 'react';
import { ConfigStorageItem } from 'services/service-types';

// themes
import darkTheme from 'themes/dark/dark';
import lightTheme from 'themes/light/light';

const themes = {
    dark: darkTheme,
    light: lightTheme,
};

const SettingsDashboard = ({ viewConfig }: { viewConfig: ConfigStorageItem }) => {
    const themeName = viewConfig.theme ?? 'dark';
    const ThemeComponent = themes[themeName].Dashboard;
    return (
        <div className={`theme theme-${themeName}`}>
            <ThemeComponent viewConfig={viewConfig} />
        </div>
    );
};

const render = (element: HTMLElement | null, viewConfig: ConfigStorageItem) => {
    if (!element) return;
    createRoot(element).render(<SettingsDashboard viewConfig={viewConfig} />);
};

export default {
    render,
};
