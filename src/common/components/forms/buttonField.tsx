import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const FormButtonField = ({
    disabled,
    text,
    icon,
    onClick,
    style = 'success',
}: {
    disabled?: boolean;
    text: string;
    icon?: string;
    onClick: () => void;
    style?: 'success' | 'danger';
}) => {
    return (
        <>
            <Form.Group>
                <Row className="text-center">
                    <Col />
                    <Col sm="auto">
                        <Button onClick={onClick} variant={style} disabled={disabled}>
                            {icon && <i className={`fa fa-${icon}`}></i>} {text}
                        </Button>
                    </Col>
                    <Col />
                </Row>
            </Form.Group>
        </>
    );
};
