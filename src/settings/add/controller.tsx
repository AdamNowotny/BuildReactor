import PageContext from 'components/pageContext';
import React from 'react';
import { createRoot } from 'react-dom/client';
import app from 'settings/app';
import AddPage from 'options/pages/addPage';

export default app.controller(
    'AddServiceCtrl',
    // eslint-disable-next-line prefer-arrow-callback
    function ($scope, $routeParams, $location) {
        const handleChange = (typeId: string, serviceName) => {
            $scope.$evalAsync(() => {
                $location.path(`/new/${typeId}/${serviceName}`);
            });
        };

        const view = document.getElementById('add-page');
        if (view) {
            createRoot(view).render(
                <PageContext>
                    <AddPage onChange={handleChange} prefix="" />
                </PageContext>,
            );
        }
    },
);
