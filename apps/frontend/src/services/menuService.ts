import axios from 'axios';

const headers = {
    'Authorization': "Bearer 675a8b075c86a9ad38333f97,ea3cdc716fb0f9cb3b183f62a57194b640dbc9dbb923e2463f9d489dd84aff4fa7fac46a1a3eb675b7d6b4"
};

export const fetchMenus = async (appId: string) => {
    console.log(`fetchMenus`, `/backend/service/api/apps/${appId}/menus`)
    const response = await axios.get(`/backend/service/api/apps/${appId}/menus`, { headers });
    return response.data; // 假设返回的数据是菜单数组
};