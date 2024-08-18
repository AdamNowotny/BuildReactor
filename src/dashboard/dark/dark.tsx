import React from 'react';
import Navbar from 'dashboard/components/navbar/navbar';
import Pipelines from 'dashboard/components/pipelines/pipelines';
import { ThemeProps } from 'dashboard/theme-types';
import './dark.css';

export default ({ popup }: ThemeProps) => {
    return (
        <>
            {popup && <Navbar dark />}
            <Pipelines />
        </>
    );
};
