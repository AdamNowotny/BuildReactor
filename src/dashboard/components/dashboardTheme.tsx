import { ThemeDefinition, ViewConfigContext } from 'common/components/react-types';
import React, { useContext } from 'react';
import darkTheme from '../themes/dark/dark';
import lightTheme from '../themes/light/light';

export const themeDefinition: Record<string, ThemeDefinition> = {
    dark: {
        name: 'Dark',
        theme: darkTheme,
    },
    light: {
        name: 'Light',
        theme: lightTheme,
    },
};

const DashboardTheme = ({ popup }: { popup: boolean }) => {
    const viewConfig = useContext(ViewConfigContext);

    const themeName = viewConfig.theme ?? 'dark';
    const DashboardActiveTheme = themeDefinition[themeName].theme;
    if (!DashboardActiveTheme) throw new Error(`No theme found for ${themeName}`);
    return (
        <div className={`theme theme-${themeName}`}>
            <DashboardActiveTheme popup={popup} />
        </div>
    );
};

export default DashboardTheme;
