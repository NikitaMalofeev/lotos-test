import React from 'react';
import { Drawer, Button, Form, Select, Input, Space, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setExchangeDrawer, setFinalOffer, setLotStatus } from '../../../entities/trading/slice/tradingSlice';
import { RootState } from '../../../app/store/store';

const { Option } = Select;

export const CloseTradeDrawer: React.FC = () => {
    const dispatch = useDispatch();
    const visible = useSelector((state: RootState) => state.tradingRoom.exchangeDrawer.endLot);
    const users = useSelector((state: RootState) => state.tradingRoom.users);

    const [form] = Form.useForm();

    const handleClose = () => {
        dispatch(setExchangeDrawer({ endLot: false }));
    };

    const onFinish = (values: { userId: string; payment: string }) => {
        dispatch(setFinalOffer({ userId: values.userId, payment: values.payment }));
        dispatch(setLotStatus('paused')); // Изменено на 'paused' в соответствии с вашим кодом
        dispatch(setExchangeDrawer({ endLot: false }));
        message.success('Торги успешно завершены');
    };

    return (
        <Drawer
            title="Завершить торги"
            closable={true}
            placement="right"
            onClose={handleClose}
            open={visible}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item
                    name="userId"
                    label="Выберите пользователя"
                    rules={[{ required: true, message: 'Выберите пользователя' }]}
                >
                    <Select placeholder="Выберите пользователя">
                        {users.map((user) => (
                            <Option key={user.id} value={user.id}>
                                {user.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="payment"
                    label="Подтвердите конечную сумму"
                    rules={[{ required: true, message: 'Введите конечную сумму' }]}
                >
                    <Input placeholder="Введите конечную сумму" suffix="руб." />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Сохранить
                        </Button>
                        <Button onClick={handleClose}>Отмена</Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};
