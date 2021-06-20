function reply_click(clicked_id) {
    let text =document.getElementById("text");
    var url = "http://localhost:3030/" + text.value;
    window.open(url);
}