import { CIBuild } from 'common/types';
import React, { useContext, useEffect, useState } from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ViewConfigContext } from '../../../components/react-types';
import './build.css';

const Changes = ({ build }: { build: CIBuild }) => {
    const viewConfig = useContext(ViewConfigContext);
    if (!viewConfig.showCommits) return;
    const [changeIndex, setChangeIndex] = useState(0);
    const changesLength = build.changes?.length ?? 0;
    if (changesLength > 1) {
        useEffect(() => {
            const interval = setInterval(() => {
                setChangeIndex((changeIndex + 1) % changesLength);
            }, 7000);
            return () => {
                clearInterval(interval);
            };
        });
    }
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

const Labels = ({ build }: { build: CIBuild }) => {
    return (
        <span className="labels pull-right">
            {build.error && (
                <Badge bg="dark">
                    Offline
                    <span className="error-message">({build.error.message})</span>
                </Badge>
            )}
            {build.isDisabled && <Badge bg="secondary">Disabled</Badge>}
            {build.tags?.map(tag => {
                const bgColor = tag.type === 'warning' ? 'warning' : 'secondary';
                const textColor = tag.type === 'warning' ? 'dark' : '';
                const badge = (
                    <Badge bg={bgColor} text={textColor}>
                        {tag.name}
                    </Badge>
                );
                return tag.description ? (
                    <OverlayTrigger
                        key={tag.name}
                        overlay={<Tooltip id="label-tooltip">{tag.description}</Tooltip>}
                    >
                        {badge}
                    </OverlayTrigger>
                ) : (
                    badge
                );
            })}
        </span>
    );
};

const Build = ({ build, width }: { build: CIBuild; width: number }) => {
    return (
        <div
            key={build.id}
            style={{ width: `${width}%` }}
            className={`build ${build.isBroken ? 'broken' : ''} ${
                build.isDisabled ? 'disabled' : ''
            } ${build.isRunning ? 'building' : ''} ${build.error ? 'offline' : ''}`}
        >
            <div className="progress">
                <a
                    href={build.webUrl}
                    target={build.webUrl ? '_blank' : '_self'}
                    className={`progress-bar ${
                        build.isRunning && !build.isWaiting
                            ? 'progress-bar-striped progress-bar-animated'
                            : ''
                    } ${build.isWaiting ? 'progress-bar-striped' : ''}`}
                    rel="noreferrer"
                >
                    <div className="build-content">
                        <Labels build={build} />
                        <span className="build-name">{build.name}</span>
                        <Changes build={build} />
                    </div>
                    <div className="color-blind-markers">
                        <i className="color-blind-marker-broken fa fa-bolt fa-2x fa-inverse"></i>
                        <i className="color-blind-marker-offline fa fa-exclamation-triangle fa-2x fa-inverse"></i>
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Build;
