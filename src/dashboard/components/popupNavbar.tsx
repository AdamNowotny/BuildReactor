import React from 'react';
import { Container, Nav, Navbar, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './popupNavbar.css';

export default ({ dark = false }: { dark: boolean }) => {
    const settingsTooltip = <Tooltip id="settings-tooltip">Settings</Tooltip>;
    const dashboardTooltip = <Tooltip id="dashboard-tooltip">Dashboard</Tooltip>;
    return (
        <Navbar fixed="top" variant={dark ? 'dark' : 'light'}>
            <Container fluid>
                <Navbar.Brand></Navbar.Brand>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <OverlayTrigger placement="bottom" overlay={settingsTooltip}>
                            <Nav.Link href="../options/options.html" target="_blank">
                                <i className="fa fa-gear fa-2x"></i>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav.Item>
                    <Nav.Item>
                        <OverlayTrigger placement="bottom" overlay={dashboardTooltip}>
                            <Nav.Link href="dashboard.html" target="_blank">
                                <i className="fa fa-tasks fa-2x"></i>
                            </Nav.Link>
                        </OverlayTrigger>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};
