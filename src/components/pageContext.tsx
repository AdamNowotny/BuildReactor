import core from 'common/core';
import { ServiceStateItem, ViewConfig } from 'common/types';
import { ServiceStateContext, ViewConfigContext } from 'dashboard/types';
import React, { useEffect, useState } from 'react';

export default ({ children }) => {
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
    return (
        // <React.StrictMode>
        <ViewConfigContext.Provider value={viewConfig}>
            <ServiceStateContext.Provider value={serviceStates}>
                {children}
            </ServiceStateContext.Provider>
        </ViewConfigContext.Provider>
        // </React.StrictMode>
    );
};
