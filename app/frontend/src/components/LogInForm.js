import ColorTheme from '../ColorTheme';
import { ThemeProvider } from '@material-ui/styles';
import {DialogTitle, Dialog, Button, CircularProgress, LinearProgress, DialogContent, FormControlLabel, Checkbox} from '@material-ui/core';
import GoogleLogin from 'react-google-login';
import { useState} from 'react';
import {Result, message} from 'antd';
import Alert from '@material-ui/lab/Alert';
import useDB from '../hooks/useDB';
import useApi from '../hooks/useApi';
import {useSelector, useDispatch} from 'react-redux';
import {login, lclose, refresh, sopen, loadBookshelves, sethomebook, loadDefaultshelves, setcurrentshelf, setremember} from '../actions';

const LogInForm = ()=>{
    const dispatch = useDispatch()
    const logInModal = useSelector(state => state.logInModal)
    const rememberme = useSelector(state => state.rememberme)
    const logIn = useSelector(state => state.logIn)
    const {loginDB, getbookDB} = useDB();
    const {getMyBooks, getOneBookshelf, getDetail} = useApi();
    const handleClose = () => {
      dispatch(lclose())
      setresult({state:"waiting", data:{}})
    };

    const handlecheckbox = e=>{
      dispatch(setremember(e.target.checked))
    }

    const [result, setresult] = useState({state:"waiting", data:{}});
    const loginsuscess = async (res)=>{
      if(logIn){
        dispatch(refresh(res.tokenObj.access_token))
      }else{
        if(rememberme){
          localStorage.setItem("user","exist")
        }else{
          localStorage.removeItem("user")
        }
        const {data, status} = await loginDB(res.profileObj.email);
        if(status===200) {
          data.logo = res.profileObj.imageUrl; 
          data.token = res.tokenObj.access_token;
          setresult({state:"sucess", data})
          if(data.homebook){
            const homebookNotes = await getbookDB({mail: data.mail, id: data.homebook});
            let homebookInfo = await getDetail(data.homebook);
            if(homebookInfo.status<300){
              if(homebookNotes===200){
                homebookInfo.data.myInfo = homebookNotes.data;
              }
              dispatch(sethomebook(homebookInfo.data))
            }
          } 
          const {data2, status2} = await getMyBooks(res.tokenObj.access_token);
          if(status2===200){
            //get default shelf
            const shelf2 = await getOneBookshelf(2, res.tokenObj.access_token);
            const shelf3 = await getOneBookshelf(3, res.tokenObj.access_token);
            const shelf8 = await getOneBookshelf(8, res.tokenObj.access_token);
            if(shelf3.status===200 && shelf3.data!=="") dispatch(loadDefaultshelves({id: 0, books: shelf3.data}));
            if(shelf2.status===200 && shelf2.data!=="") dispatch(loadDefaultshelves({id: 1, books: shelf2.data}));
            if(shelf8.status===200 && shelf8.data!=="") dispatch(loadDefaultshelves({id: 2, books: shelf8.data}));
            let bookshelves = data2.map(n=>({id: n.id, title: n.title, volumeCount: n.volumeCount}))
            dispatch(loadBookshelves(bookshelves))
            dispatch(setcurrentshelf({shelf: bookshelves[5], pos: 0}))
            dispatch(login(data))
            setTimeout(() => {
              handleClose()
              message.success({content: "You have logged in.", style:{marginTop:"90vh"}})
            
            }, 500);
            
        }else{
          setresult({state:"fail", data:{error: ' google book error'}})
        }
      }else setresult({state:"fail", data:{error:"server is not responding."}})

      }
    }




    const loginfail = (res)=>{ setresult({state:"waiting", data:{error:res.error}})}
    return(
        <ThemeProvider theme={ColorTheme}>
        <div>
      <Dialog open={logInModal} onClose={(result.state==="sucess")? ()=>{}:handleClose} >
        <DialogTitle  style={{textAlign:"center", padding:"20px"}}>Log In</DialogTitle>
        <DialogContent >
            {(result.state==="waiting")?
            <div style={{width:"260px"}} >
               {(logInModal===3)? <></>: <div style={{height:"30px"}} ></div>}
              
              <div style={{marginBottom:"50px"}} >
              <GoogleLogin
                className="googlelogin"
                // clientId="718102756088-h4uacaq2f52dma502uobr6jal9vlekqn.apps.googleusercontent.com"
                clientId="718102756088-ll70ob41ab243vlqqd9f86drvp9ms6rt.apps.googleusercontent.com"
                buttonText="Login with your Google Account"
                // onClick={()=>{setresult({state:"loading", data:{}})}}
                onSuccess={loginsuscess}
                onFailure={loginfail}
                onRequest={()=>{setresult({state:"loading", data:{}})}}
                cookiePolicy={'single_host_origin'}
                scope={"https://www.googleapis.com/auth/books"}
                isSignedIn={rememberme}
              />
              {(logInModal===3)? <></>: <FormControlLabel
                  control={<Checkbox checked={rememberme} onChange={handlecheckbox} style={{color:"rgb(24, 98, 163)"}} />}
                  label="remember me"
                  labelPlacement="end"
                  style={{marginLeft:"45px", marginTop:"40px", color:"grey"}}
              />}
              {result.data.error? <div style={{margin:"10px", height:"15px"}}><Alert severity="error">{result.data.error}</Alert></div>:<></>}
              </div>
            </div>:
            <div style={{height:"350px", width:"310px", overflowY:"hidden"}} >
              {(result.state!=="loading")? (result.state==="fail")? <Result
                status="error" title={result.data.error}
                subTitle={`You can sign up an account right now.`}
                extra={[
                  <Button onClick={()=>{
                    handleClose();
                    dispatch(sopen())
                    }} style={{marginLeft:'5px', color:"rgb(44, 156, 231)"}}>Sign Up</Button>
                ]}
              />: <Result
                icon={<img style={{borderRadius:"50%"}} alt="profile" src={result.data.logo} />}
                title={`Hi, ${result.data.name} !`}
                subTitle={`Welcome to your bookTracker. Redirecting ...`}
                extra={[
                // <Link style={{ fontSize:"14px", color:"rgb(24, 98, 163)"}} onClick={handleClose} >close</Link>
                <LinearProgress key={0} color="primary" />
                ]}
              />:<div style={{marginLeft:"133px", marginTop:"110px"}} >
                <CircularProgress />
              </div> }
              </div>}

            {/* <FormControl>
            <TextField
            style={{height:"70px", width:"300px", padding:"20px"}}
            autoFocus
            type="email"
            placeholder="email"
          />
          <TextField
            type="password"
            style={{height:"70px", width:"300px", padding:"20px"}}
            placeholder="password"
          />
          <Button onClick={()=>{
              setlogin(true);
              setopen(false)
            }} style={{marginTop:"40px", marginBottom:"30px",color:"#FFFFFF", backgroundColor:"#37474F"}}>Log In </Button>
            </FormControl> */}
            {(result.state==="waiting" && logInModal!==3)? <p style={{color:"grey", marginLeft:'10px'}}>Doesn't have an account?
            <Button onClick={()=>{
              handleClose();
              dispatch(sopen())
              }} style={{marginLeft:'5px', color:"rgb(44, 156, 231)"}}>Sign Up</Button></p>:<></>}
        </DialogContent>
      </Dialog>
    </div>
    </ThemeProvider>
    )
}

export default LogInForm;