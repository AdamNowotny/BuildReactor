import core from 'common/core';
import {
    CIPipelineList,
    CIServiceDefinitionField,
    CIServiceSettings,
    WorkerError,
} from 'common/types';
import { FormInputField } from 'components/formFields';
import { ServiceTypesContext } from 'components/react-types';
import React, { useContext, useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import './dynamicForm.css';

export default ({
    service,
    onShow,
    onSave,
}: {
    service?: CIServiceSettings;
    onShow?: (pipelines: CIPipelineList) => void;
    onSave: () => void;
}) => {
    if (!service) return null;
    const [error, setError] = useState<WorkerError>();
    const serviceTypes = useContext(ServiceTypesContext);
    const serviceDefinition = serviceTypes.find(
        definition => definition.baseUrl === service.baseUrl,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleShow = () => {
        setIsLoading(true);
        core.availableProjects(service, ({ pipelines, error }) => {
            setIsLoading(false);
            if (error) {
                setError(error);
            } else {
                setError(undefined);
                if (onShow) onShow(pipelines);
            }
        });
    };
    const handleSave = () => {
        core.saveService(service);
    };
    return (
        <Form horizontal className="settings-form" key={service.name}>
            {serviceDefinition?.fields.map(field => (
                <ServiceDefinitionField
                    key={field.name}
                    service={service}
                    field={field}
                />
            ))}
            <div className="settings-buttons">
                <button type="button" className="btn btn-primary" onClick={handleShow}>
                    <i className={`fa fa-refresh ${isLoading ? 'fa-spin' : ''}`}></i>
                    Show
                </button>
                <button type="button" className="btn btn-success" onClick={handleSave}>
                    <i className="fa fa-save"></i>Save
                </button>
            </div>
            {error && (
                <Alert>
                    <div className="error-message">
                        {error.name}: {error.message}
                    </div>
                    <div>
                        <a
                            href={error.url}
                            target="_blank"
                            className="alert-link"
                            rel="noreferrer"
                        >
                            {error.url}
                        </a>
                    </div>
                </Alert>
            )}
        </Form>
    );
};

const ServiceDefinitionField = ({
    service,
    field,
}: {
    service: CIServiceSettings;
    field: CIServiceDefinitionField;
}) => {
    const changeField = (key: string, value: string | number) => {
        console.log('changeField', key, value);
    };

    return (
        <>
            {field.type === 'repository' && (
                <FormInputField
                    text={service.repository ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'repository', value);
                    }}
                    type={'text'}
                    icon="git"
                    placeholder={field.name ?? 'Repository, f.e. BuildReactor'}
                />
            )}
            {field.type === 'url' && (
                <FormInputField
                    text={service.url ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'url', value);
                    }}
                    type={'url'}
                    icon="globe"
                    placeholder={field.name ?? 'Server URL'}
                />
            )}
            {field.type === 'token' && (
                <FormInputField
                    text={field.name ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'token', value);
                    }}
                    type="password"
                    icon="ticket"
                    placeholder={field.name ?? 'Token'}
                />
            )}
            {field.type === 'username' && (
                <FormInputField
                    text={field.name ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'username', value);
                    }}
                    type="text"
                    icon="user"
                    placeholder={field.name ?? 'Username'}
                />
            )}
            {field.type === 'password' && (
                <FormInputField
                    text={field.name ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'password', value);
                    }}
                    type="password"
                    icon="key"
                    placeholder={field.name ?? 'Password'}
                />
            )}
            {field.type === 'branch' && (
                <FormInputField
                    text={field.name ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'branch', value);
                    }}
                    type="text"
                    icon="code-fork"
                    placeholder={field.name ?? 'Branch, f.e. refs/heads/release'}
                />
            )}
            <p
                className="help-block"
                dangerouslySetInnerHTML={{ __html: field.help ?? '' }}
            ></p>
        </>
    );
};
