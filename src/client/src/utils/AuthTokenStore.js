
export const saveAuthToken = (tokenInfo) => {
    let expiresAt = JSON.stringify((tokenInfo.expiresIn * 1000) 
        + new Date().getTime());
    localStorage.setItem('token', tokenInfo.token);
    localStorage.setItem('expires_at', expiresAt);
}

export const validAuthTokenExists = () => {
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return (new Date().getTime() < expiresAt) 
        && (localStorage.getItem('token') !== null);
}

export const getAuthToken = () => {
    return localStorage.getItem('token')
}

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
}