import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

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
