import { ServiceContext } from 'components/react-types';
import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
    const service = useContext(ServiceContext);
    if (!service) {
        const { serviceTypeId, serviceId } = useParams();
        console.log('service', service, serviceId, serviceTypeId);
    }

    return (
        <>
            <h1>NAME: {service?.name}</h1>
        </>
    );
};
