import OnOffSwitch from 'common/components/onOffSwitch';
import core from 'common/core';
import { CIServiceSettings } from 'common/types';
import React, { useState } from 'react';
import { Col, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import IconGithub from '~icons/fa/github';
import IconPencil from '~icons/fa/pencil';
import IconTasks from '~icons/fa/tasks';
import IconTrash from '~icons/fa/trash-o';
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
                                        <IconTrash />
                                        &nbsp; Remove
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link
                                        onClick={() => {
                                            setShowRename(true);
                                        }}
                                    >
                                        <IconPencil /> Rename
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
                                    <span style={{ verticalAlign: 'text-bottom' }}>
                                        <IconGithub fontSize={'.8em'} />
                                    </span>
                                    &nbsp;GitHub
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
                                    <IconTasks
                                        fontSize={'.7em'}
                                        alignmentBaseline="middle"
                                    />
                                    &nbsp; Dashboard
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};
