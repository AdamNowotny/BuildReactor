import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './navbar.css';

export default ({ dark = false }) => {
    const navBarClass = dark ? 'navbar-inverse' : 'navbar-default';
    const settingsTooltip = <Tooltip id="settings-tooltip">Settings</Tooltip>;
    const dashboardTooltip = <Tooltip id="dashboard-tooltip">Dashboard</Tooltip>;
    return (
        <div className={`navbar navbar-fixed-top ${navBarClass}`} role="navigation">
            <ul className="nav navbar-nav navbar-right">
                <li>
                    <OverlayTrigger placement="bottom" overlay={settingsTooltip}>
                        <a href="../../settings.html" target="_blank">
                            <i className="fa fa-gear fa-2x"></i>
                        </a>
                    </OverlayTrigger>
                </li>
                <li>
                    <OverlayTrigger placement="bottom" overlay={dashboardTooltip}>
                        <a href="dashboard.html" target="_blank">
                            <i className="fa fa-tasks fa-2x"></i>
                        </a>
                    </OverlayTrigger>
                </li>
            </ul>
        </div>
    );
};
