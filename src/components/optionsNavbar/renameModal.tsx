import React, { useState } from 'react';
import {
    Modal,
    Button,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
} from 'react-bootstrap';

export default ({ serviceName, show, onRename, onCancel }) => {
    const [newServiceName, setNewServiceName] = useState(serviceName);

    const handleRename = () => {
        onRename(newServiceName);
    };
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4 className="modal-title">
                        <span className="fa fa-pencil"></span> Rename
                    </h4>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <FormGroup>
                        <ControlLabel>New name:</ControlLabel>
                        <FormControl
                            type="text"
                            defaultValue={serviceName}
                            onChange={e => {
                                setNewServiceName(e?.target?.value);
                            }}
                        />
                    </FormGroup>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button bsStyle="primary" onClick={handleRename}>
                    OK
                </Button>
                <Button onClick={onCancel}>Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
};
