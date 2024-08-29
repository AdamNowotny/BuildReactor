import React, { useContext } from 'react';
import { Button, Col, Form, InputGroup, Nav, Row } from 'react-bootstrap';
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
        <Form.Group as={Row} className={`mb-1 ${disabled ? 'text-muted' : ''}`}>
            <Form.Label column sm="7">
                {label}
            </Form.Label>
            <Col sm="5">{children}</Col>
        </Form.Group>
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
            <Form.Group>
                <Row className="text-center">
                    <Col />
                    <Col sm="auto">
                        <Button onClick={onClick} variant={style} disabled={disabled}>
                            {icon && <i className={`fa fa-${icon}`}></i>} {text}
                        </Button>
                    </Col>
                    <Col />
                </Row>
            </Form.Group>
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
            <Form.Group>
                <InputGroup className="mb-3">
                    {icon && (
                        <InputGroup.Text>
                            <i className={`fa fa-${icon}`}></i>
                        </InputGroup.Text>
                    )}
                    <Form.Control
                        disabled={disabled}
                        type={type}
                        defaultValue={text}
                        onChange={e => {
                            onChange(e.target.value);
                        }}
                        placeholder={placeholder}
                    />
                </InputGroup>
            </Form.Group>
        </>
    );
};
