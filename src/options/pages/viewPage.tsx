import {
    FormBooleanField,
    FormNumberField,
    FormSelectField,
} from 'common/components/forms/index';
import { ViewConfigContext } from 'common/components/react-types';
import core from 'common/core';
import DashboardTheme, { themeDefinition } from 'dashboard/components/dashboardTheme';
import React, { useContext } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

export default () => {
    const viewConfig = useContext(ViewConfigContext);

    const setField = (name, value) => {
        core.setViews({ ...viewConfig, [name]: value });
    };

    const themeItems = Object.fromEntries(
        Object.entries(themeDefinition).map(([key, value]) => [key, value.name]),
    );
    return (
        <Container>
            <Row>
                <Col md={5}>
                    <Form>
                        <FormSelectField
                            label={'Theme'}
                            items={themeItems}
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
