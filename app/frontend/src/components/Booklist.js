import React from 'react';
import {ImageList, ImageListItem,ImageListItemBar, Tooltip} from '@material-ui/core/' 
import useWindowSize from '../hooks/useWindowSize';
import {useSelector, useDispatch} from 'react-redux';
import {bopen, setcurrentbook,nbopen, setcurrentshelf, sethomebook, rnopen} from '../actions';
import {Empty, message} from 'antd';
import info_icon from '../images/info_icon.svg'
import read_icon from '../images/read_icon.svg'

export default function Booklist({pos, title, info}) {
    const dispatch = useDispatch()
    const {width} = useWindowSize();
    const defaultshelves = useSelector(state => state.defaultshelves);
    const bookshelves = useSelector(state=>state.bookshelves)
    const homebook = useSelector(state=>state.homeBook)
    
    const showBookInfo = e => {
      dispatch(setcurrentbook(defaultshelves[pos][e.target.id]))
      dispatch(bopen())
    };

    const readnow = e => {
      if(homebook.id!==null && pos!==0){
        dispatch(setcurrentbook(defaultshelves[pos][e.target.id]))
        dispatch(rnopen(true))
      }else{
        dispatch(sethomebook(defaultshelves[pos][e.target.id]))
        message.success({content: `You have started reading.`, style:{marginTop:"90vh"}})
      }
      
    };

    const showNotes = e => {
      if(info) dispatch(setcurrentshelf({shelf:(pos===0)? bookshelves[2]:bookshelves[1], pos:(pos===0)? 2:1 } ))
      dispatch(setcurrentbook(defaultshelves[pos][e.target.id]))
      dispatch(nbopen())
    };

  return (
    <div style={{marginLeft:"20px"}} >
        <p style={{fontSize:"20px",height:"30px", textAlign:"left", paddingTop:"30px", paddingBottom:"20px"}}>{title}</p>
      <ImageList rowHeight={205} cols={width/168} gap={40} style={{flexWrap:"nowrap"}}>
        {(defaultshelves[pos].length===0)? 
          <ImageListItem key={-1}>
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="no book" style={{paddingTop:"30px"}} />
          </ImageListItem>
         : defaultshelves[pos].map((n, i) => (
          <ImageListItem key={i}>
            {(info)? <ImageListItemBar style={{backgroundColor:"transparent", zIndex:1}} position="top" actionIcon={
                <>
                <Tooltip title="read now" >
                  <img id={i} onClick={readnow} className='readicon' src={read_icon} style={{marginTop:"0px", height:'27px', width:"27px"}}/>
                </Tooltip>
                <Tooltip title="show info">
                  <img id={i} onClick={showBookInfo} className='readicon' src={info_icon} style={{marginTop:"0px", height:'25px', width:"25px" }}/>
                </Tooltip>
                </>
            } />:<></>}
              <img className='hover' id={i} onClick={(info)? showNotes: showBookInfo} alt={(n.volumeInfo.title)? n.volumeInfo.title.slice(0,25):""} src={(n.volumeInfo.imageLinks)? n.volumeInfo.imageLinks.thumbnail:"" } style={{height:"198px", width:"128px"}} />
          </ImageListItem>
        ))}
      </ImageList>
    </div>
  );
}
