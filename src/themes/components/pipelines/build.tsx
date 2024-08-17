import React from 'react';
import { CIBuild } from 'services/service-types';
import './build.css';

const Build = ({ build, width }: { build: CIBuild; width: number }) => {
    return (
        <div
            key={build.id}
            style={{ width: `${width}%` }}
            className={`build ${build.isBroken ? 'broken' : ''} ${
                build.isDisabled ? 'disabled' : ''
            } ${build.isRunning ? 'building' : ''} ${build.error ? 'offline' : ''}`}
        >
            <a
                href={build.webUrl}
                target={build.webUrl ? '_blank' : '_self'}
                className={`progress-bar ${build.isRunning ? 'active' : ''} ${
                    build.isRunning ?? build.isWaiting ? 'progress-bar-striped' : ''
                }`}
            >
                <div className="build-content">
                    <span className="build-name">
                        {classes}/{build.name}
                    </span>
                </div>
                <div className="color-blind-markers">
                    <i className="color-blind-marker-broken fa fa-bolt fa-2x fa-inverse"></i>
                    <i className="color-blind-marker-offline fa fa-exclamation-triangle fa-2x fa-inverse"></i>
                </div>
            </a>
        </div>
    );
};

export default Build;
