import { Outlet } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import { ShoppingCartOutlined, UnorderedListOutlined, StockOutlined, AppstoreOutlined, PictureOutlined, DashboardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



const { Header, Content } = Layout;
const { Title } = Typography;

export default function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title 
          level={3} 
          style={{ 
            color: '#fff', 
            margin: '0 20px 0 0',
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
          }}
        >
          后台管理系统
        </Title>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['6']} style={{ flex: 1 }}>
          <Menu.Item
            key="6"
            icon={<DashboardOutlined />}
            onClick={() => navigate('/dashboard')}
          >
            数据概况
          </Menu.Item>
          <Menu.Item
            key="1"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/GoodsManage')}
          >
            商品管理
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<UnorderedListOutlined />}
            onClick={() => navigate('/orders')}
          >
            订单管理
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<StockOutlined />}
            onClick={() => navigate('/stock')}
          >
            用户管理
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<AppstoreOutlined />}
            onClick={() => navigate('/category')}
          >
            分类管理
          </Menu.Item>
          <Menu.Item
            key="5"
            icon={<PictureOutlined />}
            onClick={() => navigate('/advertise')}
          >
            广告管理
          </Menu.Item>
        </Menu>
        <Button
          style={{ marginLeft: 'auto' }}
          onClick={handleLogout}
        >
          退出登录
        </Button>
      </Header>
      <Content style={{ padding: '24px' }}>
        <Outlet />
      </Content>
    </Layout>
  );
}