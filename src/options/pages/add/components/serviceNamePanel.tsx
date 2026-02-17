import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import styles from './serviceNamePanel.module.css';

export default ({
    active,
    onChange,
}: {
    active: boolean;
    onChange: (string) => void;
}) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (active) (inputRef.current as any).focus();
    });

    const handleChange = e => {
        setValue(e.target.value);
    };
    const handleClick = () => {
        onChange(value);
    };
    const submit = e => {
        onChange(value);
        e.preventDefault();
    };
    return (
        <div className={styles.panel}>
            <Container fluid>
                <Form className="service-add-form" onSubmit={submit}>
                    <div className="form-actions">
                        <Row>
                            <Col />
                            <Col xs={4}>
                                <div className="form-group">
                                    <Form.Control
                                        type="text"
                                        placeholder="Name"
                                        disabled={!active}
                                        onChange={handleChange}
                                        ref={inputRef}
                                    />
                                </div>
                            </Col>
                            <Col xs={1}>
                                <Button
                                    variant="primary"
                                    onClick={handleClick}
                                    disabled={!active || !value.trim()}
                                >
                                    Add
                                </Button>
                            </Col>
                            <Col />
                        </Row>
                    </div>
                </Form>
            </Container>
        </div>
    );
};
