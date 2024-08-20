import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './toastAlert.css';

export default ({ text }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
        }, 3000);
        return () => {
            clearInterval(interval);
        };
    });

    return (
        <Alert
            className="alert-message"
            bsStyle="success"
            style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
            <i className="fa fa-check fa-lg"></i> {text}
        </Alert>
    );
};
