import { ViewConfigContext } from 'dashboard/types';
import React, { useContext } from 'react';
import { Col, ControlLabel, FormControl, FormGroup, Nav, NavItem } from 'react-bootstrap';

const FormField = ({
    children,
    label,
    disabled,
}: {
    children: React.JSX.Element;
    label: string;
    disabled?: boolean;
}) => {
    return (
        <FormGroup className={disabled ? 'text-muted' : ''}>
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
    disabled,
}: {
    label: string;
    onSelect: (value: string) => void;
    items: Record<string, string>;
    activeItem?: string;
    disabled?: boolean;
}) => {
    return (
        <FormField label={label} disabled={disabled}>
            <Nav bsStyle="pills" activeKey={activeItem} onSelect={onSelect}>
                {Object.entries(items).map(([key, value]) => (
                    <NavItem key={key} eventKey={key} disabled={disabled}>
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
    disabled,
}: {
    label: string;
    onSelect: (value: boolean) => void;
    items?: Record<string, string>;
    activeItem?: boolean;
    disabled?: boolean;
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
            disabled={disabled}
        />
    );
};

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
            <FormControl
                type="number"
                defaultValue={viewConfig.columns}
                onChange={onChangeHandler}
            />
        </FormField>
    );
};
