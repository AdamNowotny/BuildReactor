import core from 'common/core';
import {
    FormBooleanField,
    FormNumberField,
    FormSelectField,
} from 'components/formFields';
import { ViewConfigContext } from 'components/react-types';
import DashboardTheme from 'dashboard/components/dashboardTheme';
import React, { useContext } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

export default () => {
    const viewConfig = useContext(ViewConfigContext);

    const setField = (name, value) => {
        core.setViews({ ...viewConfig, [name]: value });
    };

    return (
        <Container>
            <Row>
                <Col md={5}>
                    <Form>
                        <FormSelectField
                            label={'Theme'}
                            items={{ dark: 'Dark', light: 'Light' }}
                            activeItem={viewConfig.theme}
                            onSelect={value => {
                                setField('theme', value);
                            }}
                        />
                        <FormNumberField
                            label="Number of Columns"
                            min={1}
                            max={20}
                            onChange={value => {
                                setField('columns', value);
                            }}
                        />
                        <FormBooleanField
                            label="Column width"
                            items={{ false: 'Fixed', true: 'Variable' }}
                            activeItem={viewConfig.fullWidthGroups}
                            onSelect={value => {
                                setField('fullWidthGroups', value);
                            }}
                        />
                        <FormBooleanField
                            label="Collapse groups"
                            activeItem={!viewConfig.singleGroupRows}
                            onSelect={value => {
                                setField('singleGroupRows', !value);
                            }}
                        />
                        <FormBooleanField
                            label="Show commit messages"
                            activeItem={viewConfig.showCommits}
                            onSelect={value => {
                                setField('showCommits', value);
                            }}
                        />
                        <FormBooleanField
                            label="Show commit messages for green builds"
                            activeItem={viewConfig.showCommitsWhenGreen}
                            onSelect={value => {
                                setField('showCommitsWhenGreen', value);
                            }}
                        />
                    </Form>
                </Col>
                <Col md={7}>
                    <DashboardTheme popup={false} />
                </Col>
            </Row>
        </Container>
    );
};
