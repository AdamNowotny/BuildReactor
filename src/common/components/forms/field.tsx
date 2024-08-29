import React from 'react';
import { Col, Form, Row } from 'react-bootstrap';

export const FormField = ({
    children,
    label,
    disabled,
}: {
    children: React.JSX.Element;
    label: string;
    disabled?: boolean;
}) => {
    return (
        <Form.Group as={Row} className={`mb-1 ${disabled ? 'text-muted' : ''}`}>
            <Form.Label column sm="7">
                {label}
            </Form.Label>
            <Col sm="5">{children}</Col>
        </Form.Group>
    );
};
