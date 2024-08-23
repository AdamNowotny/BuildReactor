import ServiceNamePanel from 'components/serviceNamePanel/serviceNamePanel';
import ServiceThumbnails from 'components/serviceThumbnails/serviceThumbnails';
import React, { useState } from 'react';

export default ({
    onChange,
}: {
    onChange?: (serviceTypeId: string, serviceName: string) => void;
}) => {
    const [selected, setSelected] = useState<string>('');

    const handleSelected = (typeName: string) => {
        setSelected(typeName);
    };
    const handleNameChange = (name: string) => {
        if (!selected) return;
        if (onChange) onChange(selected, name);
    };
    return (
        <>
            <ServiceThumbnails onSelect={handleSelected} />
            <ServiceNamePanel active={Boolean(selected)} onChange={handleNameChange} />
        </>
    );
};
