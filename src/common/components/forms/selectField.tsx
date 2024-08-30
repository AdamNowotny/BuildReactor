import React from 'react';
import { Nav } from 'react-bootstrap';
import { FormField } from './field';
import './selectField.css';

export const FormSelectField = ({
    label,
    onSelect,
    items,
    activeItem,
    disabled,
}: {
    label: string;
    onSelect: (value: string | null) => void;
    items: Record<string, string>;
    activeItem?: string;
    disabled?: boolean;
}) => {
    return (
        <FormField label={label} disabled={disabled}>
            <Nav justify variant="pills" activeKey={activeItem} onSelect={onSelect}>
                {Object.entries(items).map(([key, value]) => (
                    <Nav.Item key={key} className="me-1">
                        <Nav.Link eventKey={key} disabled={disabled}>
                            {value}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>
        </FormField>
    );
};
