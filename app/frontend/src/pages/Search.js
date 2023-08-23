import '../App.css';
import { useState } from 'react';
import {Autocomplete} from '@material-ui/lab';
import {Input, AutoComplete} from 'antd';
import {useSelector, useDispatch} from 'react-redux';
import {setsearchInput, sropen, setkeyword} from '../actions';

const Search = () =>{
    const dispatch = useDispatch()
    // const logIn = useSelector(state => state.logIn)
    const searchInput = useSelector(state => state.bookSearchInput)
    const searchHistory = useSelector(state => state.searchHistory)
    return(
       <div className="page" style={{display:"flex", flexDirection:"column", justifyContent:"space-around", alignItems:"center", height:"729px", overflowY:"hidden", }}>
           <div >
                <div style={{ height:"50px"}}><p style={{color:"white", fontSize:"40px"}}>Find the book you like.</p></div>
                <div style={{paddingTop:"60px"}}>
                <AutoComplete
                    options={[...searchHistory.map(n=>({value:n}))]}
                    filterOption={(inputValue, option) =>
                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                    }
                    onChange={e=>{dispatch(setsearchInput(e))}}
                    
                >
                    <Input.Search value={searchInput} size="large" placeholder="search books" style={{width:"55vw"}} onSearch={()=>{
                            if(searchInput!=""){
                                dispatch(setkeyword(searchInput))
                                dispatch(sropen())
                        }}} />
                </AutoComplete>
                </div>
            </div>
        </div>
    )
}

export default Search;