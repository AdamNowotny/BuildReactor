import { FormButtonField } from 'components/formFields';
import React, { useState } from 'react';
import { Col, FormControl, FormGroup } from 'react-bootstrap';
import './jsonEditor.css';

export default ({ json, saveHandler }: { json: any; saveHandler: (any) => void }) => {
    const [errorText, setErrorText] = useState('');
    const [jsonText, setJsonText] = useState(JSON.stringify(json, null, 2) || '');
    const [isValid, setIsValid] = useState(true);

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
            <FormGroup
                validationState={isValid ? null : 'error'}
                className="json-editor-text"
            >
                <FormControl
                    componentClass="textarea"
                    onChange={handleChange}
                    defaultValue={jsonText}
                />
            </FormGroup>
            <FormGroup className="json-editor-button">
                <Col sm={10}>
                    <FormControl.Static>{errorText}</FormControl.Static>
                </Col>
                <Col sm={2}>
                    <FormButtonField
                        disabled={!(isValid && jsonText)}
                        style="danger"
                        text="Save"
                        icon="save"
                        onClick={handleSave}
                    />
                </Col>
            </FormGroup>
        </div>
    );
};
