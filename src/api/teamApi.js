import axiosClient from "./axiosClient";
const header= {
    Authorization: "Bearer "+localStorage.getItem("accessToken")
}
const teamApi = {
    getAllMyTeams : ()=>{
        const url = "/getAllMyTeams";
        return axiosClient.get(url, header);
    },
    getDetailTeam : (id) =>{
        const url = "/getDetailTeam?_id="+id;
        return axiosClient.get(url, header, id);
    },
    postChannel: (data) =>{        
        const url = "/postChannel";        
        return axiosClient.post(url, {data: data, header: header});
    },
    deleteChannel: (data) =>{
        const url = "/deleteChannel";  
        return axiosClient.post(url, {data: data, header: header});
    },
    joinTeam: (codeTeam)=>{
        const url = "/joinTeam";
        return axiosClient.post(url, {codeTeam: codeTeam});
    }
}

export default teamApi;