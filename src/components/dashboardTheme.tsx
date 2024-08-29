import React, { useContext } from 'react';
import darkTheme from '../dashboard/themes/dark/dark';
import lightTheme from '../dashboard/themes/light/light';
import { Theme, ViewConfigContext } from './react-types';

const themes: Record<string, Theme> = {
    dark: darkTheme,
    light: lightTheme,
};

const DashboardTheme = ({ popup }: { popup: boolean }) => {
    const viewConfig = useContext(ViewConfigContext);

    const themeName = viewConfig.theme ?? 'dark';
    const DashboardActiveTheme = themes[themeName];
    return (
        <div className={`theme theme-${themeName}`}>
            <DashboardActiveTheme popup={popup} />
        </div>
    );
};

export default DashboardTheme;
