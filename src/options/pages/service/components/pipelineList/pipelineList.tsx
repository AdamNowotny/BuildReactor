import { CIPipeline, CIPipelineList } from 'common/types';
import React, { useState } from 'react';
import {
    Badge,
    Card,
    Col,
    Collapse,
    Form,
    OverlayTrigger,
    Row,
    Tooltip,
} from 'react-bootstrap';
import './pipelineList.css';

export default ({
    pipelines,
    filter,
    selectedItems = [],
    onChanged,
}: {
    pipelines?: CIPipelineList;
    filter?: string;
    selectedItems?: string[];
    onChanged?: (selected: string[]) => void;
}) => {
    if (!pipelines) return null;
    let updatedSelected = [...selectedItems];
    const selectPipeline = (id: string, checked: boolean) => {
        const newSelected = checked
            ? [...updatedSelected, id]
            : updatedSelected.filter(item => item !== id);
        updatedSelected = newSelected;
        return updatedSelected;
    };

    const handleChanged = (id: string, checked: boolean) => {
        selectPipeline(id, checked);
        if (onChanged) onChanged(updatedSelected);
    };
    const handleAllChanged = (ids: string[], checked: boolean) => {
        ids.forEach(id => selectPipeline(id, checked));
        if (onChanged) onChanged(updatedSelected);
    };
    const groups = Map.groupBy(pipelines.items, ({ group }) => group ?? '');
    const groupNames: string[] = Array.from(groups.keys());
    return (
        <div>
            {groupNames.map((key: string) => (
                <GroupPanel
                    key={key}
                    name={key}
                    items={groups.get(key) ?? []}
                    selectedItems={selectedItems}
                    filter={filter}
                    onChanged={handleChanged}
                    onAllChanged={handleAllChanged}
                />
            ))}
        </div>
    );
};

const GroupPanel = ({
    name,
    items,
    filter,
    selectedItems = [],
    onChanged,
    onAllChanged,
}: {
    name: string;
    items: CIPipeline[];
    filter?: string;
    selectedItems?: string[];
    onChanged: (id: string, checked: boolean) => void;
    onAllChanged: (ids: string[], checked: boolean) => void;
}) => {
    const filteredItems = items.filter((item: CIPipeline) =>
        filter ? item.name.toLowerCase().includes(filter.toLowerCase()) : true,
    );
    if (filteredItems.length === 0) return null;

    const allVisibleChecked = filteredItems.every(item =>
        selectedItems.includes(item.id),
    );
    const someVisibleChecked = filteredItems.some(item =>
        selectedItems.includes(item.id),
    );
    const [open, setOpen] = useState(someVisibleChecked);
    if (!open && filter) setOpen(true);

    const checkAll = e => {
        onAllChanged(
            filteredItems.map(item => item.id),
            e.target.checked,
        );
    };

    return (
        <Card className="mb-3">
            <Card.Header>
                <GroupHeader
                    name={name}
                    allChecked={allVisibleChecked}
                    onAllChecked={checkAll}
                    onClick={() => {
                        setOpen(!open);
                    }}
                    itemsCount={filteredItems.length}
                    totalCount={items.length}
                    filter={!!filter}
                />
            </Card.Header>
            <Collapse in={open}>
                <div>
                    <Card.Body>
                        <Form>
                            {filteredItems.map(pipeline => (
                                <PipelineListItem
                                    key={pipeline.id}
                                    pipeline={pipeline}
                                    checked={selectedItems.includes(pipeline.id)}
                                    onChanged={onChanged}
                                    filter={filter}
                                />
                            ))}
                        </Form>
                    </Card.Body>
                </div>
            </Collapse>
        </Card>
    );
};

const GroupHeader = ({
    name,
    allChecked,
    onAllChecked,
    onClick,
    itemsCount,
    totalCount,
    filter,
}: {
    name: string;
    allChecked: boolean;
    onAllChecked: (any) => void;
    onClick?: () => void;
    itemsCount?: number;
    totalCount?: number;
    filter?: boolean;
}) => {
    return (
        <Row style={{ cursor: 'pointer' }}>
            <Col xs="auto">
                <Form.Check
                    type={'checkbox'}
                    checked={allChecked}
                    onChange={onAllChecked}
                />
            </Col>
            <Col onClick={onClick}>
                <span className="group-name">{name || 'Projects'}</span>
            </Col>
            <Col xs="auto">
                <OverlayTrigger
                    placement="bottom"
                    overlay={
                        <Tooltip id="count-tooltip">
                            Visible / All projects in group
                        </Tooltip>
                    }
                >
                    <Badge className="filter-count badge" bg="dark">
                        {filter && <span>{itemsCount} /</span>}
                        {totalCount}
                    </Badge>
                </OverlayTrigger>
            </Col>
        </Row>
    );
};

const PipelineListItem = ({
    pipeline,
    checked,
    onChanged,
    filter,
}: {
    pipeline: CIPipeline;
    checked: boolean;
    onChanged: (id: string, isChecked: boolean) => void;
    filter?: string;
}) => {
    const pipelineName = filter
        ? pipeline.name.replace(
              new RegExp(filter, 'gi'),
              '<span class="ui-match">$&</span>',
          )
        : pipeline.name;
    return (
        <Form.Group key={pipeline.id}>
            <Row>
                <Col sm="auto">
                    <Form.Check
                        type={'checkbox'}
                        checked={checked}
                        onChange={e => {
                            onChanged(pipeline.id, e.target.checked);
                        }}
                    />
                </Col>
                <Col>
                    <Form.Label
                        className={pipeline.isDisabled ? 'text-body-secondary' : ''}
                    >
                        <p dangerouslySetInnerHTML={{ __html: pipelineName }} />
                    </Form.Label>
                </Col>
                <Col sm="auto">
                    {pipeline.isDisabled && (
                        <Badge className="badge" bg="secondary">
                            Disabled
                        </Badge>
                    )}
                </Col>
            </Row>
        </Form.Group>
    );
};
