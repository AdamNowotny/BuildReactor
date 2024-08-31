import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './popupNavbar.css';

export default ({ dark = false }: { dark: boolean }) => {
    return (
        <Navbar fixed="top" variant={dark ? 'dark' : 'light'}>
            <Container fluid>
                <Navbar.Brand></Navbar.Brand>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link href="options.html" target="_blank" title="Settings">
                            <i className="fa fa-gear fa-2x"></i>
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="dashboard.html" target="_blank" title="Dashboard">
                            <i className="fa fa-tasks fa-2x"></i>
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};
