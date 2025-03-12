import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Input, Select, message } from 'antd';
import { commodityAPI } from '../../api/index';
import { data } from 'react-router-dom';

const GoodsManage = () => {
  const [commodities, setCommodities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [searchParams, setSearchParams] = useState({
    commodityName: '',
    categoryId: ''
  });

  // 分页获取商品
  const fetchCommodities = async () => {
    setLoading(true);
    try {
      const params = {
        count: pagination.current,
        pageSize: pagination.pageSize
      };

      const res = await commodityAPI.getCommoditiesPage(params);
      if (res.data.code >= 200 && res.data.code < 300) {
        setCommodities(res.data.data.list || []);
        setPagination({
          ...pagination,
          total: res.data.data.total || 0
        });
      } else {
        message.error(res.data.message || '获取商品失败');
      }
    } catch (error) {
      console.error('获取商品失败:', error);
      message.error('获取商品失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommodities();
  }, [pagination.current, pagination.pageSize, searchParams]);

  // 表格分页变化
  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };


  const columns = [
    { title: '商品名称', dataIndex: 'commodityName', key: 'commodityName' },
    { title: '分类ID', dataIndex: 'categoryId', key: 'categoryId' },
    { title: '库存', dataIndex: 'inventory', key: 'inventory' },
    { title: '现价', dataIndex: 'currentPrice', key: 'currentPrice' },
    { title: '成本', dataIndex: 'cost', key: 'cost' },
    { title: '警戒库存', dataIndex: 'dangerInventory', key: 'dangerInventory' },
    { title: '售卖单位', dataIndex: 'sellingUnit', key: 'sellingUnit' },
    { title: '照片', dataIndex: 'file', key: 'file', render: (text) => <img src={text} alt="广告图片" style={{ width: 100 }} /> }
  ];

  return (
    <div>
      <div style={{ marginBottom: 30 }}>
      </div>

      <Table
        columns={columns}
        dataSource={commodities}
        rowKey="id"
        loading={loading}
        pagination={pagination}
        onChange={handleTableChange}
        bordered
        scroll={{ x: 1200 }}
      />
    </div>
  );
};

export default GoodsManage;