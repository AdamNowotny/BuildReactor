import core from 'common/core';
import { CIPipelineList, CIServiceSettings } from 'common/types';
import { FormUrlField } from 'components/formFields';
import React, { useState } from 'react';
import { Form, Col } from 'react-bootstrap';
import './dynamicForm.css';

export default ({
    service,
    onShow,
}: {
    service?: CIServiceSettings;
    onShow?: (pipelines: CIPipelineList) => void;
}) => {
    if (!service) return null;
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleUrlChange = value => {
        console.log('handleUrlChange', value);
    };
    const handleShow = async () => {
        console.log('handleShow');
        setIsLoading(true);
        core.availableProjects(service, ({ pipelines }) => {
            console.log('handleShow response', pipelines);
            if (onShow) onShow(pipelines);
            setIsLoading(false);
        });
    };
    const handleSave = () => {
        core.saveService(service);
        // alert
    };
    return (
        <Form horizontal className="settings-form">
            <FormUrlField text={service.url ?? ''} onChange={handleUrlChange} />
            <div className="settings-buttons">
                <button type="button" className="btn btn-primary" onClick={handleShow}>
                    <i className={`fa fa-refresh ${isLoading ? 'fa-spin' : ''}`}></i>
                    Show
                </button>
                <button type="button" className="btn btn-success" onClick={handleSave}>
                    <i className="fa fa-save"></i>Save
                </button>
            </div>
        </Form>
    );
};
