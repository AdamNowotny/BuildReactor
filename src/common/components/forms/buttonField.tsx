import React, { ReactNode } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

export const FormButtonField = ({
    disabled,
    text,
    iconSvg,
    onClick,
    style = 'success',
}: {
    disabled?: boolean;
    text: string;
    iconSvg?: ReactNode;
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
                            <span
                                style={{
                                    fontSize: '0.7em',
                                    marginRight: '7px',
                                    verticalAlign: 'text-bottom',
                                }}
                            >
                                {iconSvg}
                            </span>
                            {text}
                        </Button>
                    </Col>
                    <Col />
                </Row>
            </Form.Group>
        </>
    );
};
