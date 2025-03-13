import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Tag, Modal, Descriptions, message, Card } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
// 由于未使用moment，移除该导入

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function OrderManage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    orderId: '',
    orderStatus: '',
    phone: '',
    dateRange: [],
    operate: ''
  });
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // 获取订单列表
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      
      // 构建请求参数
      const params = {
        beginTime: undefined,
        current: pagination.current,
        endTime: undefined,
        pageSize: pagination.pageSize,
        orderId: searchParams.orderId || undefined,
        orderStatus: searchParams.orderStatus || undefined,
        phone: searchParams.phone || undefined,
        operate: searchParams.operate || undefined
      };
      
      // 添加日期范围参数
      if (searchParams.dateRange && searchParams.dateRange.length === 2) {
        params.beginTime = searchParams.dateRange[0]?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        params.endTime = searchParams.dateRange[1]?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      }
      
      const response = await axios.get('http://1.117.70.79:8090/api/order/information', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      });

      if (response.data.code >= 200 && response.data.code < 300) {
        setOrders(response.data.data.list || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0
        });
      } else {
        message.error(response.data.message || '获取订单列表失败');
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      message.error('获取订单列表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  // 查看订单详情
  const viewOrderDetail = (order) => {
    setCurrentOrder(order);
    setDetailVisible(true);
  };

  // 更新订单状态
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.put(`http://1.117.70.79:8090/api/orders/${orderId}/status`, 
        { 
          orderId,
          orderStatus: newStatus,
          operate: '管理员操作'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.code >= 200 && response.data.code < 300) {
        message.success('订单状态更新成功');
        fetchOrders(); // 刷新订单列表
      } else {
        message.error(response.data.message || '更新订单状态失败');
      }
    } catch (error) {
      console.error('更新订单状态失败:', error);
      message.error('更新订单状态失败');
    }
  };

  // 搜索条件变化
  const handleSearchChange = (name, value) => {
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  // 执行搜索
  const handleSearch = () => {
    setPagination({
      ...pagination,
      current: 1 // 重置到第一页
    });
    fetchOrders();
  };

  // 重置搜索
  const handleReset = () => {
    setSearchParams({
      orderId: '',
      orderStatus: '',
      phone: '',
      dateRange: [],
      operate: ''
    });
    setPagination({
      ...pagination,
      current: 1
    });
    fetchOrders();
  };

  // 表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.current, pagination.pageSize]);

  // 订单状态标签颜色
  const getStatusTag = (status) => {
    const statusMap = {
      '待付款': { color: 'gold', text: '待付款' },
      '待发货': { color: 'blue', text: '待发货' },
      '已发货': { color: 'cyan', text: '已发货' },
      '配送中': { color: 'purple', text: '配送中' },
      '已完成': { color: 'green', text: '已完成' },
      '已取消': { color: 'red', text: '已取消' },
      '退款中': { color: 'orange', text: '退款中' },
      '已退款': { color: 'volcano', text: '已退款' }
    };
    
    return (
      <Tag color={statusMap[status]?.color || 'default'}>
        {statusMap[status]?.text || status}
      </Tag>
    );
  };

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 180
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180
    },
    {
      title: '客户电话',
      dataIndex: 'phone',
      key: 'phone',
      width: 120
    },
    {
      title: '订单金额',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => `¥${amount?.toFixed(2) || '0.00'}`
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      width: 120,
      render: (status) => getStatusTag(status)
    },
    {
      title: '操作人',
      dataIndex: 'operate',
      key: 'operate',
      width: 120
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EyeOutlined />} 
            size="small"
            onClick={() => viewOrderDetail(record)}
          >
            查看
          </Button>
          {record.orderStatus === '待发货' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => updateOrderStatus(record.orderId, '已发货')}
            >
              发货
            </Button>
          )}
          {record.orderStatus === '已发货' && (
            <Button 
              type="primary" 
              size="small"
              onClick={() => updateOrderStatus(record.orderId, '配送中')}
            >
              配送
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card title="订单管理" style={{ marginBottom: 16 }}>
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="订单编号"
            value={searchParams.orderId}
            onChange={(e) => handleSearchChange('orderId', e.target.value)}
            style={{ width: 200 }}
          />
          <Input
            placeholder="客户电话"
            value={searchParams.phone}
            onChange={(e) => handleSearchChange('phone', e.target.value)}
            style={{ width: 150 }}
          />
          <Select
            placeholder="订单状态"
            value={searchParams.orderStatus}
            onChange={(value) => handleSearchChange('orderStatus', value)}
            allowClear
            style={{ width: 150 }}
          >
            <Option value="待付款">待付款</Option>
            <Option value="待发货">待发货</Option>
            <Option value="已发货">已发货</Option>
            <Option value="配送中">配送中</Option>
            <Option value="已完成">已完成</Option>
            <Option value="已取消">已取消</Option>
            <Option value="退款中">退款中</Option>
            <Option value="已退款">已退款</Option>
          </Select>
          <Select
            placeholder="操作人"
            value={searchParams.operate}
            onChange={(value) => handleSearchChange('operate', value)}
            allowClear
            style={{ width: 150 }}
          >
            <Option value="系统">系统</Option>
            <Option value="用户">用户</Option>
            <Option value="管理员操作">管理员</Option>
          </Select>
          <RangePicker
            value={searchParams.dateRange}
            onChange={(dates) => handleSearchChange('dateRange', dates)}
            showTime
          />
          <Button 
            type="primary" 
            icon={<SearchOutlined />}
            onClick={handleSearch}
          >
            搜索
          </Button>
          <Button onClick={handleReset}>重置</Button>
        </Space>

        <Table
          columns={columns}
          dataSource={orders}
          rowKey="orderId"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 订单详情弹窗 */}
      <Modal
        title="订单详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}
      >
        {currentOrder && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="订单编号">{currentOrder.orderId}</Descriptions.Item>
              <Descriptions.Item label="下单时间">{currentOrder.createTime}</Descriptions.Item>
              <Descriptions.Item label="客户名称">{currentOrder.customerName}</Descriptions.Item>
              <Descriptions.Item label="联系电话">{currentOrder.phone}</Descriptions.Item>
              <Descriptions.Item label="收货地址">{currentOrder.address}</Descriptions.Item>
              <Descriptions.Item label="订单状态">{getStatusTag(currentOrder.orderStatus)}</Descriptions.Item>
              <Descriptions.Item label="订单金额">¥{currentOrder.totalAmount?.toFixed(2) || '0.00'}</Descriptions.Item>
              <Descriptions.Item label="支付方式">{currentOrder.paymentMethod}</Descriptions.Item>
              <Descriptions.Item label="操作人">{currentOrder.operate || '系统'}</Descriptions.Item>
              <Descriptions.Item label="备注" span={2}>{currentOrder.remark || '无'}</Descriptions.Item>
            </Descriptions>

            <h3 style={{ margin: '20px 0 10px' }}>订单商品</h3>
            <Table
              columns={[
                { title: '商品名称', dataIndex: 'productName', key: 'productName' },
                { title: '规格', dataIndex: 'specification', key: 'specification' },
                { title: '单价', dataIndex: 'price', key: 'price', render: (price) => `¥${price?.toFixed(2) || '0.00'}` },
                { title: '数量', dataIndex: 'quantity', key: 'quantity' },
                { title: '小计', dataIndex: 'subtotal', key: 'subtotal', render: (_, record) => `¥${((record.price || 0) * (record.quantity || 0)).toFixed(2)}` }
              ]}
              dataSource={currentOrder.items || []}
              rowKey={(record, index) => `item-${index}`}
              pagination={false}
            />
          </>
        )}
      </Modal>
    </div>
  );
}