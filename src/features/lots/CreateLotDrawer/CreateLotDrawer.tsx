import React, { useState } from 'react';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { createLotAsync } from '../../../entities/lots/slice/lotsSlice';

interface CreateLotDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const CreateLotDrawer: React.FC<CreateLotDrawerProps> = ({ visible, onClose }) => {
    const [name, setName] = useState('');
    const [term, setTerm] = useState('');
    const [payment, setPayment] = useState('');
    const dispatch = useAppDispatch();

    const handleCreateLot = async () => {
        const newLot = {
            name,
            term,
            payment,
            startDate: Math.floor(Date.now() / 1000), // current timestamp
        };

        try {
            await dispatch(createLotAsync(newLot)).unwrap();
            onClose(); // Close drawer after successful creation
        } catch (err) {
            console.error('Error creating lot:', err);
        }
    };

    return (
        <Drawer
            title="Create New Lot"
            closable={false}
            placement="right"
            open={visible}
            onClose={onClose}
        >
            <Form layout="vertical">
                <Form.Item label="Name">
                    <Input
                        placeholder="Enter lot name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Term">
                    <Input
                        placeholder="Enter term"
                        value={term}
                        onChange={(e) => setTerm(e.target.value)}
                    />
                </Form.Item>
                <Form.Item label="Payment">
                    <Input
                        placeholder="Enter payment"
                        value={payment}
                        onChange={(e) => setPayment(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleCreateLot}>
                            Create Lot
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default CreateLotDrawer;
