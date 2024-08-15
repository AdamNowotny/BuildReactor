import React from 'react';
import './navbar.css';

export default ({ dark = false }) => {
    const navBarClass = dark ? 'navbar-inverse' : 'navbar-default';
    return (
        <div className={`navbar navbar-fixed-top ${navBarClass}`} role="navigation">
            <ul>
                <li>
                    <a
                        href="../../settings.html"
                        target="_blank"
                        uib-tooltip="Settings"
                        tooltip-placement="bottom"
                    >
                        <i className="fa fa-gear fa-2x"></i>
                    </a>
                </li>
                <li>
                    <a
                        href="dashboard.html"
                        target="_blank"
                        uib-tooltip="Dashboard"
                        tooltip-placement="bottom"
                    >
                        <i className="fa fa-tasks fa-2x"></i>
                    </a>
                </li>
            </ul>
        </div>
    );
};
