const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  mail: {type: String, require: true},
  homebook: String,
  books:[{
    id:{type: String, require: true},
    review: String,
    pagenow:  Number,
    rating: Number,
    notes: [{
      time: String,
      content: String,
    }]
  }]
});


const UserModel = mongoose.model('User', userSchema);

const router = require('express').Router();

validateBook= async (user, id)=>{
  let index = await user.books.findIndex(n=>n.id==id);
  if(index!==-1){
    return index;
  }else{
    user.books.push({id});
    await user.save()
    return user.books.length-1
  }
} 

router.get('/login/:mail', async (req, res)=> {
  try{
    const {mail} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("You haven't signed up yet.");
    else res.status(200).send({name: user.name, mail: user.mail, homebook: user.homebook});
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/rename/:mail/:name', async (req, res)=> {
  try{
    const {mail,name} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      user.name = name;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/cleardata/:mail', async (req, res)=> {
  try{
    const {mail,name} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      user.books = [];
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/signup/:mail/:name', async (req, res)=> {
    try{
    const {mail, name} = req.params;
    const user = await UserModel.findOne({mail});
    if(user) {
      console.log(user);
      res.status(403).send('User exist.');
    }else{
        //create user
        const newuser = new UserModel({mail, name});
        await newuser.save();
        res.status(200).send('');
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/sethomebook/:mail/:id', async (req, res)=> {
  try{
    const {mail, id} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      user.homebook = id;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/removehomebook/:mail', async (req, res)=> {
  try{
    const {mail} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      user.homebook = null;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/ratebook/:mail/:id/:rating', async (req, res)=> {
  try{
    const {mail, id, rating} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      const index = await validateBook(user, id)
      user.books[index].rating = rating;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/updatepage/:mail/:id/:page', async (req, res)=> {
  try{
    const {mail, id, page} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      const index = await validateBook(user, id)
      user.books[index].pagenow = page;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/updatereview/:mail/:id/:review', async (req, res)=> {
  try{
    const {mail, id, review} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      const index = await validateBook(user, id)
      user.books[index].review = review;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.post('/updatenotes/:mail/:id/:notes', async (req, res)=> {
  try{
    const {mail, id, notes} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      const index = await validateBook(user, id)
      let newnotes = JSON.parse(notes)
      user.books[index].notes = newnotes;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});


router.post('/deletereview/:mail/:id', async (req, res)=> {
  try{
    const {mail, id} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{
      const index = await validateBook(user, id)
      user.books[index].review = null;
      await user.save();
      res.status(200).send("ok")
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});

router.get('/getbook/:mail/:id', async (req, res)=> {
  try{
    const {mail, id} = req.params;
    const user = await UserModel.findOne({mail});
    if(!user) res.status(404).send("No such user");
    else{ 
      let data =  user.books.find(n=>n.id==id)
      if(!data){
        res.status(204).send({})
      }else{
        res.status(200).send(data)
      }
    }
  }catch(err){
    console.log(err)
    res.status(400).send("server is having some trouble.");
  }
});




module.exports = router;