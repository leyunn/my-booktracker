import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {Button, Menu, MenuItem} from '@material-ui/core'
import {useSelector, useDispatch} from 'react-redux';
import {copen, sbopen } from '../actions';
import SettingBox from './SettingBox';

export default function MenuPopupState() {
  const dispatch = useDispatch()
  const userData = useSelector(state => state.userData)
  return (
    <>
    <PopupState variant="popover" >
      {(popupState) => (
        <>
          <Button startIcon={<img style={{borderRadius:"50%", height:"20px", width:"20px"}} src={userData.logo} />}  {...bindTrigger(popupState)} style={{ fontSize: (userData.name.length>11)?`${(userData.name.length/(userData.name.length-7))/2.5}vw`:"" }}>
            {userData.name}
          </Button>
          <Menu {...bindMenu(popupState)}>
            <MenuItem onClick={()=>{
              dispatch(sbopen())
              popupState.close()
            }
              
              }>Settings</MenuItem>
            <MenuItem onClick={()=>{dispatch(copen('log out'))}}>Log out</MenuItem>
          </Menu>
        </>
      )}
    </PopupState>
     <SettingBox />
     </>
  );
}