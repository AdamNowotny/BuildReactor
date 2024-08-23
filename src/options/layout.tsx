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

    const { serviceId, serviceTypeId } = useParams();
    const service = getService(serviceTypeId, serviceId);
    return (
        <ServiceContext.Provider value={service}>
            <OptionsNavBar dark={false} service={service} />
            <Sidebar service={service} view={view} />
            <div className="content-container">
                <Outlet />
            </div>
        </ServiceContext.Provider>
    );
};

const getService = (serviceTypeId: string | undefined, serviceId: string | undefined) => {
    if (serviceTypeId && serviceId) {
        return createServiceConfig(serviceTypeId, serviceId);
    } else {
        const settings = useContext(SettingsContext);
        return settings.find(config => config.name === serviceId);
    }
};

function createServiceConfig(serviceTypeId: string, serviceId: string) {
    const serviceTypes = useContext(ServiceTypesContext);
    const serviceType = serviceTypes.find(
        serviceType => serviceType.baseUrl === serviceTypeId,
    );
    if (!serviceType) throw new Error(`Could not find service type ${serviceTypeId}`);
    return { ...serviceType.defaultConfig, name: serviceId };
}
