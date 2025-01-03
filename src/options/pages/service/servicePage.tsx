import { ServiceContext } from 'common/components/react-types';
import ToastAlert from 'common/components/toastAlert';
import core from 'common/core';
import { CIPipelineList, CIServiceSettings } from 'common/types';
import React, { useContext, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import DynamicForm from './components/dynamicForm';
import PipelineFilter from './components/filterQuery';
import PipelineList from './components/pipelineList/pipelineList';
import SelectedPipelines from './components/selectedPipelines';

export default () => {
    const navigate = useNavigate();
    const service = useContext(ServiceContext);
    const [newService, setNewService] = useState<CIServiceSettings>();
    const [allPipelines, setAllPipelines] = useState<CIPipelineList>();
    const [filter, setFilter] = useState();
    const [toastAlertReset, setToastAlertReset] = useState(0);

    if (newService?.name !== service?.name) {
        // reset state
        setNewService(service);
        setAllPipelines(undefined);
    }
    if (!service || !newService) return null;

    const showPipelines = (pipelines: CIPipelineList, settings: CIServiceSettings) => {
        setNewService({ ...settings, ...{ pipelines: settings.pipelines } });
        setAllPipelines(pipelines);
        setFilter(undefined);
    };
    const handleSave = (settings: CIServiceSettings) => {
        setNewService(settings);
        setToastAlertReset(toastAlertReset + 1);
        core.saveService(settings);
        void navigate(`/service/${settings.name}`);
    };

    const updateFilter = value => {
        setFilter(value);
    };
    const updateSelected = (selected: string[]) => {
        setNewService({ ...newService, ...{ pipelines: selected } });
    };
    return (
        <>
            <Container fluid>
                <Row>
                    <Col xs={6}>
                        <DynamicForm
                            service={newService}
                            onShow={showPipelines}
                            onSave={handleSave}
                        />
                        <SelectedPipelines pipelines={service.pipelines} />
                    </Col>
                    <Col xs={6} className="project-selection-container">
                        {allPipelines && (
                            <PipelineFilter text={filter} onUpdate={updateFilter} />
                        )}
                        <PipelineList
                            key={service.name}
                            pipelines={allPipelines}
                            filter={filter}
                            selectedItems={newService.pipelines}
                            onChanged={updateSelected}
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
