import { ServiceTypesContext } from 'common/components/react-types';
import React, { useContext, useState } from 'react';
import './serviceThumbnails.css';

export default ({
    selected,
    onSelect,
}: {
    selected?: string;
    onSelect?: (string) => void;
}) => {
    const serviceTypes = useContext(ServiceTypesContext);
    const [selectedItem, setSelectedItem] = useState(selected);

    const handleClick = (typeName: string) => {
        setSelectedItem(typeName);
        if (onSelect) onSelect(typeName);
    };

    return (
        <div className="thumbnails ms-2">
            {serviceTypes.map(serviceType => (
                <a
                    key={serviceType.baseUrl}
                    className={`thumbnail text-reset text-decoration-none text-center  ${
                        serviceType.baseUrl === selectedItem ? 'active' : ''
                    }`}
                    onClick={() => {
                        handleClick(serviceType.baseUrl);
                    }}
                >
                    <div className="thumbnail-image">
                        <img src={`/${serviceType.logo}`} alt={serviceType.typeName} />
                    </div>
                    <div className="caption">{serviceType.typeName}</div>
                </a>
            ))}
        </div>
    );
};
