const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:Jaimakarani2808@cluster0.3zzgx.mongodb.net/Zoom-clone');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to MongoDB"));


db.once('open', function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports = db;