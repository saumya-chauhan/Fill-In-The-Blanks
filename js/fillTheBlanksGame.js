function playGame() {
    gameStart.style.display = "block";
}
var score; // Number of game played in each sessions
var country_list; //list of country present in countryList.js file
var textChoosed; // text dragged from keyboard
var lifeline; // chances for trying wrong letter
var level; // total 2 levels in game
var match; // the correct letter of the fill in the blank, where the dragged letter is dropped
var total_country; //total country 
var country; // country choosed in one sessions
var country_length; // length of country choosed
var countDownMin; // timer that is counting down in each game
var currentCountryPos;

if(!localStorage.maxscore){
    localStorage.maxscore = 0;
} else{
    localStorage.maxscore = Number(localStorage.maxscore)
}// maximum score in games
var player = {}; // array of scores in eah session
player[0] = localStorage.maxscore; 

var gameModal = document.getElementById('gameModal');
var gameStart = document.getElementById('gameStart');
var modalHeader = document.getElementById("modalHeader");
var modalBody = document.getElementById("modalBody");
document.getElementById("HightestPoint").innerHTML = localStorage.maxscore; 
 
generateKeyBoard();

window.onclick = function(event) {
    if (event.target == gameModal || event.target == gameStart) {
        startNextGame();
    }
}
function startNextGame() {
    score = 0;
    lifeline = 5;
    level = 1;
    debugger;
    countDownMin = 20;
	country_list = Main.country_list;
    country_list = shuffleArray(country_list);
    total_country = country_list.length;
    currentCountryPos = 0;
    gameModal.style.display = "none";
    gameStart.style.display = "none";
    document.getElementById("lifeline").innerHTML = lifeline;
    generateBlanks();
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;   
}

function generateKeyBoard(){
    var blockDiv;
    var letter = 'A';
    var container = document.getElementById("flex-container");
    for (var i = 1; i < 26; i++) {
        blockDiv = document.createElement("div");
        blockDiv.setAttribute("id", "drag"+i.toString());
        blockDiv.setAttribute("draggable", "true");
        blockDiv.innerHTML = letter;
        letter = String.fromCharCode(letter.charCodeAt()+1);
        container.append(blockDiv);
    }
}

document.addEventListener("dragstart", function(event) {
    // The dataTransfer.setData() method sets the data type and the value of the dragged data
    event.dataTransfer.setData("Text", event.target.id);
    var textData = event.dataTransfer.getData("Text");
    textChoosed = document.getElementById(textData).textContent;

});
document.addEventListener("dragenter", function(event) {
    if (event.target.className == "droptarget") {
        event.target.style.backgroundColor = "#A9A9A9";

    }
});
// By default, data/elements cannot be dropped in other elements. To allow a drop, we must prevent the default handling of the element
document.addEventListener("dragover", function(event) {
    event.preventDefault();
});
// When the draggable p element leaves the droptarget, reset the DIVS's border style
document.addEventListener("dragleave", function(event) {
    if (event.target.className == "droptarget") {
        event.target.style.backgroundColor = "#f1f1f1";
    }
});
document.addEventListener("drop", function(event) {
    event.preventDefault();
    if (event.target.className == "droptarget") {
        var place = event.target.id;
        match = country[place].toUpperCase();
        if (textChoosed == match) {
            event.target.style.backgroundColor = "#71da71";
            setTimeout(function() {
                event.target.style.backgroundColor = "#f1f1f1"
            }, 200);
        } else {
            event.target.style.backgroundColor = "#ff9980"
            setTimeout(function() {
                event.target.style.backgroundColor = "#f1f1f1"
            }, 200);
            document.getElementById("lifeline").innerHTML = lifeline - 1;
            lifeline = lifeline - 1;
        }
        if (textChoosed == match) event.target.innerHTML = textChoosed;


    }

    checkCountry();

});

function generateBlanks() {
    timerFunction();
    country = country_list[currentCountryPos];
    currentCountryPos++;
    country_length = country.length;
    total_country = total_country - 1;

    var container = document.getElementById("flex-ques");
    var blockDiv; // used in the for loop
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    if(level<2){
    for (var i = 0; i < country_length; i++) {
        blockDiv = document.createElement("div");
        blockDiv.setAttribute("id", i.toString());
        if (i % 2 == 1) {
            blockDiv.classList.add("droptarget");
        }
        if (i % 2 == 0) {
            blockDiv.append(country[i].toUpperCase());
        }
        container.append(blockDiv);
    }
    }
    else{
        for (var i = 0; i < country_length; i++) {
            blockDiv = document.createElement("div");
            blockDiv.setAttribute("id", i.toString());
            if (['a', 'e', 'i', 'o', 'u'].indexOf(country[i].toLowerCase()) !== -1) {
                blockDiv.append(country[i].toUpperCase());
            } else {
                blockDiv.classList.add("droptarget");
            }
            container.append(blockDiv);
        }
    
    }

    document.getElementById("Score").innerHTML = score;
    document.getElementById("level").innerHTML = level;

}

function checkCountry() {
    var countryStr = "";
    var container = document.getElementById("flex-ques");
    for (var i = 0; i < country_length; i++) {
        var lette = container.getElementsByTagName("div")[i].textContent;
        if (lette == null)
            countryStr += " ";
        else
            countryStr += lette;
    }
    country = country.toUpperCase();
    if (countryStr == country) {
        myStopFunction();
        countDownMin = 20;
        score++;
        if (total_country == 0) {
                modalHeader.innerHTML = "Game Over";
                modalBody.innerHTML = "You did brilliant Job!!</br>Scored Hightest Point:"+country_list.length;
                gameModal.style.display = "block";

        } else if (score == 2) {
            setTimeout(function() {
                modalHeader.innerHTML = "Hurray";
                modalBody.innerHTML = "Promoted to next Level";
                gameModal.style.display = "block";
                setTimeout(function() {
                    gameModal.style.display = "none";
                    level = 2;
                    document.getElementById("level").innerHTML = level;
                    generateBlanks();
                }, 1000);
            }, 300);
        } else {
                generateBlanks();
        }
    } else if (lifeline == 0) {
        myStopFunction();
                modalHeader.innerHTML = "Game Over";
                modalBody.innerHTML = "Level: "+level+"/2</br>Score: "+score+"/"+country_list.length+"<br>Max points: "+localStorage.maxscore;
                gameModal.style.display = "block";
    }
}

function timerFunction() {
    myvar = setInterval(function() {
        document.getElementById("displayTimer").innerHTML = countDownMin;
        if (countDownMin == 0) {
            myStopFunction();
                if (score > localStorage.maxscore) {
                    localStorage.maxscore = score;
                    document.getElementById("HightestPoint").innerHTML = localStorage.maxscore;    
                    modalHeader.innerHTML = "You Won";
                    modalBody.innerHTML = "New High Score: "+localStorage.maxscore;
                    gameModal.style.display = "block";
                } else {
                    modalHeader.innerHTML = "Game Over";
                    modalBody.innerHTML = "Level: "+level+"/2</br>Score: "+score+"/"+country_list.length+"<br>Max points: "+localStorage.maxscore;
                    gameModal.style.display = "block";
                }
        }
        countDownMin = countDownMin - 1;
    }, 1000);
}

function myStopFunction() {
    clearInterval(myvar);
}
