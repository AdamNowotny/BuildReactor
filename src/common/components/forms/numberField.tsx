import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import { FormField } from './field';
import { ViewConfigContext } from '../react-types';

export const FormNumberField = ({
    label,
    onChange,
    min,
    max,
    disabled,
}: {
    label: string;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}) => {
    const viewConfig = useContext(ViewConfigContext);
    const onChangeHandler = e => {
        let value = e.target.value;
        if (min && value < min) value = min;
        if (max && value > max) value = max;
        onChange(parseInt(value));
    };
    return (
        <FormField label={label} disabled={disabled}>
            <Form.Control
                type="number"
                defaultValue={viewConfig.columns}
                onChange={onChangeHandler}
            />
        </FormField>
    );
};
