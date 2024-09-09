import { CIBuild } from 'common/types';
import React from 'react';
import IconBolt from '~icons/fa/bolt';
import IconWarning from '~icons/fa/exclamation-triangle';
import './build.css';
import { BuildChanges } from './buildChanges';
import { BuildLabels } from './buildLabels';

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
                        <BuildLabels build={build} />
                        <span className="build-name">{build.name}</span>
                        <BuildChanges build={build} />
                    </div>
                    <div className="color-blind-markers">
                        <IconBolt className="color-blind-marker-broken" />
                        <IconWarning className="color-blind-marker-offline" />
                    </div>
                </a>
            </div>
        </div>
    );
};

export default Build;
