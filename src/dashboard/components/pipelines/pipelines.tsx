import { CIBuild, ServiceStateItem } from 'common/types';
import { ServiceStateContext, ViewConfigContext } from 'common/components/react-types';
import React, { useContext } from 'react';
import Build from './build';
import './pipelines.css';

const BuildGroup = ({ groupName, builds }: { groupName: string; builds: CIBuild[] }) => {
    const viewConfig = useContext(ViewConfigContext);
    let fullWidth;
    if (viewConfig.fullWidthGroups ?? builds.length >= (viewConfig.columns ?? 1)) {
        fullWidth = 100;
    } else {
        const maxColumns = viewConfig.columns ?? 1;
        const minColumns = Math.min(builds.length, maxColumns);
        fullWidth = (100 * minColumns) / maxColumns;
    }
    const itemWidth = 100 / Math.min(builds.length, viewConfig.columns ?? 1);
    return (
        <div
            key={groupName}
            className="build-group pull-left"
            style={{ width: `${fullWidth}%` }}
        >
            {groupName && <div className="group-name">{groupName}</div>}
            <div className="group-items">
                {builds.map((build: CIBuild) => {
                    return <Build key={build.id} build={build} width={itemWidth} />;
                })}
            </div>
        </div>
    );
};

const Service = ({ serviceState }: { serviceState: ServiceStateItem }) => {
    const groups = Map.groupBy(serviceState.items ?? [], ({ group }) => group ?? '');
    const groupNames: string[] = Array.from(groups.keys());
    return (
        <div key={serviceState.name} className="service">
            <div className="service-name">{serviceState.name}</div>
            {groupNames.map((key: string) => (
                <BuildGroup key={key} groupName={key} builds={groups.get(key) ?? []} />
            ))}
        </div>
    );
};

const Pipelines = () => {
    const serviceStates = useContext(ServiceStateContext);
    let content;
    if (serviceStates.length) {
        content = serviceStates.map(serviceState => (
            <Service key={serviceState.name} serviceState={serviceState} />
        ));
    } else {
        content = <div className="no-services-message">No services configured</div>;
    }
    return <div className="pipelines">{content}</div>;
};
export default Pipelines;
