import { Theme, ViewConfigContext } from 'components/react-types';
import React, { useContext } from 'react';
import darkTheme from '../themes/dark/dark';
import lightTheme from '../themes/light/light';

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
