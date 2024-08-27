import core from 'common/core';
import { CIPipelineList, CIServiceSettings } from 'common/types';
import DynamicForm from 'components/dynamicForm/dynamicForm';
import PipelineFilter from 'components/filterQuery/filterQuery';
import PipelineList from 'components/pipelineList/pipelineList';
import { ServiceContext } from 'components/react-types';
import SelectedPipelines from 'components/selectedPipelines/selectedPipelines';
import ToastAlert from 'components/toastAlert/toastAlert';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// TODO: clear pipelines when serviceId changed

export default () => {
    const navigate = useNavigate();
    const service = useContext(ServiceContext);
    if (!service) return null;
    let updatedService = { ...service };
    const [pipelines, setPipelines] = useState<CIPipelineList>();
    const [filter, setFilter] = useState();
    const [toastAlertReset, setToastAlertReset] = useState(0);

    const updateFilter = value => {
        setFilter(value);
    };
    const updateSelected = (selected: string[]) => {
        updatedService.pipelines = selected;
    };
    const showPipelines = piplines => {
        setPipelines(piplines);
    };
    const handleSave = (settings: CIServiceSettings) => {
        updatedService = { ...settings, pipelines: updatedService.pipelines };
        core.saveService(updatedService);
        setToastAlertReset(toastAlertReset + 1);
        navigate(`/service/${settings.name}`);
    };
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={6}>
                        <DynamicForm
                            service={updatedService}
                            onShow={showPipelines}
                            onSave={handleSave}
                        />
                        <SelectedPipelines pipelines={updatedService.pipelines} />
                    </Col>
                    <Col xs={6} className="project-selection-container">
                        {pipelines && <PipelineFilter onUpdate={updateFilter} />}
                        <PipelineList
                            key={service.name}
                            pipelines={pipelines}
                            filter={filter}
                            selectedItems={service.pipelines}
                            onSelected={updateSelected}
                        />
                    </Col>
                </Row>
            </Container>
            {toastAlertReset > 0 && (
                <div className="alert-saved">
                    <ToastAlert key={toastAlertReset} text="Settings saved" />
                </div>
            )}
        </>
    );
};
