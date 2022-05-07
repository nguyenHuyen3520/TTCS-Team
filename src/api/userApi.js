import axiosClient from "./axiosClient";
const header= {
    Authorization: "Bearer "+localStorage.getItem("accessToken")
}
const userApi = {
    login: (params)=>{        
        const url = "/login";
        return axiosClient.post(url, params)
    },
    signup: (params)=>{
        const url = "/signup";
        return axiosClient.post(url, params)
    },
    getProfile: ()=>{
        const url = "/getProfile";
        return axiosClient.get(url, header)
    },    
    updateUid : (data) =>{
        const url = "/updateUid";
        return axiosClient.post(url,{data})
    }
}

export default userApi;