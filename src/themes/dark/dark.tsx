import React from 'react';
import Navbar from 'themes/components/navbar/navbar';
import Pipelines from 'themes/components/pipelines/pipelines';
import { Theme, ThemeProps } from 'themes/theme-types';
import './dark.css';

const Popup: React.FC<ThemeProps> = ({ viewConfig }: ThemeProps) => {
    return (
        <>
            <Navbar dark />
            <Pipelines viewConfig={viewConfig} />
        </>
    );
};

const Dashboard = ({ viewConfig }) => <Pipelines viewConfig={viewConfig} />;

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
