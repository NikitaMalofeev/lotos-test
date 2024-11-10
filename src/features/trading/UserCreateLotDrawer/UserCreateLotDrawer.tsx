// UserLotDrawer.tsx

import React from 'react';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { useDispatch } from 'react-redux';
import { updateUserLot } from '../../../entities/trading/slice/tradingSlice';

interface UserLotDrawerProps {
    visible: boolean;
    onClose: () => void;
    userId: string;
}

export const UserCreateLotDrawer: React.FC<UserLotDrawerProps> = ({ visible, onClose, userId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            const lotData = {
                ...values,
                lastPrice: values.payment,
            };

            dispatch(updateUserLot({ userId, lotData }));
            onClose();
        } catch (err) {
            console.error('Error saving user lot data or validation failed:', err);
        }
    };

    return (
        <Drawer
            title="Enter Lot Data"
            closable={false}
            placement="right"
            open={visible}
            onClose={onClose}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Company"
                    name="company"
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
                        <Button type="primary" onClick={handleSave}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

