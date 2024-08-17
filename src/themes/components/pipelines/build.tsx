import React from 'react';
import { CIBuild, ConfigStorageItem } from 'services/service-types';
import './build.css';

const Changes = ({
    build,
    viewConfig,
}: {
    build: CIBuild;
    viewConfig: ConfigStorageItem;
}) => {
    if (!viewConfig.showCommits) return;
    const changeIndex = 0; //todo
    const commitsVisible =
        viewConfig.showCommitsWhenGreen ??
        build.isBroken ??
        build.isRunning ??
        build.isWaiting;
    return (
        <div className={`changes-container ${commitsVisible ? 'visible' : ''}`}>
            {build.changes?.map((change, index) => (
                <div key={index}>
                    <span
                        className={`changes ${index === changeIndex ? 'active' : ''}`}
                        title={`${change.name}: ${change.message ?? ''}`}
                    >
                        <span className="change-name">{change.name}</span>
                        {change.message && (
                            <span className="change-message">: {change.message}</span>
                        )}
                    </span>
                </div>
            ))}
        </div>
    );
};

const Build = ({
    build,
    width,
    viewConfig,
}: {
    build: CIBuild;
    width: number;
    viewConfig: ConfigStorageItem;
}) => {
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
                    <span className="build-name">{build.name}</span>
                    <Changes viewConfig={viewConfig} build={build} />
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
