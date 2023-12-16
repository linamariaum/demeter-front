import axios from './Axios';

export const getSaleByTimepc= () => axios.get('/getSaleByTimepc');
export const getShopByTimepc= () => axios.get('/shoppingByDate');
export const getSaleByuserpc= () => axios.get('/getSaleByuserpc');
export const getBestProd= () => axios.get('/detailsBP');
export const getEXPS= () => axios.get('/shoppingdetailExp');
