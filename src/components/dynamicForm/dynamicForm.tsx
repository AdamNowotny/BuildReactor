import React from 'react';
import { Col, Form } from 'react-bootstrap';

export default ({ service }) => {
    return (
        <Form horizontal>
            <div>{service.name}</div>
            <div className="settings-buttons">
                <button type="button" className="btn btn-primary" ng-click="show()">
                    <i className="fa fa-refresh" ng-class="{ 'fa-spin': isLoading }"></i>{' '}
                    Show
                </button>
                <button type="button" className="btn btn-success" ng-click="save()">
                    <i className="fa fa-save"></i> Save
                </button>
            </div>
        </Form>
    );
};
