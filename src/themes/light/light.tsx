import React from 'react';
import Pipelines from 'themes/components/pipelines/pipelines';
import { Theme } from 'themes/theme-types';
import Navbar from '../components/navbar/navbar';
import './light.css';

const Dashboard = ({ popup }: { popup: boolean }) => {
    return (
        <>
            {popup && <Navbar />}
            <Pipelines />
        </>
    );
};

export default {
    getDefinition: () => ({
        name: 'light',
        defaultViewSettings: {
            columns: 2,
            fullWidthGroups: true,
        },
    }),
    Dashboard,
} as Theme;
