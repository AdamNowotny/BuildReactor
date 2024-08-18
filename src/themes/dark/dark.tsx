import React from 'react';
import Navbar from 'themes/components/navbar/navbar';
import Pipelines from 'themes/components/pipelines/pipelines';
import { Theme } from 'themes/theme-types';
import './dark.css';

const Dashboard = ({ popup }: { popup: boolean }) => {
    return (
        <>
            {popup && <Navbar dark />}
            <Pipelines />
        </>
    );
};

export default {
    getDefinition: () => ({
        name: 'dark',
        defaultViewSettings: {
            columns: 2,
            fullWidthGroups: true,
        },
    }),
    Dashboard,
} as Theme;
