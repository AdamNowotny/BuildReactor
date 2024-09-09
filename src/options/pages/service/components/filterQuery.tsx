import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import IconTimes from '~icons/fa/times-circle-o';
import './filterQuery.css';

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
                <IconTimes
                    className="reset-icon"
                    onClick={() => {
                        updateQuery('');
                    }}
                />
            )}
        </div>
    );
};
