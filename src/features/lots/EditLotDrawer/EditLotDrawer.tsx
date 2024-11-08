import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store/store';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { ILot } from '../../../entities/lots/model/lotsTypes';
import { editLotAsync } from '../../../entities/lots/slice/lotsSlice';

interface EditLotDrawerProps {
    visible: boolean;
    onClose: () => void;
}

const EditLotDrawer: React.FC<EditLotDrawerProps> = ({ visible, onClose }) => {
    const dispatch: AppDispatch = useDispatch();
    const selectedLot = useSelector((state: RootState) => state.lots.selectedLot);
    const [form] = Form.useForm();

    useEffect(() => {
        if (selectedLot) {
            form.setFieldsValue(selectedLot);
        }
    }, [selectedLot, form]);

    const handleEditSubmit = async (values: Partial<ILot>) => {
        if (selectedLot) {
            await dispatch(editLotAsync({ id: selectedLot.id, updatedLot: values })).unwrap();
            onClose();
        }
    };

    return (
        <Drawer
            title="Edit Lot"
            placement="right"
            open={visible}
            onClose={onClose}
        >
            <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
                <Form.Item name="name" label="Name">
                    <Input />
                </Form.Item>
                <Form.Item name="term" label="Term">
                    <Input />
                </Form.Item>
                <Form.Item name="payment" label="Payment">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default EditLotDrawer;
