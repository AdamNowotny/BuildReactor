import React from 'react';
import { ListGroup, ListGroupItem, Panel } from 'react-bootstrap';
import './selectedPipelines.css';

export default ({ pipelines }: { pipelines: string[] }) => {
    // TODO: sortable
    return (
        <div className="selected-pipelines">
            <Panel>
                <Panel.Heading>
                    Monitored builds (update interval 30 seconds)
                </Panel.Heading>
                <ListGroup>
                    {pipelines.map(pipeline => {
                        return (
                            <ListGroupItem key={pipeline}>
                                <span className="handle">::</span>
                                <span className="project-name">{pipeline}</span>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </Panel>
        </div>
    );
};
