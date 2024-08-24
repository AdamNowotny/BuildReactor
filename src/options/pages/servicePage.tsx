import DynamicForm from 'components/dynamicForm/dynamicForm';
import PipelineFilter from 'components/filterQuery/filterQuery';
import PipelineList from 'components/pipelineList/pipelineList';
import { ServiceContext } from 'components/react-types';
import SelectedPipelines from 'components/selectedPipelines/selectedPipelines';
import React, { useContext, useState } from 'react';
import { Col, Grid } from 'react-bootstrap';

export default () => {
    const service = useContext(ServiceContext);
    const [pipelines, setPipelines] = useState();
    const [filter, setFilter] = useState();

    const showPipelines = piplines => {
        setPipelines(piplines);
    };
    const updateFilter = value => {
        setFilter(value);
    };
    const updateSelected = (selected: string[]) => {
        console.log('updsateSelected', selected);
    };
    const handleSave = () => {
        console.log('save', pipelines);
    };
    return (
        <Grid>
            <Col xs={6} className="settings-container">
                <DynamicForm
                    service={service}
                    onShow={showPipelines}
                    onSave={handleSave}
                />
                <SelectedPipelines service={service} />
            </Col>
            <Col xs={6} className="project-selection-container">
                <PipelineFilter onUpdate={updateFilter} />
                <PipelineList
                    pipelines={pipelines}
                    filter={filter}
                    selectedItems={service?.pipelines}
                    onSelected={updateSelected}
                />
            </Col>
        </Grid>
    );
};
