import React from 'react';
import { Theme, ThemeProps } from 'themes/theme-types';
import NavBar from '../components/navbar';
import './light.css';
import Pipelines from 'themes/components/pipelines/pipelines';

const Popup: React.FC<ThemeProps> = ({ config, services }) => {
    return (
        <>
            <NavBar />
            <Pipelines config={config} services={services} />
        </>
    );
};

const Dashboard = ({ config, services }) => (
    <Pipelines config={config} services={services} />
);

export default {
    getDefinition: () => ({
        name: 'light',
        defaultViewSettings: {
            columns: 2,
            fullWidthGroups: true,
        },
    }),
    Popup,
    Dashboard,
} as Theme;
