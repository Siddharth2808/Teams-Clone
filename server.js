const express = require('express')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-parser');
let chat = 0;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
// used for session cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
// const passportJWT = require('./config/passport-jwt-strategy');
// const passportGoogle = require('./config/passport-google-oauth2-strategy');

const MongoStore = require('connect-mongo')(session);



const { v4: uuidV4 } = require('uuid')

const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
app.set('view engine','ejs');
app.use(express.static('assets'))

app.use(express.urlencoded());

app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set("layout room", false);
app.set("layout roomhome", false);

app.use('/peerjs', peerServer);



app.use(session({
  name: 'codeial',
  // TODO change the secret before deployment in production mode
  secret: 'blahsomething',
  saveUninitialized: false,
  resave: false,
  cookie: {
      maxAge: (1000 * 60 * 100)
  },
  store: new MongoStore(
      {
          mongooseConnection: db,
          autoRemove: 'disabled'
      
      },
      function(err){
          console.log(err ||  'connect-mongodb setup ok');
      }
  )
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

  io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
       socket.join(roomId);
       socket.broadcast.to(roomId).emit('user-connected', userId);
       socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId);
    })
    socket.on('screen-share', (Id) => {
        socket.broadcast.to(roomId).emit('screen-share', Id);
    })
       socket.on('message', message=>{
           io.to(roomId).emit('createMessage', message);
       })
    })
  })

  app.use('/', require('./routes'));




server.listen(process.env.PORT||3030);