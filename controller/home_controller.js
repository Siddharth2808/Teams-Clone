const User = require('../models/user');
const Room = require('../models/room');

module.exports.create = async function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    try{
        let user = await User.findById(req.user._id);
            if(user){
            let room = await Room.create({
                password: req.body.password,
                name: req.body.name,
            });
            console.log(req.user._id);
            room.users.push(req.user._id);
            room.save();
            user.rooms.push(room);
            user.save();
            // if (req.xhr){
            //     // Similar for comments to fetch the user's id!
            //     comment = await comment.populate('user', 'name').execPopulate();
    
            //     return res.status(200).json({
            //         data: {
            //             comment: comment
            //         },
            //         message: "Post created!"
            //     });
            // }


            res.redirect(`/${room._id}/home`);}
        
    }catch(err){
        return;
    }
    
}



module.exports.home = async function(req, res){
    let teams = [];
    try{
         // populate the user of each post
         if(req.user != undefined){
         for(rooms of req.user.rooms)
         {
            let team = await Room.findById(rooms);
            console.log(team);
              teams.push( team );
         }
        }

        return res.render('home', {
            title: "Codeial | Home",
            teams:  teams,
        });

    }catch(err){
        console.log('Error', err);
        return;
    }
   
}


module.exports.join = function(req, res){
   
    Room.find({ _id: req.body.name, password: req.body.password },async function(err, room) {
        if(err){
            res.send("Invalid Room ID" );
        } else {
            if (room.length === 0) {
               res.send("Wrong Room Id or Password");
            } else {
                let user =  await User.findById(req.user._id);let now=0;
                for(usernow of room[0].users)
                {
                    if(""+usernow==""+user._id) {console.log("op");now=1;}
                }
                if(now===0) {
                room[0].users.push(req.user._id);
                room[0].save();
                user.rooms.push(room[0]);
                user.save();
                res.redirect(`/${room[0]._id}/home`);}
                else {
                    res.send("Already in Team");
                }
            }
        }

    });

}