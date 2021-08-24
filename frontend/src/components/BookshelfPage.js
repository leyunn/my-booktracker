import { useState, useEffect, useRef } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ImageList, ImageListItem, ImageListItemBar, Tooltip} from '@material-ui/core/' 
import useApi from '../hooks/useApi';
import {Skeleton} from '@material-ui/lab';
import info_icon from '../images/info_icon.svg'
import read_icon from '../images/read_icon.svg'
import {message} from 'antd';

import {bopen, setcurrentbook, nbopen, loadbooks,sethomebook,rnopen, setcurrentshelf } from '../actions';

const BookshelfPage = ()=>{
    const dispatch = useDispatch();
    const gridRef = useRef(null)
    const {getOneBookshelf} = useApi();
    const currentshelf = useSelector(state => state.currentshelf)
    const bookshelves = useSelector(state => state.bookshelves)
    const homebook = useSelector(state=>state.homeBook)
    const [stat, setstat] = useState('loading')
    const userdata = useSelector(state => state.userData)

    const showBookInfo = e => {
        dispatch(setcurrentbook(currentshelf.books.data[e.target.id]))
        dispatch(bopen())
    };
    
    const readnow = e => {
        if(homebook.id!==null){
            dispatch(setcurrentbook(currentshelf.books.data[e.target.id]))
            dispatch(rnopen(true))
        }else{
            dispatch(sethomebook(currentshelf.books.data[e.target.id]))
            message.success({content: `You have started reading. Check out your home page`, style:{marginTop:"90vh"}})
        }
        
    };

    const showNotes = e => {
        dispatch(setcurrentbook(currentshelf.books.data[e.target.id]))
        dispatch(nbopen())
    };

    useEffect(() => {
        async function fetchData(){
            const {data, status} = await getOneBookshelf(currentshelf.id, userdata.token)
            if(status<300){
                dispatch(loadbooks({books: (data==="")?[]:data , pos:currentshelf.pos}))
                setstat('ok')
            }else{
                setstat('error')
            }
        }
        if(currentshelf.pos===-1){
            dispatch(setcurrentshelf({shelf:bookshelves[0], pos:0}))
        }else if(!bookshelves[currentshelf.pos].books && userdata.token){
            setstat('loading')
            fetchData()
        }else{
            setstat('ok')
        }
    }, [currentshelf])


    return(
        <div>
            <p style={{textAlign:"left",fontSize:'26px', color:"#37474F"}} >{currentshelf.title}</p>
            <div ref={gridRef} style={{ height:"630px", overflowY:"scroll"}}>
                <ImageList cols={(gridRef.current)? gridRef.current.offsetWidth/138.3: 8} rowHeight={250} gap={12.6} >
                    {(stat==='loading' || !bookshelves[currentshelf.pos].books)? 
                    [...Array(currentshelf.volumeCount)].map((n,i)=>(
                        <ImageListItem key={i} >
                            <Skeleton variant="rect" height={198} width={128} ></Skeleton>
                        </ImageListItem>
                    )): (stat==='error')?
                        <ImageListItem>
                            server error
                        </ImageListItem>:
                    currentshelf.books.data.map((n,i)=>(
                        <ImageListItem key={i} >
                            <ImageListItemBar style={{backgroundColor:"transparent", zIndex:1}} position="top" actionIcon={
                                <>
                                <Tooltip title="read now" >
                                  <img id={i} onClick={readnow} className='readicon' src={read_icon} style={{marginTop:"0px", height:'27px', width:"27px"}}/>
                                </Tooltip>
                                <Tooltip title="show info">
                                  <img id={i} onClick={showBookInfo} className='readicon' src={info_icon} style={{marginTop:"0px", height:'25px', width:"25px" }}/>
                                </Tooltip>
                                </>
                            } />
                            <img className='hover' onClick={showNotes} id={i} alt={(n.volumeInfo.title)? n.volumeInfo.title.slice(0,25):""} src={(n.volumeInfo.imageLinks)? n.volumeInfo.imageLinks.thumbnail:"" } style={{height:"198px", width:"128px"}} />
                        </ImageListItem>
                    ))
                    }
                </ImageList>
            </div>

        </div>
    )
}

export default BookshelfPage;