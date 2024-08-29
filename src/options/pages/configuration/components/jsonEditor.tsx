import { FormButtonField } from 'common/components/forms';
import React, { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import './jsonEditor.css';

export default ({ json, saveHandler }: { json: any; saveHandler: (any) => void }) => {
    const [errorText, setErrorText] = useState('');
    const [jsonText, setJsonText] = useState(JSON.stringify(json, null, 2) || '');
    const [isValid, setIsValid] = useState(false);

    const handleSave = () => {
        const json = parseJson(jsonText);
        if (json) saveHandler(json);
    };

    const handleChange = e => {
        const value = e.target.value;
        setJsonText(value);
        parseJson(value);
    };

    const parseJson = (text: string) => {
        try {
            const json = JSON.parse(text);
            setIsValid(json && typeof json === 'object' && json.length > -1);
            setErrorText('');
            return json;
        } catch (error: any) {
            setErrorText(error.message || 'Invalid JSON');
            setIsValid(false);
            return null;
        }
    };

    return (
        <div className="json-editor">
            <Form>
                <Form.Group className="json-editor-text">
                    <Form.Control
                        as="textarea"
                        onChange={handleChange}
                        defaultValue={jsonText}
                    />
                </Form.Group>
                <Form.Group className="json-editor-button">
                    <Row>
                        <Col sm={2}>
                            <FormButtonField
                                disabled={!(isValid && jsonText)}
                                style="danger"
                                text="Save"
                                icon="save"
                                onClick={handleSave}
                            />
                        </Col>
                        <Col sm={10}>
                            <Form.Text className="error-text text-danger">
                                {errorText}
                            </Form.Text>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>
        </div>
    );
};
