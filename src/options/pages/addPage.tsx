import ServiceNamePanel from 'components/serviceNamePanel/serviceNamePanel';
import ServiceThumbnails from 'components/serviceThumbnails/serviceThumbnails';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default ({
    onChange,
}: {
    onChange?: (serviceTypeId: string, serviceName: string) => void;
}) => {
    const navigate = useNavigate();
    const [serviceTypeId, setServiceTypeId] = useState<string>('');

    const handleTypeSelected = (typeName: string) => {
        setServiceTypeId(typeName);
    };
    const handleNameChange = (name: string) => {
        if (!serviceTypeId) throw new Error('Service type undefined');
        if (onChange) {
            onChange(serviceTypeId, name);
        } else {
            navigate(`/new/${serviceTypeId}/${name}`);
        }
    };
    return (
        <>
            <ServiceThumbnails onSelect={handleTypeSelected} />
            <ServiceNamePanel
                active={Boolean(serviceTypeId)}
                onChange={handleNameChange}
            />
        </>
    );
};
