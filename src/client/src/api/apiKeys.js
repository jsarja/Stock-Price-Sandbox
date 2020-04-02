import { getAuthToken } from '../utils/AuthTokenStore';

const baseURL = 'http://127.0.0.1:8000/api/stock_data/av_api_key';

export const getApiKey = async () => {
    const userToken = getAuthToken();
    const response = await fetch(baseURL, 
        {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        }
    );
    return response;
}

export const setApiKey = async (key) => {
    const userToken = getAuthToken();
    const response = await fetch(baseURL, 
        {
            method: 'PUT',
            body: JSON.stringify({"alpha_vantage_api_key": key}),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        }
    );
    return response;
}