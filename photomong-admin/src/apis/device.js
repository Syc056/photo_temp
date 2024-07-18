// import { axiosInstance } from "../config/config";
import axios from "axios";
//Env variable
export const BaseURL = "http://3.26.21.10:9000";
axios.defaults.withCredentials = true;
// Created an axios instance adding our api BaseURL
export const axiosInstance = axios.create({
  baseURL: BaseURL,
});
//
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
//점포별 정보 가져오는거
//얼만지 몇장 프린트했느지 몇신지 기계어디서 나왔는지 ->점포별로
//점포별 맥주소
export const getMacAddress = async () => {
    const {data} =await axios.get("127.0.0.1:8001/get-mac-address")
    return data  
};
//로그 가져오는 것
export const getLogs=async()=>{
    const {data} =await axiosInstance.get(`/api/logs`)
    return data  
}
//회원가입
export const postUser=async(payload)=>{
    const {data} =await axiosInstance.post(`/api/users`,payload)
    return data  
}
//유저 검증
export const getUser=async()=>{
    const {data} =await axiosInstance.get(`/api/users`)
    return data  
}
