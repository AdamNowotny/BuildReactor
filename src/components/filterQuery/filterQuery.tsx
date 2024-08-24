import React, { useState } from 'react';
import './filterQuery.css';

export default ({ onUpdate }: { onUpdate: (string) => void }) => {
    const [query, setQuery] = useState('');
    const handleKeyDown = e => {
        if (e.key === 'Escape') {
            e.preventDefault();
            setQuery('');
        }
    };
    const handleChange = e => {
        const value = e.target.value;
        setQuery(value);
        onUpdate(value);
    };

    return (
        <div className="filter-query">
            <input
                value={query}
                className="search-query form-control"
                type="text"
                placeholder="Search..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
            />
            {query && (
                <i
                    className="fa fa-times-circle-o fa-2x"
                    onClick={() => {
                        setQuery('');
                    }}
                ></i>
            )}
        </div>
    );
};
