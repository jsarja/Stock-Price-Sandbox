const baseURL = 'http://127.0.0.1:8000/api/auth';

export const signIn = async (userData) => {
    const response = await fetch(`${baseURL}/sign_in`, 
        {
            method: 'POST',
            body: JSON.stringify(userData),
            // headers:{
            //     'Content-Type': 'application/json',
            //     'Authorization': googleId
            // }
        }
    );
    return response;
}

export const signUp = async (userData) => {
    const response = await fetch(`${baseURL}/sign_up`, 
        {
            method: 'POST',
            body: JSON.stringify(userData),
            headers:{
                'Content-Type': 'application/json',
                //'Authorization': googleId
            }
        }
    );
    return response;
}