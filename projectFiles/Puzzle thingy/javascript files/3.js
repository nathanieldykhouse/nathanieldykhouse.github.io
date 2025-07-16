var keystrokes = [];

document.addEventListener('keydown', function(event){
    keystrokes.push(event.key);
    checkValidity();
});

function checkValidity(){
    let correctCombination = ['ArrowUp', "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a", "Enter"];
    for(let i = 0; i < keystrokes.length; i++){
        if(keystrokes[i] != correctCombination[i]){
            keystrokes = [];
            alert("Oops, not quite right! Entry reset.");
        } else if(correctCombination[i] == "Enter"){
            document.getElementById("nextPageLink").style.visibility = "visible";
        }
    }
}