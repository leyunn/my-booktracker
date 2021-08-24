import {TextField, Box, List, ListItem, Divider, Grid, Slider, Input, CircularProgress} from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check';
import Bookshelf from './Bookshelf';
import { useState, useEffect } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import useDB from '../hooks/useDB';
import {savedbinfo, savepagenow, rnopen, validatenote} from '../actions';
import {format} from 'date-fns'

const HomeBook = ()=>{
    const dispatch = useDispatch()
    const book = useSelector(state=>state.homeBook)
    const currentbook = useSelector(state=>state.currentBook);
    const notesBoxModal = useSelector(state => state.notesBoxModal)
    const settingModal = useSelector(state => state.settingModal)
    const savedbooks = useSelector(state => state.booksInfo)
    const userData = useSelector(state => state.userData)
    const [value, setValue] = useState(0);
    const [maxvalue, setMaxvalue] = useState(100);
    const {updatepageDB, getbookDB, updatenotesDB} = useDB();
    const [todaynote, settodaynote] = useState("")
    const [todayString, settodayString] = useState("")
    const [notes, setnotes] = useState([])

    const handleSliderChange = (event, newValue) => {
        if(newValue!==value){
           setValue(newValue); 
           dispatch(savepagenow({id:book.id, pagenow: newValue}))
            updatepageDB({mail: userData.mail, id: book.id, page: newValue})
        }
    };

    useEffect(() => {
        if(!settingModal.open && settingModal.clear===1){
          setnotes([])
          settodaynote("")
          setValue(0)
        }
      }, [settingModal])

    useEffect(() => {
        if(!notesBoxModal && book.id===currentbook.id){
            let today = format(new Date(), 'yyyy-MM-dd')
            let bookdata =  savedbooks.find(n=>n.id===book.id);
            if(bookdata?.db){
                setnotes((bookdata.db.notes&& bookdata.db.notes[0])? bookdata.db.notes.filter(n=>n.time!== today):[] ) 
                let note = bookdata.db.notes?.find(n=>n.time===today)
                settodaynote(note?.content? note.content: "")
            }
        }
      }, [notesBoxModal])

    const handleInputChange = (event) => {
        if(event.target.value==="" && value!==0){
            setValue(0)
            dispatch(savepagenow({id:book.id, pagenow: 0}))
            updatepageDB({mail: userData.mail, id: book.id, page: 0})
        }else{
            let num = Number(event.target.value);
            if(value!==num){
                setValue(num)
                dispatch(savepagenow({id:book.id, pagenow: num}))
                updatepageDB({mail: userData.mail, id: book.id, page: num})
            }
        }
    };
    const [saved, setsaved] = useState(true);
    const handleBlur = () => {
        if (value < 0) {
            setValue(0);
        } else if (value > maxvalue) {
            setValue(maxvalue);
        }
    };

    useEffect(() => {
        if(value===maxvalue){
            console.log(maxvalue)
            dispatch(rnopen(false))
            setValue(0)
        }
    }, [value])


    useEffect(() => {
        let today = format(new Date(), 'yyyy-MM-dd')
        settodayString(today);
        const fetchBook = async ()=>{
            const {data, status} = await getbookDB({mail: userData.mail, id: book.id});
            if(status===204){
                dispatch(savedbinfo({id: book.id, db: {rating: 0, review: "", notes:[], pagenow:0}}))
                setValue(0)
                setnotes([])
                settodaynote("")
                return;
            }
            if(data.pagenow){
              setValue(data.pagenow)
              dispatch(savedbinfo({id: book.id, db: data}))
            }else{
                setValue(0)
            }

            if(data.notes && data.notes[0]){
                //remove today from notes
                setnotes(data.notes.filter(n=>n.time!== today))
              }else{
                setnotes([])
              }

            let note = await data.notes?.find(n=>n.time===today)
            settodaynote((note?.content)? note.content: "")

           
        }

        if(!book.id || !userData.mail) return;
        if(book.volumeInfo && book.volumeInfo.pageCount){
            setMaxvalue(book.volumeInfo.pageCount)
        }else{
            setMaxvalue(100)
        }

        let bookdata =  savedbooks.find(n=>n.id===book.id);
        if(bookdata?.db){
            setValue(bookdata.db.pagenow? bookdata.db.pagenow: 0)
            //remove today from
            setnotes((bookdata.db.notes&& bookdata.db.notes[0])? bookdata.db.notes.filter(n=>n.time!== today):[] ) 
            let note = bookdata.db.notes?.find(n=>n.time===today)
            settodaynote(note?.content? note.content: "")
        }else{
            fetchBook()
        }

    }, [book])

    useEffect(() => {
        const updateNote = async ()=>{
            dispatch(validatenote({id: book.id, date:todayString, content: todaynote}))
            //save to db
            let bookdata = await savedbooks.find(n=>n.id===book.id);
            if(bookdata?.db.notes){
                await updatenotesDB({id: book.id, mail: userData.mail, notes: bookdata.db.notes })
            }
            setsaved(true)
            
        }
        if(!saved){
            updateNote()
        }
    }, [saved])


    return(
        <div style={{display:"flex", flexDirection:"row"}}>
        <div style={{marginTop:"10px", paddingLeft:"20px", textAlign:"left"}}>
            <p style={{fontSize:"30px", marginBottom:"5px"}} >{(book.volumeInfo.title)? book.volumeInfo.title.slice(0,21):""}</p>
            <p style={{fontSize:"14px", color:"darkgray"}}>{(book.volumeInfo.authors)? book.volumeInfo.authors[0]:""}</p>
            <div style={{paddingTop:"15px", paddingBottom:"20px", width:"650px"}} >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider style={{width:"550px"}} min={0} max={maxvalue} value={typeof value === 'number' ? value : 0} onChange={handleSliderChange}/>
                </Grid>
                <Grid item>
                    <Input style={{width:"50px"}} value={value} margin="dense" onChange={handleInputChange} onBlur={handleBlur} inputProps={{step: 10,min: 0,max: maxvalue,type: 'number'}} />
                    <span style={{color:"darkgray"}}>{(book.volumeInfo && book.volumeInfo.pageCount)?"page":"%"}</span>
                </Grid>
            </Grid>
            </div>
            <div> <List component="nav" style={{height:"140px", overflowY:"scroll"}}>
                    {(notes.length!==0)? notes.map((n,i)=>(
                        <div key={i}>
                        <ListItem style={{height:"40px"}}><span style={{color:"gray", paddingRight:"8px"}}>{n.time.replaceAll("-",'/')}</span>{n.content}</ListItem>
                        <Divider/>
                        </div>
                    )):
                        <p style={{color:"grey"}}>no previous notes</p>
                    }

            </List></div>
            <Box style={{marginTop:"20px", marginBottom:"6px"}}>
            <p style={{textAlign:"left", fontSize:"14px"}}>Your thoughts after today's reading:</p>
            <TextField helperText=' 150 words maximum' value={todaynote} onChange={e=>{
                // set max word
                if(e.target.value.length<=150){
                   settodaynote(e.target.value)
                    setsaved(false) 
                }
                
            }} fullWidth={true} multiline rows={2} placeholder="Write something..." autoFocus />
            </Box>
            {(saved)?<p><CheckIcon style={{paddingTop:"10px"}}/> It's saved</p>:<p style={{marginTop:"16px"}}><CircularProgress size={15}/> Saving...</p>}
            {/* <Button style={{marginTop:"5px"}} variant="contained" color="primary" size="small"startIcon={<CheckIcon />}>Save</Button> */}
        </div>
        <div style={{marginTop:"30px", marginLeft:"80px", width:"280px", paddingTop:"20px", display:"flex", flexDirection:"column"}}>
            <Bookshelf/>
            {/* <Button size="large" color="primary" variant="contained" style={{marginTop:"60px"}}>Finish Reading</Button>
            <Link style={{ marginTop:"18px", fontSize:"17px", color:"rgb(24, 98, 163)"}}>Take a break</Link> */}
        </div>
        </div>
    )
}

export default HomeBook;