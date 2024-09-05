import React from 'react';
import './onOffSwitch.css';

export default ({
    active,
    onChange,
}: {
    active: boolean;
    onChange: (boolean) => void;
}) => {
    const onOffState = active ? 'on' : 'off';
    return (
        <>
            <div className={`toggle-bg toggle-alternate ${onOffState}`}>
                <label className={onOffState}>{onOffState}</label>
                <input
                    type="radio"
                    name="toggle"
                    value="off"
                    checked={!active}
                    onChange={() => {
                        onChange(false);
                    }}
                />
                <input
                    type="radio"
                    name="toggle"
                    value="on"
                    checked={active}
                    onChange={() => {
                        onChange(true);
                    }}
                />
                <span className={`switch ${onOffState}`}></span>
            </div>
        </>
    );
};
