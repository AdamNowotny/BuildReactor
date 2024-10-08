import { FormInputField } from 'common/components/forms';
import { ServiceTypesContext } from 'common/components/react-types';
import core from 'common/core';
import {
    CIPipelineList,
    CIServiceDefinitionField,
    CIServiceSettings,
    WorkerError,
} from 'common/types';
import React, { useContext, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import IconCodeFork from '~icons/fa/code-fork';
import IconGit from '~icons/fa/git';
import IconGlobe from '~icons/fa/globe';
import IconKey from '~icons/fa/key';
import IconTicket from '~icons/fa/ticket';
import IconUser from '~icons/fa/user';
import './dynamicForm.css';
import IconSave from '~icons/fa/save';
import IconRefresh from '~icons/fa/refresh';

export default ({
    service,
    onShow,
    onSave,
}: {
    service: CIServiceSettings;
    onShow?: (pipelines: CIPipelineList, settings: CIServiceSettings) => void;
    onSave?: (service: CIServiceSettings) => void;
}) => {
    const [error, setError] = useState<WorkerError>();
    let updatedService = { ...service };
    const serviceTypes = useContext(ServiceTypesContext);
    const serviceFields =
        serviceTypes.find(definition => definition.baseUrl === service.baseUrl)?.fields ??
        [];
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleShow = e => {
        setIsLoading(true);
        core.availableProjects(updatedService, ({ pipelines, error }) => {
            setIsLoading(false);
            if (error) {
                setError(error);
            } else {
                setError(undefined);
                if (onShow) onShow(pipelines, updatedService);
            }
        });
        e.preventDefault();
    };
    const handleSave = () => {
        if (onSave) onSave(updatedService);
    };

    return (
        <Form className="settings-form" key={updatedService.name} onSubmit={handleShow}>
            {serviceFields.map(field => {
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
                <button type="submit" className="btn btn-primary" onClick={handleShow}>
                    <IconRefresh className={isLoading ? 'loading' : ''} />
                    Show
                </button>
                <button type="button" className="btn btn-success" onClick={handleSave}>
                    <IconSave />
                    Save
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
                    iconSvg={<IconGit />}
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
                    iconSvg={<IconGlobe />}
                    placeholder={field.name ?? 'Server URL'}
                />
            )}
            {field.type === 'token' && (
                <FormInputField
                    text={service.token ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'token', value);
                    }}
                    type="password"
                    iconSvg={<IconTicket />}
                    placeholder={field.name ?? 'Token'}
                />
            )}
            {field.type === 'username' && (
                <FormInputField
                    text={service.username ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'username', value);
                    }}
                    type="text"
                    iconSvg={<IconUser />}
                    placeholder={field.name ?? 'Username'}
                />
            )}
            {field.type === 'password' && (
                <FormInputField
                    text={service.password ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'password', value);
                    }}
                    type="password"
                    iconSvg={<IconKey />}
                    placeholder={field.name ?? 'Password'}
                />
            )}
            {field.type === 'branch' && (
                <FormInputField
                    text={service.branch ?? ''}
                    onChange={value => {
                        changeField(field.config ?? 'branch', value);
                    }}
                    type="text"
                    iconSvg={<IconCodeFork />}
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
