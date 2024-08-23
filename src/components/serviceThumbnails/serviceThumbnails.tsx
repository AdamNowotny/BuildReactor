import { ServiceTypesContext } from 'components/react-types';
import React, { useContext, useState } from 'react';
import './serviceThumbnails.css';

export default ({
    selected,
    prefix = '/src/',
    onSelect,
}: {
    selected?: string;
    prefix?: string;
    onSelect?: (string) => void;
}) => {
    const serviceTypes = useContext(ServiceTypesContext);
    const [selectedItem, setSelectedItem] = useState(selected);

    const handleClick = (typeName: string) => {
        setSelectedItem(typeName);
        if (onSelect) onSelect(typeName);
    };

    return (
        <div className="thumbnails">
            {serviceTypes.map(serviceType => (
                <a
                    key={serviceType.baseUrl}
                    className={`thumbnail ${
                        serviceType.baseUrl === selectedItem ? 'active' : ''
                    }`}
                    onClick={() => {
                        handleClick(serviceType.baseUrl);
                    }}
                >
                    <div className="thumbnail-image">
                        <img
                            src={`${prefix}${serviceType.logo}`}
                            alt={serviceType.typeName}
                        />
                    </div>
                    <div className="caption">{serviceType.typeName}</div>
                </a>
            ))}
        </div>
    );
};