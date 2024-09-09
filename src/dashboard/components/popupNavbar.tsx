import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import './popupNavbar.css';
import IconGear from '~icons/fa/gear';
import IconTasks from '~icons/fa/tasks';

export default ({ dark = false }: { dark: boolean }) => {
    return (
        <Navbar fixed="top" variant={dark ? 'dark' : 'light'}>
            <Container fluid>
                <Navbar.Brand></Navbar.Brand>
                <Nav className="justify-content-end" activeKey="/home">
                    <Nav.Item>
                        <Nav.Link href="options.html" target="_blank" title="Settings">
                            <IconGear />
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="dashboard.html" target="_blank" title="Dashboard">
                            <IconTasks />
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
        </Navbar>
    );
};
