import axiosClient from "./axiosClient";
const header= {
    Authorization: "Bearer "+localStorage.getItem("accessToken")
}
const adminApi = {
    getAllUsers: ()=>{
        const url = "/getAllUsers";
        return axiosClient.post(url)
    }, 
    adminDeleteUser: (id) =>{
        const url = "/adminDeleteUser";
        return axiosClient.post(url, {id})
    }
}

export default adminApi;