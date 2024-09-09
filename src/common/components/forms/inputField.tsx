import React, { ReactNode } from 'react';
import { Form, InputGroup } from 'react-bootstrap';

export const FormInputField = ({
    disabled,
    text,
    iconSvg,
    onChange,
    placeholder,
    type = 'text',
}: {
    disabled?: boolean;
    text: string;
    iconSvg?: ReactNode;
    onChange: (value: string) => void;
    placeholder?: string;
    type: 'text' | 'url' | 'password';
}) => {
    return (
        <>
            <Form.Group>
                <InputGroup className="mb-3">
                    {iconSvg && (
                        <InputGroup.Text style={{ fontSize: '0.8em' }}>
                            {iconSvg}
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
