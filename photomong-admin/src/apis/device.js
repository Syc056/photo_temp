// import { axiosInstance } from "../config/config";
import axios from "axios";
//Env variable
export const BaseURL = "http://118.33.212.138:9000";
axios.defaults.withCredentials = true;
// Created an axios instance adding our api BaseURL
export const axiosInstance = axios.create({
  baseURL: BaseURL,
});

export const getDeivceInfo = async () => {
    const {data} =await axiosInstance.get("/api/devices")
    return data  
};
export const postAddDeivce = async (payload) => {
    const {data,status} =await axiosInstance.post("/api/add_device",payload)
    return [data,status]  
};
export const putEditDeivce = async (payload,id) => {
    const {data,status} =await axiosInstance.put(`/api/edit_device/${id}`,payload)
    return [data,status]  
};
export const putDeleteDevice=async (id)=>{
    const {data,status} =await axiosInstance.delete(`/api/delete_device/${id}`)
    return [data,status]  
}