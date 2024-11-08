import React, { useState } from 'react';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { createLotAsync } from '../../../entities/lots/slice/lotsSlice';

interface CreateLotDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const CreateLotDrawer: React.FC<CreateLotDrawerProps> = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const handleCreateLot = async () => {
        try {
            const values = await form.validateFields();
            const newLot = {
                name: values.name,
                term: values.term,
                payment: values.payment,
                startDate: Math.floor(Date.now() / 1000),
            };

            await dispatch(createLotAsync(newLot)).unwrap();
            onClose();
        } catch (err) {
            console.error('Error creating lot or validation failed:', err);
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
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the lot name' }]}
                >
                    <Input placeholder="Enter lot name" />
                </Form.Item>
                <Form.Item
                    label="Term"
                    name="term"
                    rules={[{ required: true, message: 'Please enter the term' }]}
                >
                    <Input placeholder="Enter term" />
                </Form.Item>
                <Form.Item
                    label="Payment"
                    name="payment"
                    rules={[{ required: true, message: 'Please enter the payment' }]}
                >
                    <Input placeholder="Enter payment" />
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
