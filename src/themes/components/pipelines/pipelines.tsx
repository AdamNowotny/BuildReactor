import React from 'react';
import './pipelines.css';
import { ThemeProps } from 'themes/theme-types';

const Pipelines = ({ viewConfig, serviceStates }: ThemeProps) => {
    let content;
    if (serviceStates.length) {
        content = serviceStates.map((serviceState, index) => {
            return (
                // <service service-info="service" ng-repeat="service in services" ng-show="services" view-config="viewConfig"></service>
                { serviceState }
            );
        });
    } else {
        content = <div className="no-services-message">No services configured</div>;
    }
    return <div className="pipelines container-fluid">{content}</div>;
};
export default Pipelines;
