import core from 'common/core';
import { ViewConfigContext } from 'dashboard/types';
import React, { useContext } from 'react';
import { Col, Form } from 'react-bootstrap';
import { FormBooleanField } from 'settings/components/formFields';

export default () => {
    const viewConfig = useContext(ViewConfigContext);

    const setField = (name, value) => {
        const newNotificationsConfig = {
            ...(viewConfig.notifications ?? {}),
            [name]: value,
        };
        core.setViews({ ...viewConfig, ...{ notifications: newNotificationsConfig } });
    };

    return (
        <Col md={12}>
            <Col md={4}>
                <Form horizontal>
                    <fieldset>
                        <legend>
                            <FormBooleanField
                                label={'Notifications'}
                                activeItem={viewConfig.notifications?.enabled}
                                onSelect={value => {
                                    setField('enabled', value);
                                }}
                            />
                        </legend>
                    </fieldset>
                    <FormBooleanField
                        label={'Build broken'}
                        activeItem={viewConfig.notifications?.buildBroken}
                        onSelect={value => {
                            setField('buildBroken', value);
                        }}
                        disabled={!viewConfig.notifications?.enabled}
                    />
                    <FormBooleanField
                        label={'Build fixed'}
                        activeItem={viewConfig.notifications?.buildFixed}
                        onSelect={value => {
                            setField('buildFixed', value);
                        }}
                        disabled={!viewConfig.notifications?.enabled}
                    />
                    <FormBooleanField
                        label={'Build started'}
                        activeItem={viewConfig.notifications?.buildStarted}
                        onSelect={value => {
                            setField('buildStarted', value);
                        }}
                        disabled={!viewConfig.notifications?.enabled}
                    />
                    <FormBooleanField
                        label={'Build successful'}
                        activeItem={viewConfig.notifications?.buildSuccessful}
                        onSelect={value => {
                            setField('buildSuccessful', value);
                        }}
                        disabled={!viewConfig.notifications?.enabled}
                    />
                    <FormBooleanField
                        label={'Build still failing'}
                        activeItem={viewConfig.notifications?.buildStillFailing}
                        onSelect={value => {
                            setField('buildStillFailing', value);
                        }}
                        disabled={!viewConfig.notifications?.enabled}
                    />
                </Form>
            </Col>
        </Col>
    );
};
