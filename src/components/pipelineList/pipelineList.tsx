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
    onSelected,
}: {
    pipelines?: CIPipelineList;
    filter?: string;
    selectedItems?: string[];
    onSelected?: (selected: string[]) => void;
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
        if (onSelected) onSelected(updatedSelected);
    };
    const handleAllChanged = (ids: string[], checked: boolean) => {
        ids.forEach(id => selectPipeline(id, checked));
        if (onSelected) onSelected(updatedSelected);
    };
    const groups = Map.groupBy(pipelines.items, ({ group }) => group ?? '');
    const groupNames: string[] = Array.from(groups.keys());
    const groupsJsx = groupNames.map((key: string) => (
        <GroupPanel
            key={key}
            name={key}
            items={groups.get(key) ?? []}
            selectedItems={selectedItems}
            filter={filter}
            onChanged={handleChanged}
            onAllChanged={handleAllChanged}
        />
    ));
    return <div>{groupsJsx}</div>;
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
    onChanged?: (id: string, checked: boolean) => void;
    onAllChanged?: (ids: string[], checked: boolean) => void;
}) => {
    const filterFunc = (item: CIPipeline) => {
        return filter ? item.name.toLowerCase().includes(filter.toLowerCase()) : true;
    };
    const filteredItems = items.filter(filterFunc);
    if (filteredItems.length === 0) return null;
    const allVisibleChecked = filteredItems.every(item =>
        selectedItems.includes(item.id),
    );
    const [open, setOpen] = useState(true);
    const checkAll = e => {
        if (!onAllChanged) return;
        onAllChanged(
            filteredItems.map(item => item.id),
            e.target.checked,
        );
    };
    const countTooltip = (
        <Tooltip id="count-tooltip">Visible / All projects in group</Tooltip>
    );

    return (
        <Card className="mb-3">
            <Card.Header>
                <Row style={{ cursor: 'pointer' }}>
                    <Col xs="auto">
                        <Form.Check
                            type={'checkbox'}
                            defaultChecked={allVisibleChecked}
                            onChange={checkAll}
                        />
                    </Col>
                    <Col
                        onClick={() => {
                            setOpen(!open);
                        }}
                    >
                        <span className="group-name">{name || 'Projects'}</span>
                    </Col>
                    <Col xs="auto">
                        <OverlayTrigger placement="bottom" overlay={countTooltip}>
                            <Badge className="filter-count badge" bg="dark">
                                {filter && <span>{filteredItems.length} /</span>}
                                {items.length}
                            </Badge>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </Card.Header>
            <Collapse in={open}>
                <Card.Body>
                    <Form>
                        {filteredItems.map(pipeline => {
                            const isSelected = selectedItems.includes(pipeline.id);
                            return (
                                <Form.Group key={pipeline.id}>
                                    <Row>
                                        <Col sm="auto">
                                            <Form.Check
                                                type={'checkbox'}
                                                defaultChecked={isSelected}
                                                onChange={e => {
                                                    if (onChanged)
                                                        onChanged(
                                                            pipeline.id,
                                                            e.target.checked,
                                                        );
                                                }}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Label
                                                className={
                                                    pipeline.isDisabled
                                                        ? 'text-body-secondary'
                                                        : ''
                                                }
                                            >
                                                {pipeline.name}
                                            </Form.Label>
                                        </Col>
                                        <Col sm="auto">
                                            {pipeline.isDisabled && (
                                                <Badge className="badge" bg="secondary">
                                                    Disabled
                                                </Badge>
                                            )}
                                        </Col>{' '}
                                    </Row>
                                </Form.Group>
                            );
                        })}
                    </Form>
                </Card.Body>
            </Collapse>
        </Card>
    );
};
