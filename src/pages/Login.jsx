import { Button, Form, Input, message, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
// import { JavaOutlined } from '@ant-design/icons';

export default function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();

    const onFinish = async (values) => {
        // 登录逻辑保持不变
        try {
            // 按照提供的格式构建请求
            const data = JSON.stringify({
                adminaccount: values.adminaccout,
                adminpwd: values.adminpwd
            });

            const config = {
                method: 'post',
                url: 'http://1.117.70.79:8090/api/admins/login',
                headers: { 
                    // 移除不安全的头部
                    'Content-Type': 'application/json', 
                    'Accept': '*/*'
                },
                data: data
            };

            const response = await axios(config);
            console.log('登录响应:', JSON.stringify(response.data),'token\n',JSON.stringify(response.data.data.token));
            // console.log(JSON.stringify(response.data.data.token))
            
            // 处理登录成功
            if (response.data) {
                localStorage.setItem('admin_token', response.data.data.token);
                message.success('登录成功');
                alert('登陆成功')
                navigate('/dashboard');
            } else {
                message.error('登录失败: 服务器返回数据格式不正确');
            }
        } catch (error) {
            console.log(error);
            message.error('登录失败: ' + (error.response?.data?.message || '未知错误'));
        }
    };

    // 添加注册功能
    const onRegister = async (values) => {
        try {
            // 移除确认密码字段，因为后端不需要
            const { ...registerData } = values;
            
            const data = JSON.stringify(registerData);

            console.log(data);
            

            const config = {
                method: 'post',
                url: 'http://1.117.70.79:8090/api/admins/register',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Accept': '*/*'
                },
                data: data
            };

            const response = await axios(config);
            console.log('注册响应:', JSON.stringify(response.data));
            
            if (response.data && response.data.code === 200) {
                message.success('注册成功，请登录');
                setActiveTab('login');
                registerForm.resetFields();
            } else {
                message.error('注册失败: ' + (response.data?.msg || '未知错误'));
            }
        } catch (error) {
            console.log(error);
            message.error('注册失败: ' + (error.response?.data?.message || '未知错误'));
        }
    };

    return (
        <div style={{ width: 350, margin: '100px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>云超市管理系统</h2>
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={[
                    {
                        key: 'login',
                        label: '登录',
                        children: (
                            <Form form={loginForm} onFinish={onFinish}>
                                <Form.Item
                                    name="adminaccout"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input placeholder="用户名" />
                                </Form.Item>

                                <Form.Item
                                    name="adminpwd"
                                    rules={[{ required: true, message: '请输入密码' }]}
                                >
                                    <Input.Password placeholder="密码" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" block>
                                    登录
                                </Button>
                            </Form>
                        )
                    },
                    {
                        key: 'register',
                        label: '注册',
                        children: (
                            <Form form={registerForm} onFinish={onRegister}>
                                <Form.Item
                                    name="adminaccount"
                                    rules={[{ required: true, message: '请输入用户名' }]}
                                >
                                    <Input placeholder="用户名" />
                                </Form.Item>

                                <Form.Item
                                    name="name"
                                    rules={[{ required: true, message: '请输入姓名' }]}
                                >
                                    <Input placeholder="姓名" />
                                </Form.Item>

                                <Form.Item
                                    name="adminpwd"
                                    rules={[
                                        { required: true, message: '请输入密码' },
                                        { message: '密码' }
                                    ]}
                                >
                                    <Input.Password placeholder="密码" />
                                </Form.Item>

                                <Form.Item
                                    name="confirmPassword"
                                    dependencies={['adminpwd']}
                                    rules={[
                                        { required: true, message: '请确认密码' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('adminpwd') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('两次输入的密码不一致'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password placeholder="确认密码" />
                                </Form.Item>

                                <Button type="primary" htmlType="submit" block>
                                    注册
                                </Button>
                            </Form>
                        )
                    }
                ]}
            />
        </div>
    );
}