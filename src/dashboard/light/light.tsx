import React from 'react';
import Pipelines from 'dashboard/components/pipelines/pipelines';
import { ThemeProps } from 'dashboard/theme-types';
import Navbar from '../components/navbar/navbar';
import './light.css';

export default ({ popup }: ThemeProps) => {
    return (
        <>
            {popup && <Navbar />}
            <Pipelines />
        </>
    );
};
