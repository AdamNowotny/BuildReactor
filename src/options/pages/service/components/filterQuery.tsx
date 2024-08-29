import React, { useState } from 'react';
import './filterQuery.css';
import { Form } from 'react-bootstrap';

export default ({ onUpdate }: { onUpdate: (string) => void }) => {
    const [query, setQuery] = useState('');

    const updateQuery = value => {
        setQuery(value);
        onUpdate(value);
    };

    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            updateQuery('');
        }
    };
    const handleChange = e => {
        const value = e.target.value;
        updateQuery(value);
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
                        updateQuery('');
                    }}
                ></i>
            )}
        </div>
    );
};
