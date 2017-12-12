// referenca na globalni objekat
var self = this;

document.getElementById("add").addEventListener("click", addCityForCheck);
document.getElementById("check").addEventListener("click", checkResult);
document.getElementById("progress").style.display = 'none';
document.getElementById("gameOver").style.display = 'none';

//inicijalni poziv da se dobiju podaci
loadData()
    .then(function(response) {
        self.data = JSON.parse(response);
        self.data.choosenPlaces = [];
        startTimer(self.data.vreme);
        document.getElementById("select").innerHTML = showCity(self.data.ponudjene);
        document.getElementById("region").innerHTML = "OBLAST : " + self.data.oblast;
    });

function loadData() {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://raw.githubusercontent.com/VukTodoric/podaci/master/podaci.json', true);
        xhr.onload = function() {
            if(xhr.status === 200) {
            resolve(xhr.response);
            }
        };
        xhr.send();
    });
}

//prikazuje sve gradove u selectu
function showCity(cityList){
    var printThis = "";
    for(var i = 0; i < cityList.length; i++){
        printThis += "<option>" + cityList[i] + "</option>";
    }
    return printThis;
}

function showChoosen(cityList){
    var printThis = "";
    for(var i = 0; i < cityList.length; i++){
        printThis += "<button onclick='removeCity(this)'>" + cityList[i] + "</button>";
    }
    return printThis;
}

function addCityForCheck() {
    var choosen = document.getElementById("select").value;
    loadData()
        .then(function () {
            if(!self.data.choosenPlaces.includes(choosen)) {
                self.data.choosenPlaces.push(choosen);
            }
            document.getElementById("cities").innerHTML = showChoosen(self.data.choosenPlaces);
        })
}

function removeCity(thisCity) {
    loadData()
        .then(function () {
            var index = self.data.choosenPlaces.indexOf(thisCity.textContent);
            self.data.choosenPlaces.splice(index, 1);
            document.getElementById("cities").innerHTML = showChoosen(self.data.choosenPlaces);
        })
}

function checkResult() {
    var correctAnswers = [];
    self.data.choosenPlaces.forEach(function (city) {
        if(self.data.tacno.includes(city)) {
            correctAnswers.push(city);
        }
    });
    return showProgress(correctAnswers.length);
}

function showProgress(correctAnswers) {
    document.getElementById("main").style.display = 'none';
    document.getElementById("progress").style.display = 'block';
    if (correctAnswers != 0) {
        var percentValue = 100 * correctAnswers / self.data.tacno.length;
        document.getElementById('content').style.width = percentValue + '%';
        document.getElementById("result").innerHTML = "<h3>" + percentValue + "%" + "</h3>"
    } else {
        document.getElementById("result").innerHTML = "<h3>Nemaš tačnih odgovora... :(</h3>"
    }
}

function startTimer(time) {
    setInterval(function () {
        document.getElementById("timer").innerHTML = "VREME : " + time + "s ";
        time--;
        if(time === 0) {
            document.getElementById("main").style.display = 'none';
            document.getElementById("progress").style.display = 'none';
            document.getElementById("gameOver").style.display = 'block';
        }
    }, 1000);
}
