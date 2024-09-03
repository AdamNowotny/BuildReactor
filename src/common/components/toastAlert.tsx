import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './toastAlert.css';

export default ({ text }: { text: string }) => {
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
        <div
            className="alert-message"
            style={{ visibility: isVisible ? 'visible' : 'hidden' }}
        >
            <Alert variant="success">
                <i className="fa fa-check fa-lg"></i> {text}
            </Alert>
        </div>
    );
};