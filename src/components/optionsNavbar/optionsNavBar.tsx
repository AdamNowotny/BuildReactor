import core from 'common/core';
import { CIServiceSettings } from 'common/types';
import OnOffSwitch from 'components/onOffSwitch/onOffSwitch';
import React, { useState } from 'react';
import { MenuItem, Nav, Navbar, NavDropdown, NavItem } from 'react-bootstrap';
import './optionsNavbar.css';
import RemoveModal from './removeModal';
import RenameModal from './renameModal';

export default ({ dark, service }: { dark: boolean; service?: CIServiceSettings }) => {
    const [showRename, setShowRename] = useState(false);
    const [showRemove, setShowRemove] = useState(false);

    const renameService = (name: string) => {
        closeModals();
        core.renameService(service?.name, name);
    };
    const removeService = () => {
        closeModals();
        core.removeService(service?.name);
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
            <Navbar fixed="top" fluid variant={dark ? 'dark' : 'light'}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <img
                            className="logo"
                            src="/img/icon.svg"
                            alt="BuildReactor logo"
                        />
                        BuildReactor
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Navbar.Form>
                        {service && (
                            <Nav stacked activeKey="/home">
                                <NavItem className="on-off-switch">
                                    <OnOffSwitch
                                        active={!service.isDisabled}
                                        onClick={handleOnOff}
                                    />
                                </NavItem>
                                <NavItem
                                    onSelect={() => {
                                        setShowRemove(true);
                                    }}
                                >
                                    <i className="fa fa-trash-o"></i> Remove
                                </NavItem>
                                <NavItem
                                    onSelect={() => {
                                        setShowRename(true);
                                    }}
                                >
                                    <i className="fa fa-pencil"></i> Rename
                                </NavItem>
                            </Nav>
                        )}
                        <Nav pullRight>
                            <NavDropdown title="Help" id="basic-nav-dropdown">
                                <MenuItem
                                    href="https://github.com/AdamNowotny/BuildReactor"
                                    target="_blank"
                                >
                                    <i className="fa fa-github fa-fw"></i> GitHub
                                </MenuItem>
                                <MenuItem divider />
                                <MenuItem
                                    href="https://chrome.google.com/webstore/detail/buildreactor/agfdekbncfakhgofmaacjfkpbhjhpjmp"
                                    target="_blank"
                                >
                                    <img src="/img/chrome.svg" width="18" height="14" />{' '}
                                    Chrome WebStore
                                </MenuItem>
                                <MenuItem
                                    href="https://addons.mozilla.org/en-US/firefox/addon/buildreactor-extension/"
                                    target="_blank"
                                >
                                    <img src="/img/firefox.svg" width="18" height="14" />{' '}
                                    Firefox Add-on
                                </MenuItem>
                            </NavDropdown>
                            <NavItem href="src/dashboard/dashboard.html" target="_blank">
                                <i className="fa fa-tasks"></i> Dashboard
                            </NavItem>
                        </Nav>
                    </Navbar.Form>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
};
