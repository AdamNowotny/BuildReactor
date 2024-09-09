import { CIBuild } from 'common/types';
import React from 'react';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './buildLabels.css';

export const BuildLabels = ({ build }: { build: CIBuild }) => {
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
