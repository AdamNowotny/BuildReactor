import core from 'common/core';
import Alert from 'components/alert';
import { FormBooleanField, FormButtonField, FormUrlField } from 'components/formFields';
import JsonEditor from 'components/jsonEditor/jsonEditor';
import { SettingsContext } from 'components/react-types';
import ToastAlert from 'components/toastAlert/toastAlert';
import React, { useContext, useState } from 'react';
import { Col, Form } from 'react-bootstrap';

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
        <div>
            <Col md={12}>
                <Col md={4}>
                    <Form horizontal>
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
                        <fieldset>
                            <legend>Import from URL</legend>
                        </fieldset>
                        <FormUrlField text={importUrl} onChange={setImportUrl} />
                        <FormButtonField
                            disabled={!importUrl}
                            text="Import"
                            icon="cloud-download"
                            onClick={importHandler}
                        />
                        <Alert text={importError} />
                    </Form>
                </Col>
                <Col md={8} style={{ height: '100vh' }}>
                    <JsonEditor
                        key={jsonEditorReset}
                        json={json}
                        saveHandler={saveHandler}
                    />
                </Col>
            </Col>
            {toastAlertReset > 0 && (
                <ToastAlert key={toastAlertReset} text="Settings saved" />
            )}
        </div>
    );
};
