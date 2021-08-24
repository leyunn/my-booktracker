import axios from 'axios';
import { useState } from 'react';
const instance = axios.create();

const useApi = ()=>{
  const [searchdata, setsearchdata] = useState({data:[], status:0});
  const searchAll = async ({keyword, page}) =>{
    const startindex = 40*(page-1);
    const {data:{data, total}, status} = await instance.get(`/api/searchAll/${keyword}/${startindex}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:{data: err.response, total:0}})
    });
    setsearchdata({data, status, total});
  }

  const getDetail = async (id) =>{
    const {data, status} = await instance.get(`/api/getDetail/${id}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return({data, status})
  }

  const getMyBooks = async (token) =>{
    const {data, status} = await instance.get(`/api/getMyBooks/${token}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return({data2:data, status2:status})
  }

  const getOneBookshelf = async (id, token) =>{
    const {data, status} = await instance.get(`/api/getOneBookshelf/${id}/${token}`).catch((err)=>{
      console.log('error')
      return({status:(err.response)? err.response.status:"", data:err.response})
    }); 
    return({data, status})
  }

  const addBook = async (shelf, volume, token) =>{
    const {status} = await instance.post(`/api/addBook/${shelf}/${volume}/${token}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return(status)
  }

  const moveBook = async (from, to, volume, token) =>{
    const {status} = await instance.post(`/api/moveBook/${from}/${to}/${volume}/${token}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return(status)
  }

  const removeBook = async (shelf, volume, token) =>{
    const {status} = await instance.post(`/api/removeBook/${shelf}/${volume}/${token}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return(status)
  }

  const clearShelf = async (shelf, token) =>{
    const {status} = await instance.post(`/api/clearShelf/${shelf}/${token}`).catch((err)=>{
      return({status:(err.response)? err.response.status:"", data:err.response})
    });
    return(status)
  }

  return {searchAll, searchdata, getDetail, getMyBooks, getOneBookshelf, addBook, moveBook, removeBook, clearShelf}
}


export default useApi;