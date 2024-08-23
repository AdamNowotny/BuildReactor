import { CIServiceSettings } from 'common/types';
import { ServiceTypesContext, SettingsContext } from 'components/react-types';
import React, { useContext } from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import './sidebar.css';

export default ({ service, view }: { service?: CIServiceSettings; view?: string }) => {
    console.log('sidebar', view);
    const settings = useContext(SettingsContext);
    const serviceTypes = useContext(ServiceTypesContext);

    const getIconFor = (baseUrl): string => {
        const item = serviceTypes.find(serviceType => serviceType.baseUrl === baseUrl);
        if (!item) throw new Error(`Could not find service type for ${baseUrl}`);
        return item.icon;
    };
    return (
        <div className="sidebar-nav">
            <div className="scrollable">
                <Nav bsStyle="pills" stacked>
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
                                        src={`/src/${getIconFor(config.baseUrl)}`}
                                    />
                                    <span className="pill-name">{config.name}</span>
                                </Link>
                            </NavItem>
                        );
                    })}
                </Nav>
                {settings.length > 0 ? <hr /> : null}
                {view === 'new' && service && (
                    <NavItem
                        key={service.name}
                        eventKey={service.name}
                        disabled={service.isDisabled}
                    >
                        <span className="handle">::</span>
                        <img className="pill-icon" src={getIconFor(service.baseUrl)} />
                        <span className="pill-name">{service.name}</span>
                    </NavItem>
                )}

                <Nav className="actions" bsStyle="pills" stacked activeKey={view}>
                    <NavItem eventKey="new">
                        <NavLink to={'/'}>
                            <i className="pill-icon fa fa-plus-circle fa-3x"></i>
                            <span className="pill-name">Add</span>
                        </NavLink>
                    </NavItem>
                    <NavItem eventKey="view" active={view === 'view'}>
                        <NavLink to={'view'}>
                            <i className="pill-icon fa fa-desktop fa-3x"></i>
                            <span className="pill-name">View</span>
                        </NavLink>
                    </NavItem>
                    <NavItem eventKey="notifications" active={view === 'notifications'}>
                        <NavLink to={'notifications'}>
                            <i className="pill-icon fa fa-bell fa-3x"></i>
                            <span className="pill-name">Notifications</span>
                        </NavLink>
                    </NavItem>
                    <NavItem eventKey="configuration" active={view === 'configuration'}>
                        <NavLink to={'configuration'}>
                            <i className="pill-icon fa fa-cogs fa-3x"></i>
                            <span className="pill-name">Configuration</span>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
        </div>
    );
};
