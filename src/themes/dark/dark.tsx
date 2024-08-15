import React from 'react';
import Navbar from 'themes/components/navbar';
import { Theme, ThemeProps } from 'themes/theme-types';
import './dark.css';
import Pipelines from 'themes/components/pipelines/pipelines';

const Popup: React.FC<ThemeProps> = ({ config, services }) => {
    return (
        <>
            <Navbar dark />
            <Pipelines config={config} services={services} />
        </>
    );
};

const Dashboard = ({ config, services }) => (
    <Pipelines config={config} services={services} />
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
