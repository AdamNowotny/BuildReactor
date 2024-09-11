import React from 'react';
import { Form } from 'react-bootstrap';
import IconTimes from '~icons/fa/times-circle-o';
import './filterQuery.css';

export default ({ text, onUpdate }: { text?: string; onUpdate: (string) => void }) => {
    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onUpdate('');
        }
    };
    const handleChange = e => {
        const value = e.target.value;
        onUpdate(value);
    };

    return (
        <div className="filter-query mb-2">
            <Form.Control
                className="search-query"
                value={text}
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {text && (
                <IconTimes
                    className="reset-icon"
                    onClick={() => {
                        onUpdate('');
                    }}
                />
            )}
        </div>
    );
};
