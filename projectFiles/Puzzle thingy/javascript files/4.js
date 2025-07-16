const answer = "intended"

function giveHint(){
    alert("Ceaser Salad");
}

function checkAnswer(){
    let givenAnswer = document.getElementById("entryBox").value;
    for(let i = 0; i < givenAnswer.length; i++){
        if(answer[i] != givenAnswer[i]){
            alert("Sorry! Not correct!");
            document.getElementById("entryBox").value = "";
            return;
        } else if(i == givenAnswer.length-1){
            document.getElementById("endingText").style.visibility = "visible";
        }
    }
}