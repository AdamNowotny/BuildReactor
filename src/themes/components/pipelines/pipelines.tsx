import React from 'react';
import './pipelines.css';

const Pipelines = ({ config, services }) => {
    return (
        <div className="pipelines container-fluid">
            {/* <service service-info="service" ng-repeat="service in services" ng-show="services" view-config="viewConfig"></service> */}
            {!services.length && (
                <div className="no-services-message">No services configured</div>
            )}
        </div>
    );
};
export default Pipelines;
