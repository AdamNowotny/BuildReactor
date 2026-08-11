import { ViewConfigContext } from 'common/components/react-types';
import { CIBuild } from 'common/types';
import React, { useContext, useEffect, useState } from 'react';
import './buildAge.css';

const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

export const formatAge = (startedAt: string, now: number) => {
    const elapsedSeconds = Math.max(0, Math.floor((now - Date.parse(startedAt)) / 1000));
    if (elapsedSeconds < MINUTE) return 'just now';

    const [value, unit] =
        elapsedSeconds < HOUR
              ? [Math.floor(elapsedSeconds / MINUTE), 'minute']
              : elapsedSeconds < DAY
                ? [Math.floor(elapsedSeconds / HOUR), 'hour']
                : elapsedSeconds < MONTH
                  ? [Math.round(elapsedSeconds / DAY), 'day']
                  : elapsedSeconds < YEAR
                    ? [Math.round(elapsedSeconds / MONTH), 'month']
                    : [Math.floor(elapsedSeconds / YEAR), 'year'];
    const relativeTime = new Intl.RelativeTimeFormat(undefined, { numeric: 'always' });
    return relativeTime.format(-value, unit as Intl.RelativeTimeFormatUnit);
};

export const BuildAge = ({ build }: { build: CIBuild }) => {
    const viewConfig = useContext(ViewConfigContext);
    const [now, setNow] = useState(Date.now());
    const startedAt = build.startedAt;
    const isVisible = (viewConfig.showBuildAge ?? true) && !build.isRunning && !build.isWaiting;
    const hasValidTimestamp = startedAt && !Number.isNaN(Date.parse(startedAt));

    useEffect(() => {
        if (!isVisible || !hasValidTimestamp) return;
        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 60_000);
        return () => {
            window.clearInterval(interval);
        };
    }, [hasValidTimestamp, isVisible]);

    return (
        <small className={`build-age ${isVisible && hasValidTimestamp ? 'visible' : ''}`}>
            {hasValidTimestamp ? formatAge(startedAt, now) : null}
        </small>
    );
};
