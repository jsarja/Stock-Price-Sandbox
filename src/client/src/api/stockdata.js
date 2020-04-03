import { getAuthToken } from '../utils/AuthTokenStore';

const baseURL = 'http://127.0.0.1:8000/api/stock_data';

export const getLatestDaily = async (requestData) => {
    const userToken = getAuthToken();
    const response = await fetch(`${baseURL}/latest_daily`, 
        {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        }
    );
    return response;
}

export const getLongTerm = async (requestData) => {
    const userToken = getAuthToken();
    const response = await fetch(`${baseURL}/long_term`, 
        {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Token ${userToken}`
            }
        }
    );
    return response;
}