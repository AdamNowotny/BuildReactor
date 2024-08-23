import ServiceNamePanel from 'components/serviceNamePanel/serviceNamePanel';
import ServiceThumbnails from 'components/serviceThumbnails/serviceThumbnails';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default ({
    onChange,
    prefix,
}: {
    onChange?: (serviceTypeId: string, serviceName: string) => void;
    prefix?: string;
}) => {
    const [serviceTypeId, setServiceTypeId] = useState<string>('');

    const handleTypeSelected = (typeName: string) => {
        setServiceTypeId(typeName);
    };
    const handleNameChange = (name: string) => {
        if (!serviceTypeId) throw new Error('Service type undefined');
        if (onChange) {
            onChange(serviceTypeId, name);
        } else {
            const navigate = useNavigate();
            navigate(`/new/${serviceTypeId}/${name}`);
        }
    };
    return (
        <>
            <ServiceThumbnails onSelect={handleTypeSelected} prefix={prefix} />
            <ServiceNamePanel
                active={Boolean(serviceTypeId)}
                onChange={handleNameChange}
            />
        </>
    );
};
