import React from 'react';
import Navbar from 'themes/components/navbar/navbar';
import Pipelines from 'themes/components/pipelines/pipelines';
import { Theme, ThemeProps } from 'themes/theme-types';
import './dark.css';

const Popup: React.FC<ThemeProps> = ({ viewConfig, serviceStates }: ThemeProps) => {
    return (
        <>
            <Navbar dark />
            <Pipelines viewConfig={viewConfig} serviceStates={serviceStates} />
        </>
    );
};

const Dashboard = ({ viewConfig, serviceStates }) => (
    <Pipelines viewConfig={viewConfig} serviceStates={serviceStates} />
);

export default {
    getDefinition: () => ({
        name: 'dark',
        defaultViewSettings: {
            columns: 2,
            fullWidthGroups: true,
        },
    }),
    Popup,
    Dashboard,
} as Theme;
