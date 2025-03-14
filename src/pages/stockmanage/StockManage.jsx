import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, message, Modal, Form, Input, Popconfirm } from 'antd';
import { KeyOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function StockManage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(
        `http://1.117.70.79:8090/api/users/all-users/${pagination.current}/${pagination.pageSize}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.code >= 200 && response.data.code < 300) {
        setUsers(response.data.data.list || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0
        });
      } else {
        message.error(response.data.message || '获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      message.error('获取用户列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  // 修改密码
  const handleChangePassword = () => {
    form.validateFields().then(async (values) => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.put(
          `http://1.117.70.79:8090/api/users/user/`,
          {
            id: currentUser.id,
            modifiedpassword: values.newPassword
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data.code >= 200 && response.data.code < 300) {
          message.success('密码修改成功');
          setPasswordModalVisible(false);
          form.resetFields();
        } else {
          message.error(response.data.message || '密码修改失败');
        }
      } catch (error) {
        console.error('密码修改失败:', error);
        message.error('密码修改失败');
      }
    });
  };

  // 删除用户
  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.delete(
        `http://1.117.70.79:8090/api/users/user/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.code >= 200 && response.data.code < 300) {
        message.success('用户删除成功');
        fetchUsers();
      } else {
        message.error(response.data.message || '删除用户失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.error('删除用户失败');
    }
  };

  // 打开修改密码模态框
  const openPasswordModal = (user) => {
    setCurrentUser(user);
    form.resetFields();
    setPasswordModalVisible(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.current, pagination.pageSize]);

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
      width: 180,
      ellipsis: true
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      width: 100,
      render: (text) => text || '未设置'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
      render: (text) => text || '未设置'
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: 70,
      render: (text) => text || '未设置'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 120,
      render: (text) => text || '未设置'
    },
    {
      title: '密码',
      dataIndex: 'password',
      key: 'password',
      width: 120,
      render: (text) => text ? `${text}` : '未设置'
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 150,
      ellipsis: true,
      render: (text) => text || '未设置'
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<KeyOutlined />} 
            size="small"
            onClick={() => openPasswordModal(record)}
          >
            修改密码
          </Button>
          <Popconfirm
            title="确定要删除此用户吗？"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            >
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <Card 
        title="用户管理" 
        style={{ marginBottom: 16 }}
        bodyStyle={{ padding: '12px' }}
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          size="small"
          bordered={false}
          style={{ width: '100%' }}
        />
      </Card>

      {/* 修改密码模态框 */}
      <Modal
        title="修改密码"
        visible={passwordModalVisible}
        onCancel={() => setPasswordModalVisible(false)}
        onOk={handleChangePassword}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="newPassword"
            label="新密码"
            rules={[
              { required: true, message: '请输入新密码' },
              { message: '密码长度不能少于6个字符' }
            ]}
          >
            <Input.Password placeholder="请输入新密码" />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}