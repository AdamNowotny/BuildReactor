import React, { useEffect, useState } from 'react';
import './pipelines.css';
import { CIBuild, ConfigStorageItem, ServiceStateItem } from 'services/service-types';
import Build from './build';
import core from 'common/core';

const Builds = ({ builds }: { builds: CIBuild[] }) => {
    const width = 100 / Math.min(builds.length, config.columns ?? 1);
    return (
        <div className="group-items">
            {builds.map((build: CIBuild) => {
                return <Build key={build.id} build={build} width={width} />;
            })}
        </div>
    );
};

const BuildGroup = ({ groupName, builds }: { groupName: string; builds: CIBuild[] }) => {
    let fullWidth;
    if (config.fullWidthGroups ?? builds.length >= (config.columns ?? 1)) {
        fullWidth = 100;
    } else {
        const maxColumns = config.columns ?? 1;
        const minColumns = Math.min(builds.length, maxColumns);
        fullWidth = (100 * minColumns) / maxColumns;
    }
    return (
        <div
            key={groupName}
            className={`build-group ${config.singleGroupRows ? 'pull-left' : ''}`}
            style={{ width: `${fullWidth}%` }}
        >
            {groupName && <div className="group-name">{groupName}</div>}

            <Builds builds={builds} />
        </div>
    );
};

const BuildGroups = ({ serviceState }: { serviceState: ServiceStateItem }) => {
    const groups = Map.groupBy(serviceState.items ?? [], ({ group }) => group ?? '');
    const groupNames: string[] = Array.from(groups.keys());
    const groupsJsx = groupNames.map((key: string) => (
        <BuildGroup key={key} groupName={key} builds={groups.get(key) ?? []} />
    ));
    return groupsJsx;
};

const Service = ({ serviceState }: { serviceState: ServiceStateItem }) => (
    <div key={serviceState.name} className="service row">
        <div className="service-name">{serviceState.name}</div>
        <BuildGroups serviceState={serviceState} />
    </div>
);

let config: ConfigStorageItem;
const Pipelines = ({ viewConfig }: { viewConfig: ConfigStorageItem }) => {
    config = viewConfig;
    const [serviceStates, setServiceStates] = useState<any[]>([]);
    useEffect(() => {
        core.activeProjects.subscribe((services: any) => {
            setServiceStates(services);
        });
    });
    let content;
    if (serviceStates.length) {
        content = serviceStates.map(serviceState => (
            <Service key={serviceState.name} serviceState={serviceState} />
        ));
    } else {
        content = <div className="no-services-message">No services configured</div>;
    }
    return <div className="pipelines container-fluid">{content}</div>;
};
export default Pipelines;
