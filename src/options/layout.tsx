import 'bootstrap/dist/css/bootstrap.min.css';
import {
    ServiceContext,
    ServiceTypesContext,
    SettingsContext,
} from 'components/react-types';
import 'font-awesome/scss/font-awesome.scss';
import OptionsNavBar from 'options/components/optionsNavbar/optionsNavBar';
import React, { useContext } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import Sidebar from './components/sidebar';
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
        return serviceType
            ? { ...serviceType.defaultConfig, name: serviceId }
            : undefined;
    }
}
