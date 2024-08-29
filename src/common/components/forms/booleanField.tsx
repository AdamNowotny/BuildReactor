import React from 'react';
import { FormSelectField } from './selectField';

export const FormBooleanField = ({
    label,
    onSelect,
    items = { true: 'On', false: 'Off' },
    activeItem,
    disabled,
}: {
    label: string;
    onSelect: (value: boolean) => void;
    items?: Record<string, string>;
    activeItem?: boolean;
    disabled?: boolean;
}) => {
    const onSelectHandler = (value: string | null) => {
        onSelect(value === 'true');
    };
    return (
        <FormSelectField
            label={label}
            activeItem={activeItem ? 'true' : 'false'}
            items={items}
            onSelect={onSelectHandler}
            disabled={disabled}
        />
    );
};
