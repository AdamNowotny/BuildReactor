import React from 'react';
import Pipelines from 'themes/components/pipelines/pipelines';
import { Theme, ThemeProps } from 'themes/theme-types';
import NavBar from '../components/navbar/navbar';
import './light.css';

const Popup: React.FC<ThemeProps> = ({ viewConfig }: ThemeProps) => {
    return (
        <>
            <NavBar />
            <Pipelines viewConfig={viewConfig} />
        </>
    );
};

const Dashboard = ({ viewConfig }) => <Pipelines viewConfig={viewConfig} />;

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
