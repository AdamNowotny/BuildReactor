import { CIPipeline, CIPipelineList } from 'common/types';
import React from 'react';
import { Panel } from 'react-bootstrap';
import './pipelineList.css';

const GroupPanel = ({
    name,
    items,
    filter,
    selectedItems = [],
    onSelected,
}: {
    name: string;
    items: CIPipeline[];
    filter?: string;
    selectedItems?: string[];
    onSelected?: (selected: boolean) => void;
}) => {
    // selected
    // checkAll
    // filter
    // highlight
    // TODO: save
    const totalCount = items.length;
    const visibleCount = items.length;
    const filterFunc = (item: CIPipeline) => {
        return filter ? item.name.toLowerCase().includes(filter.toLowerCase()) : true;
    };
    const handleCheck = e => {
        console.log('handleCheck', e);
    };
    return (
        <Panel>
            <Panel.Heading>
                {/* <input type="checkbox" class="check-all" ng-change="checkAll(group)" ng-model="group.allSelected" ui-indeterminate="group.someSelected"> */}
                <span className="group-name">{name || 'Projects'}</span>
                <span
                    className="filter-count badge"
                    title="Visible / All projects in group"
                >
                    {filter && <span>{visibleCount} /</span>}
                    {totalCount}
                </span>
            </Panel.Heading>
            <Panel.Body>
                {items.filter(filterFunc).map((pipeline, index) => {
                    const isSelected = selectedItems.includes(pipeline.id);
                    return (
                        <label key={pipeline.id} className="checkbox">
                            <input
                                type="checkbox"
                                defaultChecked={isSelected}
                                onChange={handleCheck}
                            />
                            <span
                                className={`project-name ${
                                    pipeline.isDisabled ? 'text-muted' : ''
                                }`}
                            >
                                {pipeline.name}
                            </span>
                            {pipeline.isDisabled && (
                                <span className="pull-right">
                                    <span className="label label-default">Disabled</span>
                                </span>
                            )}
                        </label>
                    );
                })}
            </Panel.Body>
        </Panel>
    );
};
export default ({
    pipelines,
    filter,
    selectedItems = [],
    onSelected,
}: {
    pipelines?: CIPipelineList;
    filter?: string;
    selectedItems?: string[];
    onSelected?: (selected: string[]) => void;
}) => {
    if (!pipelines) return null;
    const groups = Map.groupBy(pipelines.items, ({ group }) => group ?? '');
    const groupNames: string[] = Array.from(groups.keys());
    const groupsJsx = groupNames.map((key: string) => (
        <GroupPanel key={key} name={key} items={groups.get(key) ?? []} filter={filter} />
    ));
    return <div>{groupsJsx}</div>;
};
