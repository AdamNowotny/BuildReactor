import OnOffSwitch from 'common/components/onOffSwitch';
import core from 'common/core';
import { CIServiceSettings } from 'common/types';
import React, { useState } from 'react';
import { Col, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './optionsNavbar.css';
import RemoveModal from './removeModal';
import RenameModal from './renameModal';

export default ({ dark, service }: { dark: boolean; service?: CIServiceSettings }) => {
    const [showRename, setShowRename] = useState(false);
    const [showRemove, setShowRemove] = useState(false);

    const renameService = (name: string) => {
        if (!service) return;
        closeModals();
        core.renameService(service.name, name);
    };
    const removeService = () => {
        if (!service) return;
        closeModals();
        core.removeService(service.name);
    };

    const handleOnOff = enabled => {
        if (!service) return;
        if (enabled) {
            core.enableService(service.name);
        } else {
            core.disableService(service.name);
        }
    };
    const closeModals = () => {
        setShowRename(false);
        setShowRemove(false);
    };
    return (
        <>
            <RemoveModal
                serviceName={service?.name}
                show={showRemove}
                onRemove={removeService}
                onCancel={closeModals}
            />
            <RenameModal
                serviceName={service?.name}
                show={showRename}
                onRename={renameService}
                onCancel={closeModals}
            />
            <Navbar
                fixed="top"
                variant={dark ? 'dark' : 'light'}
                className={`justify-content-between bg-${
                    dark ? 'dark' : 'light'
                } border-bottom`}
                expand="lg"
            >
                <Navbar.Brand>
                    <img className="logo" src="/img/icon.svg" alt="BuildReactor logo" />
                    BuildReactor
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Col sm="3">
                        {service && (
                            <Nav className="gap-2">
                                <Nav.Item className="on-off-switch">
                                    <Nav.Link>
                                        <OnOffSwitch
                                            active={!service.isDisabled}
                                            onChange={handleOnOff}
                                        />
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        onClick={() => {
                                            setShowRemove(true);
                                        }}
                                    >
                                        <i className="fa fa-trash-o"></i> Remove
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        onClick={() => {
                                            setShowRename(true);
                                        }}
                                    >
                                        <i className="fa fa-pencil"></i> Rename
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        )}
                    </Col>
                    <Col />
                    <Col sm="2">
                        <Nav className="gap-2">
                            <NavDropdown title="Help">
                                <NavDropdown.Item
                                    href="https://github.com/AdamNowotny/BuildReactor"
                                    target="_blank"
                                >
                                    <i className="fa fa-github fa-fw"></i> GitHub
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item
                                    href="https://chrome.google.com/webstore/detail/buildreactor/agfdekbncfakhgofmaacjfkpbhjhpjmp"
                                    target="_blank"
                                >
                                    <img src="/img/chrome.svg" width="18" height="14" />{' '}
                                    Chrome WebStore
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    href="https://addons.mozilla.org/en-US/firefox/addon/buildreactor-extension/"
                                    target="_blank"
                                >
                                    <img src="/img/firefox.svg" width="18" height="14" />{' '}
                                    Firefox Add-on
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Item>
                                <Nav.Link href="dashboard.html" target="_blank">
                                    <i className="fa fa-tasks"></i> Dashboard
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};
