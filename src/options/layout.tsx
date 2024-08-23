import OptionsNavBar from 'components/optionsNavbar/optionsNavBar';
import { ServiceContext, SettingsContext } from 'components/react-types';
import Sidebar from 'components/sidebar/sidebar';
import React, { useContext } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import './layout.css';

export default () => {
    const { serviceId } = useParams();
    const settings = useContext(SettingsContext);
    const service = settings.find(config => config.name === serviceId);
    return (
        <ServiceContext.Provider value={service}>
            <OptionsNavBar dark={false} service={service} />
            <Sidebar service={service} />
            <div className="content-container">
                <Outlet />
            </div>
        </ServiceContext.Provider>
    );
};
