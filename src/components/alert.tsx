import React from 'react';
import { Alert } from 'react-bootstrap';

export default ({ text }: { text: string | null }) => {
    return text && <Alert bsStyle="danger">{text}</Alert>;
};
