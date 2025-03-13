import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { adAPI } from '../../api/index';

const AdvertisementManage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  
  // 获取广告列表
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await adAPI.getAllAds();
      if (res.data.code >= 200 && res.data.code < 300) {
        setAds(res.data.data || []);
      } else {
        message.error(res.data.msg || '获取广告列表失败');
      }
    } catch (error) {
      console.error('获取广告列表失败:', error);
      message.error('获取广告列表失败');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAds();
  }, []);
  
  // 添加广告
  const handleAdd = async (values) => {
    if (fileList.length === 0) {
      message.error('请上传广告图片');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);
    formData.append('adName', values.adName);
    formData.append('adCompany', values.adCompany);
    formData.append('adCategory', values.adCategory);
    
    try {
      const res = await adAPI.addAd(formData);
      if (res.data.code === 200) {
        message.success('添加广告成功');
        setVisible(false);
        form.resetFields();
        setFileList([]);
        fetchAds();
      } else {
        message.error(res.data.msg || '添加广告失败');
      }
    } catch (error) {
      console.error('添加广告失败:', error);
      message.error('添加广告失败');
    }
  };
  
  // 删除广告
  const handleDelete = async (id) => {
    try {
      const res = await adAPI.deleteAd(id);
      if (res.data.code === 200) {
        message.success('删除广告成功');
        fetchAds();
      } else {
        message.error(res.data.msg || '删除广告失败');
      }
    } catch (error) {
      console.error('删除广告失败:', error);
      message.error('删除广告失败');
    }
  };
  
  const columns = [
    { title: '广告ID', dataIndex: 'id', key: 'id' },
    { title: '广告名称', dataIndex: 'adName', key: 'adName' },
    { title: '广告公司', dataIndex: 'adCompany', key: 'adCompany' },
    { title: '广告分类', dataIndex: 'adCategory', key: 'adCategory' },
    { 
      title: '广告图片', 
      dataIndex: 'file', 
      key: 'file',
      render: (text) => <img src={text} alt="广告图片" style={{ width: 100 }} />
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <>
          <Button 
            type="link" 
            danger 
            onClick={() => {
              Modal.confirm({
                title: '确认删除',
                content: `确定要删除广告 "${record.adName}" 吗？`,
                onOk: () => handleDelete(record.id)
              });
            }}
          >
            删除
          </Button>
        </>
      )
    }
  ];
  
  return (
    <div>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setVisible(true)}
        style={{ marginBottom: 16 }}
      >
        添加广告
      </Button>
      
      <Table 
        columns={columns} 
        dataSource={ads} 
        rowKey="id" 
        loading={loading}
      />
      
      <Modal
        title="添加广告"
        visible={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
          <Form.Item
            name="adName"
            label="广告名称"
            rules={[{ required: true, message: '请输入广告名称' }]}
          >
            <Input placeholder="请输入广告名称" />
          </Form.Item>
          
          <Form.Item
            name="adCompany"
            label="广告公司"
            rules={[{ required: true, message: '请输入广告公司' }]}
          >
            <Input placeholder="请输入广告公司" />
          </Form.Item>
          
          <Form.Item
            name="adCategory"
            label="广告分类"
            rules={[{ required: true, message: '请输入广告分类' }]}
          >
            <Input placeholder="请输入广告分类" />
          </Form.Item>
          
          <Form.Item
            label="广告图片"
            rules={[{ required: true, message: '请上传广告图片' }]}
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              beforeUpload={() => false}
              onChange={({ fileList }) => setFileList(fileList)}
            >
              <Button icon={<UploadOutlined />}>上传图片</Button>
            </Upload>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdvertisementManage;