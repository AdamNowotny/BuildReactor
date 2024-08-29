import { CIServiceSettings } from 'common/types';
import { ServiceTypesContext, SettingsContext } from 'common/components/react-types';
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import './sidebar.css';

export default ({ service, view }: { service?: CIServiceSettings; view?: string }) => {
    const settings = useContext(SettingsContext);
    const serviceTypes = useContext(ServiceTypesContext);

    const getIconFor = (baseUrl): string => {
        const item = serviceTypes.find(serviceType => serviceType.baseUrl === baseUrl);
        return item ? `/${item.icon}` : '';
    };
    // TODO: sortable
    return (
        <div className="sidebar-nav">
            <div className="scrollable">
                <Nav variant="pills" className="flex-column">
                    {settings.map(config => {
                        return (
                            <Nav.Link
                                className={config.isDisabled ? 'service-disabled' : ''}
                                as={NavLink}
                                to={`/service/${config.name}`}
                                key={config.name}
                            >
                                <span className="handle">::</span>
                                <img
                                    className="pill-icon"
                                    src={getIconFor(config.baseUrl)}
                                />
                                <span className="pill-name">{config.name}</span>
                            </Nav.Link>
                        );
                    })}
                </Nav>

                {settings.length > 0 ? <hr /> : null}

                <Nav className="actions flex-column" variant="pills" activeKey={view}>
                    {view === 'new' && service && (
                        <Nav.Link
                            as={NavLink}
                            to={`/new/${service.baseUrl}/${service.name}`}
                            disabled={service.isDisabled}
                        >
                            <span className="handle">::</span>
                            <img
                                className="pill-icon"
                                src={getIconFor(service.baseUrl)}
                            />
                            <span className="pill-name">{service.name}</span>
                        </Nav.Link>
                    )}
                    <Nav.Link as={NavLink} to="/">
                        <i className="pill-icon fa fa-plus-circle fa-3x"></i>
                        <span className="pill-name">Add</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="view">
                        <i className="pill-icon fa fa-desktop fa-3x"></i>
                        <span className="pill-name">View</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="notifications">
                        <i className="pill-icon fa fa-bell fa-3x"></i>
                        <span className="pill-name">Notifications</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="configuration">
                        <i className="pill-icon fa fa-cogs fa-3x"></i>
                        <span className="pill-name">Configuration</span>
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    );
};
