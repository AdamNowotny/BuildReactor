import { ServiceTypesContext, SettingsContext } from 'common/components/react-types';
import core from 'common/core';
import { CIServiceSettings } from 'common/types';
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import IconPlus from '~icons/fa-solid/plus-circle';
import IconBell from '~icons/fa/bell';
import IconCogs from '~icons/fa/cogs';
import IconDesktop from '~icons/fa/desktop';
import './sidebar.css';

export default ({ service, view }: { service?: CIServiceSettings; view?: string }) => {
    const settings = useContext(SettingsContext);
    const serviceTypes = useContext(ServiceTypesContext);

    const getIconFor = (baseUrl): string => {
        const item = serviceTypes.find(serviceType => serviceType.baseUrl === baseUrl);
        return item ? `/icons/${item.icon}` : '';
    };
    const sortableServices = settings.map(config => ({
        id: config.name,
        name: config.name,
        baseUrl: config.baseUrl,
        isDisabled: config.isDisabled,
    }));
    const sortServices = (services): void => {
        const oldIds = settings.map(config => config.name);
        const newIds = services.map(config => config.name);
        if (JSON.stringify(oldIds) !== JSON.stringify(newIds)) {
            core.setOrder(newIds);
        }
    };
    return (
        <div className="sidebar-nav">
            <div className="scrollable">
                <Nav variant="pills" className="flex-column">
                    <ReactSortable list={sortableServices} setList={sortServices}>
                        {sortableServices.map(config => {
                            return (
                                <Nav.Link
                                    className={
                                        config.isDisabled ? 'service-disabled' : ''
                                    }
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
                    </ReactSortable>
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
                        <span className="pill-icon">
                            <IconPlus />
                        </span>
                        <span className="pill-name">Add</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="view">
                        <span className="pill-icon">
                            <IconDesktop />
                        </span>
                        <span className="pill-name">View</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="notifications">
                        <span className="pill-icon">
                            <IconBell />
                        </span>
                        <span className="pill-name">Notifications</span>
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="configuration">
                        <span className="pill-icon">
                            <IconCogs />
                        </span>
                        <span className="pill-name">Configuration</span>
                    </Nav.Link>
                </Nav>
            </div>
        </div>
    );
};
