import './App.css'
import AdvertisementManage from './pages/advertise/AdvertisementManage';
import CategoryManage from './pages/category/CategoryManage';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import GoodsManage from './pages/goodsmanage/GoodsManage';
import OrderManage from './pages/ordermanage/OrderManage';
import StockManage from './pages/stockmanage/StockManage';
import Dashboard from './pages/dashboard/Dashboard';
import PrivateRoute from './components/privateroute';
import AppLayout from './components/Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={
        <PrivateRoute>
          <AppLayout />
        </PrivateRoute>
      }>
        <Route path="/GoodsManage" element={<GoodsManage />} />
        <Route path="/orders" element={<OrderManage />} />
        <Route path="/stock" element={<StockManage />} />
        <Route path='/category' element={<CategoryManage/>}/>
        <Route path='/advertise' element={<AdvertisementManage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
      </Route>
    </Routes>
  );
}

export default App;
