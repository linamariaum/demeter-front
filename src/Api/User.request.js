import axios from "./Axios.js";

export const getUsersRequest = () => axios.get(`/user`);
export const GetUserCookies = () => axios.get(`/getUserCookies`);
export const getUserRequest = (ID_User) => axios.get(`/user/${ID_User}`);
export const createUserRequest = (user) => axios.post(`/add_user`, user);
export const statusUserRequest = (ID_User) => axios.put(`/user/toggle/${ID_User}`);
export const updateUserRequest = (ID_User, user) => axios.put(`/user/${ID_User}`, user);
export const deleteUserRequest = (ID_User) => axios.delete(`/user/${ID_User}`);
export const existUserByEmailOrIdRequest = (document, email, userType) => axios.get(`/existUserByEmailOrId/${document}/${email}/${userType}`);

// --------------------------- Mesero --------------------------- //

export const getWaitersRequest = () => axios.get(`waiter`);
export const getWaiterRequest = (ID_User) => axios.get(`/waiter/${ID_User}`);
export const createWaiterRequest = (waiter) => axios.post(`/add_waiter`, waiter);
export const updateWaiterRequest = (ID_User, waiter) => axios.put(`/waiter/${ID_User}`, waiter);

//----------------------Login------------------------------//

export const loginRequest = user => axios.post(`/login`, user)
export const verifyTokenRequest = () => axios.get('/verifyToken')
export const forgotPasswordRequest = (emailData) => axios.post(`/resetPassword`, emailData);

export const NewPasswordRequest = (token) => axios.post(`/newPassword`, token)
export const GetCurrentUser = () => axios.get(`/getCurrentUser`)