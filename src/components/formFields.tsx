import React, { useContext } from 'react';
import {
    Col,
    Row,
    ControlLabel,
    FormControl,
    FormGroup,
    Nav,
    NavItem,
    InputGroup,
    Button,
} from 'react-bootstrap';
import { ViewConfigContext } from './react-types';

export const FormField = ({
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

export const FormButtonField = ({
    disabled,
    text,
    icon,
    onClick,
    style = 'success',
}: {
    disabled?: boolean;
    text: string;
    icon?: string;
    onClick: () => void;
    style?: 'success' | 'danger';
}) => {
    return (
        <>
            <FormGroup>
                <Row md={12} className="text-center">
                    <Button onClick={onClick} bsStyle={style} disabled={disabled}>
                        {icon && <i className={`fa fa-${icon}`}></i>} {text}
                    </Button>
                </Row>
            </FormGroup>
        </>
    );
};

export const FormInputField = ({
    disabled,
    text,
    icon,
    onChange,
    placeholder,
    type = 'text',
}: {
    disabled?: boolean;
    text: string;
    icon?: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type: 'text' | 'url' | 'password';
}) => {
    return (
        <>
            <FormGroup>
                <InputGroup disabled={disabled}>
                    {icon && (
                        <InputGroup.Addon>
                            <i className={`fa fa-${icon}`}></i>
                        </InputGroup.Addon>
                    )}
                    <FormControl
                        type={type}
                        defaultValue={text}
                        onChange={e => {
                            onChange(e.target.value);
                        }}
                        placeholder={placeholder}
                    />
                </InputGroup>
            </FormGroup>
        </>
    );
};
