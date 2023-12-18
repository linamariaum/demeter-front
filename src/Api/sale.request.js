import axios from './Axios.js'

export const Createsale = (data) => axios.post(`/Csale`, data);
export const CreatesaleDetail = (data) => axios.post(`/Csaledetail`, data);
export const CreateManysaleDetails = (data) => axios.post(`/CManyDetails`, data);
export const deleteDetailSale = (data) => axios.delete(`/deleteDetailS/${data}`);
export const GetDetails = (id) => axios.get(`/details/${id}`);
export const UpdSale = (data) => axios.put(`/UpdateSale`, data);
export const pay = (data) => axios.put(`/paySale`, data);
export const GetoneSale = (ID_Sale) => axios.get(`/getSale/${ID_Sale}`);
export const getSale = () => axios.get(`/sale`);

