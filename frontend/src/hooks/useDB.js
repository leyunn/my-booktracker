import axios from 'axios';
const instance = axios.create();


const useDB = ()=>{
    const loginDB = async (mail)=>{
        const {data, status} = await instance.get(`/db/login/${mail}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const signupDB = async ({mail, name})=>{
        const {data, status} = await instance.post(`/db/signup/${mail}/${name}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const setHomebookDB = async ({mail, id})=>{
        const {data, status} = await instance.post(`/db/sethomebook/${mail}/${id}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const removeHomebookDB = async (mail)=>{
        const {data, status} = await instance.post(`/db/removehomebook/${mail}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const getbookDB = async ({mail, id})=>{
        const {data, status} = await instance.get(`/db/getbook/${mail}/${id}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const ratebookDB = async ({mail, id, rating})=>{
        const {data, status} = await instance.post(`/db/ratebook/${mail}/${id}/${rating}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const updatepageDB = async ({mail, id, page})=>{
        const {data, status} = await instance.post(`/db/updatepage/${mail}/${id}/${page}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const updatereviewDB = async ({mail, id, review})=>{
        const {data, status} = await instance.post(`/db/updatereview/${mail}/${id}/${review}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const deletereviewDB = async ({mail, id})=>{
        const {data, status} = await instance.post(`/db/deletereview/${mail}/${id}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const updatenotesDB = async ({mail, id, notes})=>{
        const {data, status} = await instance.post(`/db/updatenotes/${mail}/${id}/${JSON.stringify(notes)}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const renameDB = async ({mail, name})=>{
        const {data, status} = await instance.post(`/db/rename/${mail}/${name}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    const cleardataDB = async ({mail})=>{
        const {data, status} = await instance.post(`/db/cleardata/${mail}`).catch((err)=>{
            return({status:(err.response)? err.response.status:"", data:err.response})
        });
        return({data, status})
    }

    

    return {loginDB, signupDB, setHomebookDB, getbookDB, removeHomebookDB, ratebookDB, updatepageDB, updatereviewDB, deletereviewDB, updatenotesDB, renameDB, cleardataDB}
}


export default useDB;