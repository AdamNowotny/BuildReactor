import Pipelines from 'dashboard/components/pipelines/pipelines';
import Navbar from 'dashboard/components/popupNavbar';
import { ThemeProps } from 'components/react-types';
import React from 'react';
import './light.css';

export default ({ popup }: ThemeProps) => {
    return (
        <>
            {popup && <Navbar />}
            <Pipelines />
        </>
    );
};
