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
                <span className="build-name">{build.name}</span>
            </a>
        </div>
    );
};

export default Build;
