import { ViewConfigContext } from 'dashboard/types';
import React, { useContext } from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Nav, NavItem } from 'react-bootstrap';

const FormField = ({ children, label }) => {
    return (
        <FormGroup>
            <Col componentClass={ControlLabel} md={6}>
                {label}
            </Col>
            <Col md={6}>{children}</Col>
        </FormGroup>
    );
};

export const FormSelectField = ({
    label,
    onSelect,
    items,
    activeItem,
}: {
    label: string;
    onSelect: (value: string) => void;
    items: Record<string, string>;
    activeItem?: string;
}) => {
    return (
        <FormField label={label}>
            <Nav bsStyle="pills" activeKey={activeItem} onSelect={onSelect}>
                {Object.entries(items).map(([key, value]) => (
                    <NavItem key={key} eventKey={key}>
                        {value}
                    </NavItem>
                ))}
            </Nav>
        </FormField>
    );
};

export const FormBooleanField = ({
    label,
    onSelect,
    items = { true: 'On', false: 'Off' },
    activeItem,
}: {
    label: string;
    onSelect: (value: boolean) => void;
    items?: Record<string, string>;
    activeItem?: boolean;
}) => {
    const onSelectHandler = (value: string) => {
        onSelect(value === 'true');
    };
    return (
        <FormSelectField
            label={label}
            activeItem={activeItem ? 'true' : 'false'}
            items={items}
            onSelect={onSelectHandler}
        />
    );
};

export const FormNumberField = ({
    label,
    onChange,
    min,
    max,
}: {
    label: string;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}) => {
    const viewConfig = useContext(ViewConfigContext);
    const onChangeHandler = e => {
        let value = e.target.value;
        if (min && value < min) value = min;
        if (max && value > max) value = max;
        onChange(parseInt(value));
    };
    return (
        <FormField label={label}>
            <FormControl
                type="number"
                defaultValue={viewConfig.columns}
                onChange={onChangeHandler}
            />
        </FormField>
    );
};
