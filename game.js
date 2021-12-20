const buttonColours = ["red" , "blue" , "green" , "yellow"];
let gamePattern = [];
let userClickedPattern = [];

let started = false;
let level = 1;

$(document).dblclick(function(){
    if(!started){
        started = true;
        nextSequence();
    }
});

$(".btn").click(function(event){
    if(started == true){
        let userChosenColour = $(this).attr("id");
        userClickedPattern.push(userChosenColour);
        playSound(userChosenColour);
        animatePress(userChosenColour);
        checkAnswers(userClickedPattern.length - 1);
    }
});


function nextSequence(){
    $("#level-title-two").text('')
    userClickedPattern = [];
    $("#level-title").text("Level " + level);
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(200).fadeOut(200).fadeIn(200);
    playSound(randomChosenColour);
    level++;
}

function playSound(name){
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColour){
    $("#" + currentColour).addClass("pressed");
    setTimeout(function(){
        $("#" + currentColour).removeClass("pressed");
    },100)
}

function checkAnswers(gameLevel){
    if(gamePattern[gameLevel] === userClickedPattern[gameLevel]){
        console.log("its correct");
        if(gamePattern.length === userClickedPattern.length){
            setTimeout(function(){
                nextSequence();
            },1000);
        }
    }else{
        $("#level-title").text("GAME OVER");
        $("#level-title-two").text("Double Click To Restart").css("line-height" , "150%");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200);
        startOver();
    }
}

function startOver(){
    level = 1; 
    gamePattern = [];
    started = false;
}

