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
    // highlight
    // TODO: save
    const filterFunc = (item: CIPipeline) => {
        return filter ? item.name.toLowerCase().includes(filter.toLowerCase()) : true;
    };
    const handleCheck = (id: string, checked: boolean) => {
        console.log('handleCheck', id, checked);
    };
    const filteredItems = items.filter(filterFunc);
    return (
        <Panel>
            <Panel.Heading>
                {/* <input type="checkbox" class="check-all" ng-change="checkAll(group)" ng-model="group.allSelected" ui-indeterminate="group.someSelected"> */}
                <span className="group-name">{name || 'Projects'}</span>
                <span
                    className="filter-count badge"
                    title="Visible / All projects in group"
                >
                    {filter && <span>{filteredItems.length} /</span>}
                    {items.length}
                </span>
            </Panel.Heading>
            <Panel.Body>
                {filteredItems.map(pipeline => {
                    const isSelected = selectedItems.includes(pipeline.id);
                    return (
                        <label key={pipeline.id} className="checkbox">
                            <input
                                type="checkbox"
                                defaultChecked={isSelected}
                                onChange={e => {
                                    handleCheck(pipeline.id, e.target.checked);
                                }}
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
