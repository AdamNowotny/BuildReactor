import { ServiceContext } from 'common/components/react-types';
import core from 'common/core';
import React, { useContext } from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { ReactSortable } from 'react-sortablejs';
import './selectedPipelines.css';

export default ({ pipelines }: { pipelines: string[] }) => {
    const service = useContext(ServiceContext);
    const selectedPipelines = pipelines.map(id => ({ id, name: id }));
    const setOrder = (items: { id: string; name: string }[]) => {
        if (!service) return;
        const itemIds = items.map(({ id }) => id);
        if (JSON.stringify(itemIds) !== JSON.stringify(pipelines)) {
            core.setBuildOrder(service.name, itemIds);
        }
    };
    return (
        <div className="selected-pipelines">
            <Card>
                <Card.Header>Monitored builds (update interval 30 seconds)</Card.Header>
                <ListGroup>
                    <ReactSortable
                        list={selectedPipelines}
                        setList={setOrder}
                        handle=".handle"
                    >
                        {selectedPipelines.map(pipeline => {
                            return (
                                <ListGroup.Item key={pipeline.id}>
                                    <span className="handle">::</span>
                                    <span className="project-name">{pipeline.name}</span>
                                </ListGroup.Item>
                            );
                        })}
                    </ReactSortable>
                </ListGroup>
            </Card>
        </div>
    );
};
