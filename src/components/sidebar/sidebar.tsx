import { CIServiceSettings } from 'common/types';
import { ServiceTypesContext, SettingsContext } from 'components/react-types';
import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
                <Nav bsStyle="pills" stacked activeKey={service?.name}>
                    {settings.map(config => {
                        return (
                            <NavItem
                                key={config.name}
                                eventKey={config.name}
                                disabled={config.isDisabled}
                            >
                                <Link to={`/service/${config.name}`}>
                                    <span className="handle">::</span>
                                    <img
                                        className="pill-icon"
                                        src={getIconFor(config.baseUrl)}
                                    />
                                    <span className="pill-name">{config.name}</span>
                                </Link>
                            </NavItem>
                        );
                    })}
                </Nav>

                {settings.length > 0 ? <hr /> : null}

                <Nav className="actions" bsStyle="pills" stacked activeKey={view}>
                    {view === 'new' && service && (
                        <NavItem
                            key={service.name}
                            eventKey={'new'}
                            disabled={service.isDisabled}
                        >
                            <Link to={`/new/${service.baseUrl}/${service.name}`}>
                                <span className="handle">::</span>
                                <img
                                    className="pill-icon"
                                    src={getIconFor(service.baseUrl)}
                                />
                                <span className="pill-name">{service.name}</span>
                            </Link>
                        </NavItem>
                    )}
                    <NavItem eventKey="add">
                        <Link to={'/'}>
                            <i className="pill-icon fa fa-plus-circle fa-3x"></i>
                            <span className="pill-name">Add</span>
                        </Link>
                    </NavItem>
                    <NavItem eventKey="view">
                        <Link to={'view'}>
                            <i className="pill-icon fa fa-desktop fa-3x"></i>
                            <span className="pill-name">View</span>
                        </Link>
                    </NavItem>
                    <NavItem eventKey="notifications">
                        <Link to={'notifications'}>
                            <i className="pill-icon fa fa-bell fa-3x"></i>
                            <span className="pill-name">Notifications</span>
                        </Link>
                    </NavItem>
                    <NavItem eventKey="configuration">
                        <Link to={'configuration'}>
                            <i className="pill-icon fa fa-cogs fa-3x"></i>
                            <span className="pill-name">Configuration</span>
                        </Link>
                    </NavItem>
                </Nav>
            </div>
        </div>
    );
};
