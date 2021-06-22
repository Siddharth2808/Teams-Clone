

function reply_click(clicked_id) {
    let text =document.getElementById("text");
    var url ="http://localhost:3030/"+text.value+"/home";
    window.open(url);
}


function createDynamicURL(team)
{
    //The variable to be returned
    var URL = "/"+team+"/home";

     
    

    return URL;
}


function RedirectURL(team)
{
    window.location= createDynamicURL(team);
}