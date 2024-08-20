import Pipelines from 'components/pipelines/pipelines';
import Navbar from 'components/popupNavbar/popupNavbar';
import { ThemeProps } from 'dashboard/types';
import React from 'react';
import './dark.css';

export default ({ popup }: ThemeProps) => {
    return (
        <>
            {popup && <Navbar dark />}
            <Pipelines />
        </>
    );
};
