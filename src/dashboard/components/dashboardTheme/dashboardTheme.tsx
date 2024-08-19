import core from 'common/core';
import { ServiceStateItem, ViewConfig } from 'common/types';
import { ServiceStateContext, Theme, ViewConfigContext } from 'dashboard/types';
import React, { useEffect, useState } from 'react';
import darkTheme from '../../themes/dark/dark';
import lightTheme from '../../themes/light/light';

const themes: Record<string, Theme> = {
    dark: darkTheme,
    light: lightTheme,
};

const DashboardTheme = ({ popup }) => {
    const [viewConfig, setViewConfig] = useState<ViewConfig>({});
    const [serviceStates, setServiceStates] = useState<ServiceStateItem[]>([]);

    useEffect(() => {
        core.views.subscribe(config => {
            setViewConfig(config);
        });
        core.activeProjects.subscribe((services: any) => {
            setServiceStates(services);
        });
    });
    const themeName = viewConfig.theme ?? 'dark';
    const DashboardTheme = themes[themeName];
    return (
        <React.StrictMode>
            <ViewConfigContext.Provider value={viewConfig}>
                <ServiceStateContext.Provider value={serviceStates}>
                    <div className={`theme theme-${themeName}`}>
                        <DashboardTheme popup={popup} />
                    </div>
                </ServiceStateContext.Provider>
            </ViewConfigContext.Provider>
        </React.StrictMode>
    );
};

export default DashboardTheme;
