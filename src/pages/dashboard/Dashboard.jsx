import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, message } from 'antd';
import ReactECharts from 'echarts-for-react';
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
  const getOrderStatusOption = () => {
    if (!dashboardData) return {};
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['已发货', '配送中', '已退款', '已成交']
      },
      series: [
        {
          name: '订单状态',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{b}: {d}%'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '16',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: true
          },
          data: [
            { value: dashboardData.send, name: '已发货' },
            { value: dashboardData.delivery, name: '配送中' },
            { value: dashboardData.haveRefund, name: '已退款' },
            { value: dashboardData.haveDeal, name: '已成交' }
          ]
        }
      ]
    };
  };

  // 订单处理情况
  const getOrderProcessOption = () => {
    if (!dashboardData) return {};
    
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'horizontal',
        bottom: 'bottom',
        data: ['成功交易', '失败交易']
      },
      series: [
        {
          name: '交易情况',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: dashboardData.totalDeal, name: '成功交易' },
            { value: dashboardData.totalFalse, name: '失败交易' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
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
            <ReactECharts option={getOrderStatusOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col span={24}>
          <Card title="订单处理情况">
            <ReactECharts option={getOrderProcessOption()} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;