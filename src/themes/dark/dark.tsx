import React from 'react';
import Navbar from 'themes/components/navbar/navbar';
import Pipelines from 'themes/components/pipelines/pipelines';
import { ThemeProps } from 'themes/theme-types';
import './dark.css';

export default ({ popup }: ThemeProps) => {
    return (
        <>
            {popup && <Navbar dark />}
            <Pipelines />
        </>
    );
};
