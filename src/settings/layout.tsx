import { CIServiceSettings } from 'common/types';
import OptionsNavBar from 'components/optionsNavbar/optionsNavBar';
import PageContext from 'components/pageContext';
import Sidebar from 'components/sidebar/sidebar';
import React from 'react';
import { Col } from 'react-bootstrap';

export default ({ service }) => {
    return (
        <PageContext>
            <OptionsNavBar dark={false} service={service} />

            <Col sm={2}>{/* <Sidebar /> */}</Col>
            <Col sm={10}></Col>
        </PageContext>
    );
};
