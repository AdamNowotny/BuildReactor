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
import { Alert, Form } from 'react-bootstrap';
import './dynamicForm.css';

export default ({
    service,
    onShow,
    onSave,
}: {
    service: CIServiceSettings;
    onShow?: (pipelines: CIPipelineList) => void;
    onSave: (service: CIServiceSettings) => void;
}) => {
    const [error, setError] = useState<WorkerError>();
    let updatedService = { ...service };
    const serviceTypes = useContext(ServiceTypesContext);
    const serviceDefinition = serviceTypes.find(
        definition => definition.baseUrl === service.baseUrl,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleShow = () => {
        setIsLoading(true);
        core.availableProjects(updatedService, ({ pipelines, error }) => {
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
        onSave(updatedService);
    };
    return (
        <Form className="settings-form" key={updatedService.name}>
            {serviceDefinition?.fields.map(field => {
                return (
                    <ServiceDefinitionField
                        key={field.type}
                        service={updatedService}
                        field={field}
                        onChange={service => {
                            updatedService = service;
                        }}
                    />
                );
            })}
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
    onChange,
}: {
    service: CIServiceSettings;
    field: CIServiceDefinitionField;
    onChange?: (service: CIServiceSettings) => void;
}) => {
    const changeField = (key: string, value: string | number) => {
        service[key] = value;
        if (onChange) onChange(service);
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
