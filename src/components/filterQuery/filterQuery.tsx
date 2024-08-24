import React, { useState } from 'react';
import './filterQuery.css';

export default ({ onUpdate }: { onUpdate: (string) => void }) => {
    const [query, setQuery] = useState('');
    const handleKeyUp = e => {
        const value = e.key === 'Escape' ? '' : e.target.value;
        setQuery(value);
        onUpdate(value);
    };

    return (
        <div className="filter-query">
            <input
                defaultValue={query}
                className="search-query form-control"
                type="text"
                placeholder="Search..."
                onKeyUp={handleKeyUp}
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
