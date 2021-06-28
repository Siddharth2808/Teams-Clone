const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const User = require('../models/user');
const Room = require('../models/room');
const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const homeController = require('../controller/home_controller');
const { localsName } = require('ejs');
let chat=0;

router.get('/', homeController.home);

router.post('/home', passport.checkAuthentication, homeController.create);

router.post('/join', passport.checkAuthentication, homeController.join);

router.get('/:room/home', async (req, res) => {
  if(req.user != undefined){
  try{ 
  let op=0;
  for(roomop of req.user.rooms)
  {
    if(req.params.room==roomop) {op=1;}
  }
    if(op==1){
      let users = [];
      let roomopp = await Room.findById(req.params.room);
      for(user of roomopp.users)
         {
            let useropp = await User.findById(user);
              users.push( useropp );
         }
         let posts = await Post.find({room:roomopp})
         .sort('-createdAt')
         .populate('user')
         .populate({
             path: 'comments',
             populate: {
                 path: 'user'
             }
         });
         console.log(posts);

    res.render('roomhome', { roomId: req.params.room,users:users, userop:req.user._id, roomop:roomopp, posts:  posts})}
    else res.send("Team does not exists");}
  catch(err){
    return;
}
}
else res.send("sign in to access teams");
})

router.get('/:room', (req, res) => {
  if(req.user != undefined){
    try{ 
    let op=0;
    for(roomop of req.user.rooms)
    {
      if(req.params.room==roomop) {op=1;}
    }
      if(op==1){
      res.render('room', { roomId: req.params.room ,layout: 'room',chat: chat        })}
      else res.send("Team does not exists");}
    catch(err){
      return;
  }
  }
  else res.send("sign in to access teams");
  })

  router.use('/users', require('./users'));

  router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));

  module.exports = router;