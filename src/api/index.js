import http from '../utils/http';

// 广告管理相关API
export const adAPI = {
  // 获取所有广告
  getAllAds: () => http.get('/ads/all-ads'),
  
  // 新增广告
  addAd: (formData) => {
    return http.post('/ads/ad', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 修改广告图片
  updateAdPhoto: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return http.put(`/ads/ad/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  // 删除广告
  deleteAd: (id) => http.delete(`/ads/ad/delete/${id}`)
};

// 商品分类管理相关API
export const categoryAPI = {
  // 分页获取商品分类
  getCategoriesPage: (count, pageSize) => http.get(`/categories/all-categories/${count}/${pageSize}`),
  
  // 新增商品分类
  addCategory: (typesDto) => http.post('/categories/category', typesDto),
  
  // 删除商品分类
  deleteCategory: (id, curTotal) => http.delete(`/categories/category/${id}/${curTotal}`)
};

// 商品信息管理相关API
export const commodityAPI = {
  // 分页获取商品
  getCommoditiesPage: (selectCommodityDto) => http.post('/commodities/all-commodities', selectCommodityDto),
  
  // 新增商品
  addCommodity: (formData) => {
    return http.post('/commodities/commodity', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};