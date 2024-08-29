import React from 'react';
import './onOffSwitch.css';

export default ({ active, onClick }: { active: boolean; onClick: (boolean) => void }) => {
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
                    onClick={() => {
                        onClick(false);
                    }}
                />
                <input
                    type="radio"
                    name="toggle"
                    value="on"
                    checked={active}
                    onClick={() => {
                        onClick(true);
                    }}
                />
                <span className={`switch ${onOffState}`}></span>
            </div>
        </>
    );
};
