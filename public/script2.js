function reply_click(clicked_id) {
    let text =document.getElementById("text");
    var url ="https://shrouded-eyrie-63520.herokuapp.com/"+text.value+"/home";
    window.open(url);
}