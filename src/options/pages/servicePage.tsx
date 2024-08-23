import { ServiceContext, SettingsContext } from 'components/react-types';
import React, { useContext, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

export default () => {
    const service = useContext(ServiceContext);
    if (!service) {
        const { serviceTypeId, serviceId } = useParams();
        console.log('service', service, serviceId, serviceTypeId);
    }

    const [selected, setSelected] = useState<string>('');

    const handleSelected = (typeName: string) => {
        setSelected(typeName);
    };
    return (
        <>
            <h1>NAME: {service?.name}</h1>
        </>
    );
};
