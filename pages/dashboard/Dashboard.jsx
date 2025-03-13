import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import { Pie } from '@ant-design/plots';
import axios from 'axios';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('admin_token');
        const response = await axios.get('http://1.117.70.79:8090/api/get/record', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.data.code >= 200 && response.data.code <300) {
          setDashboardData(response.data.data);
        } else {
          console.error('获取数据失败:', response.data.message);
          message.error('获取数据失败: ' + response.data.message);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        message.error('获取数据失败，请检查网络连接或登录状态');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 订单状态数据
  const getOrderStatusData = () => {
    if (!dashboardData) return [];
    
    return [
      { type: '已发货', value: dashboardData.send, percent: dashboardData.sendPercent },
      { type: '配送中', value: dashboardData.delivery, percent: dashboardData.deliveryPercent },
      { type: '已退款', value: dashboardData.haveRefund, percent: dashboardData.haveRefundPercent },
      { type: '已成交', value: dashboardData.haveDeal, percent: dashboardData.haveDealPercent },
    ];
  };

  // 订单处理情况
  const getOrderProcessData = () => {
    if (!dashboardData) return [];
    
    return [
      { type: '成功交易', value: dashboardData.totalDeal, percent: dashboardData.totalDeal },
      { type: '失败交易', value: dashboardData.totalFalse, percent: dashboardData.totalFalse },
    ];
  };

  const pieConfig = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }} />;
  }

  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>数据概况</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={8} >
          <Card title="销售统计">
            <Statistic title="今日销售额" value={dashboardData.today} precision={2} suffix="元" />
            <Statistic title="总销售额" value={dashboardData.totalSales} precision={2} suffix="元" style={{ marginTop: 16 }} />
          </Card>
        </Col>
        
        <Col span={16}>
          <Card title="订单状态分布">
            <Pie {...pieConfig} data={getOrderStatusData()} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="订单处理情况">
            <Pie {...pieConfig} data={getOrderProcessData()} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;