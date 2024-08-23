import React from 'react';
import { Col, Form } from 'react-bootstrap';

export default ({ service }) => {
    return (
        <div>
            {service?.pipelines.map(pipeline => {
                return <p key={pipeline}>{pipeline}</p>;
            })}
        </div>
    );
};
