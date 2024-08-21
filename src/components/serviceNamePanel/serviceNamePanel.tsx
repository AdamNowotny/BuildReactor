import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import './serviceNamePanel.css';

export default ({
    active,
    onChange,
}: {
    active: boolean;
    onChange: (string) => void;
}) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (active) (inputRef.current as any).focus();
    });

    const handleChange = e => {
        setValue(e.target.value);
    };
    const handleClick = e => {
        onChange(value);
        e.preventDefault();
    };
    return (
        <div className="panel-footer">
            <form
                className="service-add-form form-inline"
                onSubmit={handleClick}
                ng-submit="add()"
            >
                <div className="form-actions">
                    <div className="form-group">
                        <input
                            type="text"
                            autoFocus={active}
                            className="form-control"
                            placeholder="Name"
                            disabled={!active}
                            onChange={handleChange}
                            ref={inputRef}
                        />
                    </div>
                    <div className="form-group">
                        <Button
                            bsStyle="primary"
                            onClick={handleClick}
                            disabled={!active}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
