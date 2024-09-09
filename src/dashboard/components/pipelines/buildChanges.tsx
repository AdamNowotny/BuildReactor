import { ViewConfigContext } from 'common/components/react-types';
import { CIBuild } from 'common/types';
import React, { useContext, useEffect, useState } from 'react';
import './buildChanges.css';

export const BuildChanges = ({ build }: { build: CIBuild }) => {
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
