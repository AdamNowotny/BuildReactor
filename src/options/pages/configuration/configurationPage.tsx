import core from 'common/core';
import {
    FormBooleanField,
    FormButtonField,
    FormInputField,
} from 'common/components/formFields';
import { SettingsContext } from 'common/components/react-types';
import ToastAlert from 'common/components/toastAlert';
import React, { useContext, useState } from 'react';
import { Alert, Col, Container, Form, Row } from 'react-bootstrap';
import JsonEditor from './components/jsonEditor';

export default () => {
    const settings = useContext(SettingsContext);
    const [includePasswords, setIncludePasswords] = useState(false);
    const [importUrl, setImportUrl] = useState('');
    const [json, setJson] = useState<object[]>();
    const [jsonEditorReset, setJsonEditorReset] = useState(0);
    const [toastAlertReset, setToastAlertReset] = useState(0);
    const [importError, setImportError] = useState<string | null>(null);

    const exportHandler = () => {
        const json = settings.map(item => {
            return {
                ...item,
                ...(includePasswords
                    ? { $$hashKey: undefined }
                    : {
                          username: undefined,
                          password: undefined,
                          token: undefined,
                          $$hashKey: undefined,
                      }),
            };
        });
        setJson(json);
        setJsonEditorReset(jsonEditorReset + 1);
    };

    const importHandler = async () => {
        try {
            const response = await fetch(importUrl);
            setJson(await response.json());
            setJsonEditorReset(jsonEditorReset + 1);
            setImportError(null);
        } catch (error: any) {
            setImportError(error?.message || 'Unknown error');
        }
    };

    const saveHandler = json => {
        setToastAlertReset(toastAlertReset + 1);
        core.saveConfig(json);
    };
    return (
        <>
            <Container fluid>
                <Row>
                    <Col md={4}>
                        <Form className="gap-3">
                            <fieldset>
                                <legend>Current configuration</legend>
                            </fieldset>
                            <FormBooleanField
                                label="Include passwords"
                                activeItem={includePasswords}
                                onSelect={value => {
                                    setIncludePasswords(value);
                                }}
                            />
                            <FormButtonField
                                text="Export"
                                icon="cloud-upload"
                                onClick={exportHandler}
                            />
                            <hr />
                            <fieldset>
                                <legend>Import from URL</legend>
                            </fieldset>
                            <FormInputField
                                text={importUrl}
                                onChange={setImportUrl}
                                type={'url'}
                                icon="globe"
                                placeholder={'URL'}
                            />
                            <FormButtonField
                                disabled={!importUrl}
                                text="Import"
                                icon="cloud-download"
                                onClick={importHandler}
                            />
                            {importError && (
                                <Alert variant="danger" className="my-3">
                                    {importError}
                                </Alert>
                            )}
                        </Form>
                    </Col>
                    <Col md={8}>
                        <JsonEditor
                            key={jsonEditorReset}
                            json={json}
                            saveHandler={saveHandler}
                        />
                    </Col>
                </Row>
            </Container>

            {toastAlertReset > 0 && (
                <ToastAlert key={toastAlertReset} text="Settings saved" />
            )}
        </>
    );
};
