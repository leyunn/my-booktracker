import 'date-fns';
import {format} from 'date-fns'
import { Button, Dialog, DialogContent,DialogActions, IconButton, Tooltip, TextField} from '@material-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import { useState,useEffect} from 'react';
import {copen, neclose, updatenote, validatenote} from '../actions';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import CheckIcon from '@material-ui/icons/Check';

const Noteeditor = ()=>{
    const dispatch = useDispatch()
    const modal = useSelector(state => state.noteeditorModal)
    const book = useSelector(state=>state.currentBook);
    const savedbooks = useSelector(state => state.booksInfo)
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [today, settoday] = useState(new Date());
    const [notecontent, setnotecontent] = useState("")


    useEffect(() => {
        if(modal.open){
            settoday(new Date())
            if(modal.notepos===-3){
                setSelectedDate(new Date())
                setnotecontent("")
            }else{
                let bookdata =  savedbooks.find(n=>n.id===book.id);
                let note = bookdata.db.notes[modal.notepos]
                setnotecontent(note.content)
                setSelectedDate(new Date(note.time)) 
            }
            
        }
    }, [modal])

    const handleCancel = ()=>{
        dispatch(neclose(-1))
    }


    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleDelete = ()=>{
        dispatch(copen("delete this note"))
    }

    const handleSave = async () =>{
        if(modal.notepos!==-3){
            if(notecontent==""){
               handleDelete() 
            }else{
               dispatch(updatenote({id: book.id, notepos: modal.notepos, content: notecontent, time: format(selectedDate, 'yyyy-MM-dd') }))
                dispatch(neclose(-2)) 

            }
              
        }else{
            dispatch(validatenote({id: book.id, content: notecontent, date: format(selectedDate, 'yyyy-MM-dd') }))
            dispatch(neclose(-2))  
        }
        
    }

    return(
        <div>
        <Dialog open={modal.open} >
            <DialogActions style={{marginTop:"10px", display:'flex', justifyContent:"space-between"}}>
                <div style={{marginLeft:"20px"}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                <KeyboardDatePicker
                  maxDate={today}
                  disableToolbar
                  variant="inline"
                  format="yyyy/MM/dd"
                  margin="normal"
                  value={selectedDate}
                  onChange={handleDateChange}
                />
                </MuiPickersUtilsProvider>
                </div>
                <Tooltip title="save" >
                    <IconButton onClick={handleSave} style={{height:"40px", width:"40px",margin:"0px 20px 0px 10px" }} ><CheckIcon style={{height:"30px", width:"30px"}} /></IconButton>
                </Tooltip>
                
                
            </DialogActions>
            <DialogContent style={{width:"600px", height:"150px"}} >
            <TextField helperText=' 150 words maximum' value={notecontent} onChange={e=>{
                // set max word
                if(e.target.value.length<=150){
                   setnotecontent(e.target.value) 
                }
                
            }} variant="outlined"
             fullWidth={true} multiline rows={4}  autoFocus />
            </DialogContent>
            <DialogActions style={{display:"flex", justifyContent:"space-between", marginBottom:"10px"}}>
                {/* <DialogTitle style={{paddingBottom:"0px"}} style={{textAlign:"center", width:"380px"}}></DialogTitle> */}
                {(modal.notepos!==-3)? <div style={{marginLeft:"10px"}}>
                     <Tooltip title="delete" >
                        <IconButton onClick={handleDelete} style={{height:"35px", width:"35px",margin:"0px 10px 0px 10px", color:"rgb(156, 50, 50)" }} ><DeleteOutlineIcon/> </IconButton>
                    </Tooltip>
                </div>:<div></div>}
                <Button onClick={handleCancel} size="small" variant="outlined" style={{marginRight:"20px"}} >Cancel</Button>
                
                
            </DialogActions>
        </Dialog>
        </div>
    )
}

export default Noteeditor;