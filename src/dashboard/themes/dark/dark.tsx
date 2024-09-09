import { ThemeProps } from 'common/components/react-types';
import { Pipelines } from 'dashboard/components/pipelines';
import Navbar from 'dashboard/components/popupNavbar';
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
