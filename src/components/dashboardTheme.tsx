import PageContext from 'components/pageContext';
import { Theme, ViewConfigContext } from 'dashboard/types';
import React, { useContext } from 'react';
import darkTheme from '../dashboard/themes/dark/dark';
import lightTheme from '../dashboard/themes/light/light';

const themes: Record<string, Theme> = {
    dark: darkTheme,
    light: lightTheme,
};

const DashboardTheme = ({ popup }) => {
    const viewConfig = useContext(ViewConfigContext);

    const themeName = viewConfig.theme ?? 'dark';
    const DashboardTheme = themes[themeName];
    return (
        <PageContext>
            <div className={`theme theme-${themeName}`}>
                <DashboardTheme popup={popup} />
            </div>
        </PageContext>
    );
};

export default DashboardTheme;
