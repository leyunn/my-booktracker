import {Dialog, DialogContent, TextField,DialogTitle, DialogActions, Button, Checkbox, FormControl, FormGroup, FormControlLabel} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import CheckIcon from '@material-ui/icons/Check';
import {copen, rename, sbclose, setremember, ssopen} from '../actions';

import useDB from '../hooks/useDB';
import { useState, useEffect } from 'react';
export default function SettingBox() {
  const dispatch = useDispatch();
  const modal = useSelector(state => state.settingModal)
  const rememberme = useSelector(state => state.rememberme)
  const [name, setname] = useState("")
  const [namesavedEffect, setnamesavedEffect] = useState(false)
  const userData = useSelector(state => state.userData)
  const {renameDB} = useDB()

  useEffect(() => {
      if(modal) setname(userData.name)
  }, [modal])

  const handleChangeName = () =>{
    const changename = async () =>{
      const {status} = await renameDB({mail: userData.mail, name})
      dispatch(rename(name))
      if(status<300){
        setnamesavedEffect(true)
      }
    }
    changename() 
    
  }

  const handlecheckbox = e=>{
    dispatch(setremember(e.target.checked))
    if(e.target.checked){
      localStorage.setItem("user","exist")
    }else{
      localStorage.removeItem("user")
    }
  }

  useEffect(() => {
      if(namesavedEffect){
        setTimeout(() => {
          setnamesavedEffect(false)
        }, 3000); 
      }
      
  }, [namesavedEffect])

  return (
    <div>
      <Dialog open={modal.open} onClose={()=>dispatch(sbclose())} >
          <DialogTitle style={{textAlign:"center"}} >Setting</DialogTitle>
          
          <DialogContent style={{width:"350px", textAlign:"center"}} >
              <FormControl>
                  <FormGroup>
                    <DialogActions style={{margin:"20px 0px 20px 0px"}} >
                        <TextField
                          onChange={inp=>{
                            if(inp.target.value.length>30) return;
                            setname(inp.target.value);
                          }}
                          value={name}
                          placeholder="name"
                        />
                        <Button onClick={handleChangeName} disabled={name==userData.name} size="small" variant="contained" color="primary" >Change</Button>
                        <CheckIcon style={{color:"rgb(75, 134, 99)", visibility:namesavedEffect? "visible":"hidden"}} />
                    </DialogActions>
                    <FormControlLabel
                        control={<Checkbox checked={rememberme} onChange={handlecheckbox} color="primary" />}
                        label="remember me when log in"
                        labelPlacement="end"
                    />
                        <Button onClick={()=>dispatch(ssopen("Clear"))} size="small" variant="outlined" style={{color:"rgb(156, 50, 50)", margin:"20px 0px 0px 0px"}} >Clear Google bookshelf</Button>
                        <Button onClick={()=>dispatch(copen("clear all data (notes/reviews)"))} size="small" variant="outlined" style={{color:"rgb(156, 50, 50)",margin:"20px 0px 20px 0px" }} >Clear all Notes/Reviews</Button>
                  </FormGroup>
              </FormControl>
          </DialogContent>
      </Dialog>
      
    </div>
  );
}