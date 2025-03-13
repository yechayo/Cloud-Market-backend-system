import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { categoryAPI } from '../../api/index';

const CategoryManage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [form] = Form.useForm();
  
  const zero = 0;

  // 获取商品分类
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryAPI.getCategoriesPage(
        pagination.current,
        pagination.pageSize
      );
      if (res.data.code === 200) { // 使用正确的状态码
        setCategories(res.data.data.list || []);
        setPagination({
          ...pagination,
          current: res.data.data.pageNum,
          pageSize: res.data.data.pageSize,
          total: res.data.data.total || 0
        });
      } else {
        message.error(res.data.message || '获取商品分类失败');
      }
    } catch (error) {
      console.error('获取商品分类失败:', error);
      message.error('获取商品分类失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加商品分类
  const handleAddCategory = async (values) => {
    try {
      console.log(values);
      const res = await categoryAPI.addCategory(values);
      if (res.data.code >= 200 && res.data.code < 300) {
        message.success('添加商品分类成功');
        setVisible(false);
        form.resetFields();
        fetchCategories();
      } else {
        message.error(res.data.message || '添加商品分类失败');
      }
    } catch (error) {
      console.error('添加商品分类失败:', error);
      message.error('添加商品分类失败');
    }
  };

  // 删除商品分类
  const handleDeleteCategory = async (id, zero) => {
    try {
      const res = await categoryAPI.deleteCategory(id, zero);
      if (res.data.code >= 200 && res.data.code < 300) {
        message.success('删除商品分类成功');
        fetchCategories();
      } else {
        message.error(res.data.message || '删除商品分类失败');
      }
    } catch (error) {
      console.error('删除商品分类失败:', error);
      message.error('删除商品分类失败');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [pagination.current, pagination.pageSize]);

  // 表格分页变化
  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination
    });
  };

  const columns = [
    { title: '分类ID', dataIndex: 'categoryId', key: 'categoryId' },
    { title: '分类名称', dataIndex: 'categoryName', key: 'categoryName' },
    { title: '商品数量', dataIndex: 'curToal', key: 'curToal' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="link" 
          danger 
          onClick={() => {
            Modal.confirm({
              title: '确认删除',
              content: `确定要删除分类 "${record.categoryName}" 吗？`,
              onOk: () => handleDeleteCategory(record.categoryId, zero)
            });
          }}
        >
          删除
        </Button>
      )
    }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => setVisible(true)}
        >
          添加分类
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="categoryId" 
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
      />
      
      <Modal
        title="添加商品分类"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAddCategory} layout="vertical">
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManage;