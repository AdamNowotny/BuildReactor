import React from 'react';
import Pipelines from 'themes/components/pipelines/pipelines';
import { ThemeProps } from 'themes/theme-types';
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
