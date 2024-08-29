import Pipelines from 'dashboard/components/pipelines/pipelines';
import Navbar from 'dashboard/components/popupNavbar';
import { ThemeProps } from 'common/components/react-types';
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
