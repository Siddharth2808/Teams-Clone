const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.create = async function(req, res){
    console.log(req.body.room);
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
            room: req.body.room
        });
        if (req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user', 'name').execPopulate();

            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created!"
            });
        }

        return res.redirect('back');

    }catch(err){
        
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}


module.exports.destroy = async function(req, res){

    try{
        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post: req.params.id});


            if (req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

       

            return res.redirect('back');
        }else{
            
            return res.redirect('back');
        }

    }catch(err){
        
        return res.redirect('back');
    }
    
}