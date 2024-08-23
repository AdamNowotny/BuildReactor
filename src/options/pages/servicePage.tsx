import DynamicForm from 'components/dynamicForm/dynamicForm';
import PipelineFilter from 'components/pipelineFilter/pipelineFilter';
import PipelineList from 'components/pipelineList/pipelineList';
import { ServiceContext } from 'components/react-types';
import SelectedPipelines from 'components/selectedPipelines/selectedPipelines';
import React, { useContext } from 'react';
import { Col } from 'react-bootstrap';

export default () => {
    const service = useContext(ServiceContext);
    return (
        <>
            <Col xs={6}>
                <DynamicForm service={service} />
                <SelectedPipelines service={service} />
            </Col>
            <Col xs={6}>
                <PipelineFilter />
                <PipelineList />
            </Col>
        </>
    );
};
