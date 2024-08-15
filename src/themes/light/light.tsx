import React from 'react';
import { Theme, ThemeProps } from 'themes/theme-types';
import NavBar from '../components/navbar';
import './light.css';
import Pipelines from 'themes/components/pipelines/pipelines';

const Popup: React.FC<ThemeProps> = ({ viewConfig, serviceStates }: ThemeProps) => {
    return (
        <>
            <NavBar />
            <Pipelines viewConfig={viewConfig} serviceStates={serviceStates} />
        </>
    );
};

const Dashboard = ({ viewConfig, serviceStates }) => (
    <Pipelines viewConfig={viewConfig} serviceStates={serviceStates} />
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
