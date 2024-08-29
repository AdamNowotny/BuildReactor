import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import './selectedPipelines.css';

export default ({ pipelines }: { pipelines: string[] }) => {
    // TODO: sortable
    return (
        <div className="selected-pipelines">
            <Card>
                <Card.Header>Monitored builds (update interval 30 seconds)</Card.Header>
                <ListGroup>
                    {pipelines.map(pipeline => {
                        return (
                            <ListGroup.Item key={pipeline}>
                                <span className="handle">::</span>
                                <span className="project-name">{pipeline}</span>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Card>
        </div>
    );
};
