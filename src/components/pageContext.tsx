import core from 'common/core';
import {
    CIPipelineList,
    CIServiceDefinition,
    CIServiceSettings,
    ServiceStateItem,
    ViewConfig,
} from 'common/types';
import {
    ServiceStateContext,
    ServiceTypesContext,
    SettingsContext,
    ViewConfigContext,
} from './react-types';
import React, { useEffect, useState } from 'react';

export default ({ children }) => {
    const [viewConfig, setViewConfig] = useState<ViewConfig>({});
    const [serviceStates, setServiceStates] = useState<ServiceStateItem[]>([]);
    const [settings, setSettings] = useState<CIServiceSettings[]>([]);
    const [serviceTypes, setServiceTypes] = useState<CIServiceDefinition[]>([]);

    useEffect(() => {
        core.views.subscribe(config => {
            setViewConfig(config);
        });
        core.activeProjects.subscribe((services: any) => {
            setServiceStates(services);
        });
        core.configurations.subscribe(settings => {
            setSettings(settings);
        });
        core.availableServices(services => {
            setServiceTypes(services);
        });
    }, []);
    return (
        // <React.StrictMode>
        <ServiceTypesContext.Provider value={serviceTypes}>
            <ViewConfigContext.Provider value={viewConfig}>
                <SettingsContext.Provider value={settings}>
                    <ServiceStateContext.Provider value={serviceStates}>
                        {children}
                    </ServiceStateContext.Provider>
                </SettingsContext.Provider>
            </ViewConfigContext.Provider>
        </ServiceTypesContext.Provider>
        // </React.StrictMode>
    );
};
