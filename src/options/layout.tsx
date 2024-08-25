import OptionsNavBar from 'components/optionsNavbar/optionsNavBar';
import {
    ServiceContext,
    ServiceTypesContext,
    SettingsContext,
} from 'components/react-types';
import Sidebar from 'components/sidebar/sidebar';
import React, { useContext } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import './layout.css';

export default () => {
    const [_, path] = useLocation().pathname.split('/');
    const view = path || 'add';

    const settings = useContext(SettingsContext);
    const { serviceId, serviceTypeId } = useParams();
    const service = settings.find(config => config.name === serviceId);

    const newConfig = createServiceConfig(serviceTypeId, serviceId);
    return (
        <ServiceContext.Provider value={service ?? newConfig}>
            <OptionsNavBar dark={false} service={service} />
            <Sidebar service={service ?? newConfig} view={view} />
            <div className="content-container">
                <Outlet />
            </div>
        </ServiceContext.Provider>
    );
};

function createServiceConfig(
    serviceTypeId: string | undefined,
    serviceId: string | undefined,
) {
    if (serviceTypeId && serviceId) {
        const serviceTypes = useContext(ServiceTypesContext);
        const serviceType = serviceTypes.find(
            serviceType => serviceType.baseUrl === serviceTypeId,
        );
        if (!serviceType) throw new Error(`Could not find service type ${serviceTypeId}`);
        return { ...serviceType.defaultConfig, name: serviceId };
    }
}
