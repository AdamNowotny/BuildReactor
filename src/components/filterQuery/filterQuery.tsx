import React, { useState } from 'react';
import './filterQuery.css';
import { Form } from 'react-bootstrap';

export default ({ onUpdate }: { onUpdate: (string) => void }) => {
    const [query, setQuery] = useState('');
    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setQuery('');
            onUpdate('');
        }
    };
    const handleChange = e => {
        const value = e.target.value;
        setQuery(value);
        onUpdate(value);
    };

    return (
        <div className="filter-query mb-2">
            <Form.Control
                className="search-query"
                value={query}
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {query && (
                <i
                    className="reset-icon fa fa-times-circle-o fa-2x"
                    onClick={() => {
                        setQuery('');
                    }}
                ></i>
            )}
        </div>
    );
};
