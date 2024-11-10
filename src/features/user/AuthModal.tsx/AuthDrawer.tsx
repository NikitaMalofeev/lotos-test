// AuthDrawer.tsx

import React, { useState } from 'react';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import { Button, Drawer, Form, Input, Space } from 'antd';
import { authenticateUserThunk } from '../../../entities/user/thunk/authentificateUserThunk';

export interface AuthDrawerProps {
    visible: boolean;
}

const AuthDrawer: React.FC<AuthDrawerProps> = ({ visible }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();

    const handleLogin = async () => {
        try {
            await dispatch(authenticateUserThunk({ name, password })).unwrap();
        } catch (err) {
        }
    };

    return (
        <Drawer
            title="Authentication"
            closable={false}
            placement='top'
            open={visible}
            width={400}
            style={{ textAlign: 'center' }}
        >
            <Form layout="vertical" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Form.Item label="Name" style={{ width: '100%', maxWidth: '300px' }}>
                    <Input
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item label="Password" style={{ width: '100%', maxWidth: '300px' }}>
                    <Input
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={handleLogin}>
                            Login
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default AuthDrawer;
