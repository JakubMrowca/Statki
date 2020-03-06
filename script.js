//skrypt czeka az plik HTML będzie gotowy(załaduje się). Kiedy HTML będzie gotowy uruchomiona zostanie funkcja start
window.addEventListener("DOMContentLoaded", start);

//Deklaracja zmiennych globalnych
var maxComputerTry = 30;
var computerTry = 0;
var fourMastCount = 1;
var threeMastCount = 2;
var twoMastCount = 3;
var oneMastCount = 4;
var moveHistory = [];
var computersSunkShip = 0;
var playersSunkShip = 0;
var lastComputerMove = null;
var lastComputerDirectory = null;

//Czysta tablica gracz
var yourBoardArray = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//Czysta tablica komputer
var computerTable = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

//Funkcja uruchamiana po załadowaniu strony
function start() {

    //funkcja tworzy wizualną tabele gracza na podstawie tablicy dwu wymiarowej yourBoardArray
    createTable(yourBoardArray);

    //pobranie elementu (przycisku) z pliku html o id = start;
    var button = document.querySelector("#start");
    //dodanie do przycisku reakcji na zdarzenie clikc
    button.addEventListener("click", function() {
        if (enoughtShips(yourBoardArray) == false) {
            alert("Nie poprawna ilość statków!")
            return;
        } else
            startGame(); // Jeśli ilość statków jest poprawna rozpocznij rozgrywke
    });
    var buttonClear = document.querySelector("#clear");
    buttonClear.addEventListener("click", function() {
        //czyszczenie tablicy
        var yourBoardArray = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        if (document.contains(document.getElementById("playerTable"))) {
            document.getElementById("playerTable").remove();
        }
        createTable(yourBoardArray);
    });
    //sprawdzenie i ustawienie liczby wymaganych do rozmieszczenia statków
    checkShipCondition(0, 0, 0, 0);
}

var moveHas;
var tura = 1;

function startGame() {
    //zostaje wygenerowana tablica dwuwymiarowa przez algorytm
    generateBoard();
    //na podstawie wygenerowanej tablicy dwuwymiarowej zostaje utworzona tabela wizualna dla komputera
    createComputerTable(computerTable);


    var summarySelector = document.querySelector("#computerSummary");
    //odkrywanie elementu na stronie, któru wcześniej był ukryty
    summarySelector.style.display = "block";
    summarySelector.style.marginLeft = "180px";

    //ukrycie już nie potrzebnych elementów na stronie
    document.querySelector("#selectShip").style.display = "none";
    document.querySelector("#oneMast").style.display = "none";
    document.querySelector("#twoMast").style.display = "none";
    document.querySelector("#threeMast").style.display = "none";
    document.querySelector("#fourMast").style.display = "none";


    document.querySelector("#hitShip").style.display = "block";

    //losowanie kto zaczyna
    moveHas = randomWhoStart()

    //wyłączenie przycisków
    var btnStart = document.querySelector("#start");
    btnStart.disabled = true;
    var btnClear = document.querySelector("#clear");
    btnClear.disabled = true;
    //funkcja informuje o statusie rozgrywki, pokazuje informacje o turze, kolejnym ruchu oraz o tym czy było pudło
    viewStatus("ZACZYNAMY!", moveHas);
}

function viewStatus(message, ruch) {
    var currentMoveSelector = document.querySelector("#currentMove");
    if (message != "ZACZYNAMY!") {
        //to tabeli z historią rozgrywki zostaje dorzucony nowy element
        moveHistory.push({ tura: tura, move: moveHas, message: message });
        var status = document.querySelector("#status");
        status.innerHTML = "";
        //wizualne utworzenie na stronie histori rozgrywki
        for (var history of moveHistory) {
            var turaSelector = document.createElement('p');
            turaSelector.innerHTML = "Tura: " + history.tura;
            var moveSelector = document.createElement('p');
            moveSelector.innerHTML = "Ruch: " + history.move;
            var messageSelector = document.createElement('h4');
            messageSelector.innerHTML = history.message;

            status.appendChild(messageSelector);
            status.appendChild(turaSelector);
            status.appendChild(moveSelector);
        }
        status.scrollTop = status.scrollHeight;
        tura++;
        moveHas = ruch;
        var sunkSelector = document.querySelector("#sunkShip");
        sunkSelector.innerHTML = computersSunkShip;
        var sunkPlayerSelector = document.querySelector("#sunkShipPlayer");
        sunkPlayerSelector.innerHTML = playersSunkShip;
        //sprawdzenie ile statków zostało zatopionych wygra ten, który pierwszy zatopi 10 statków
        if (playersSunkShip >= 10) {
            currentMoveSelector.innerHTML = "Koniec! Wygrywa komputer";
            return;
        } else if (computersSunkShip >= 10) {
            currentMoveSelector.innerHTML = "Koniec! Wygrywa gracz";
            return;
        }
    }
    currentMoveSelector.innerHTML = "Teraz ruch wykonuje: " + moveHas;

    //jeśli gra komputer zaczekaj sekunde przed kolejnym ruchem
    if (moveHas == "Komputer") {
        setTimeout(computerMove, 1000);
    } else {
        nextMove();
    }
}

function randomWhoStart() {
    //zostaje wylosowana liczba od 0 do 1 i pomnożona przez 10
    random = Math.floor(Math.random() * 10);
    if (random >= 5)
        return "Komputer";
    else
        return "Gracz";
}

function computerMove() {
    var randI;
    var randJ;
    var directory;

    //Mechanizm odpowiedzialny za zawężenie szuaknia statków po tym jak komputer trafi ale nie zatopi statku
    if (lastComputerMove != null && maxComputerTry > computerTry) {
        if (lastComputerDirectory == null)
            directory = isHorizontal(); // funkcja ta zwraca losowo albo true albo false
        else
            directory = lastComputerDirectory;

        if (directory == true) {
            randI = lastComputerMove.index;
            var left = isHorizontal();
            if (left) {
                if (computerTry < 15) {
                    randJ = lastComputerMove.jndex + 1;
                } else {
                    randJ = lastComputerMove.jndex + generateNumberNotBiggerThen(3);
                }
            } else {
                if (computerTry < 15) {
                    randJ = lastComputerMove.jndex - 1;
                } else {
                    randJ = lastComputerMove.jndex - generateNumberNotBiggerThen(3);
                }
            }
        } else {
            randJ = lastComputerMove.jndex;
            var up = isHorizontal();
            if (up) {
                if (computerTry < 15)
                    randI = lastComputerMove.index + 1;
                else
                    randI = lastComputerMove.index + generateNumberNotBiggerThen(3);
            } else {
                if (computerTry < 15)
                    randI = lastComputerMove.index - 1;
                else
                    randI = lastComputerMove.index - generateNumberNotBiggerThen(3);
            }
        }
        computerTry++;

    } else {
        // wylosowanie losowego pola na tablicy
        randI = generateNumberNotBiggerThen(9);
        randJ = generateNumberNotBiggerThen(9);
        computerTry = 0;
    }
    if (randI > 9 || randI < 0) {
        randI = generateNumberNotBiggerThen(9);
    }
    if (randJ > 9 || randJ < 0) {
        randJ = generateNumberNotBiggerThen(9);
    }
    var element = yourBoardArray[randI][randJ];
    if (element == 1) {
        var td = document.getElementById(randI + "_" + randJ);
        td.style.backgroundColor = "red";
        yourBoardArray[randI][randJ] = 2;
        //sprawdzenie czy trafiony statek nie zostal zatopiony (czyli wszystkie jego pola są zniszoncze)
        var sunk = detectShipSunk(randI, randJ, yourBoardArray);

        var message = "";
        if (sunk) {
            message = " Zatopiony!"
            lastComputerMove = null;
            playersSunkShip++;
            lastComputerDirectory = null;
        } else {
            if (lastComputerMove != null) {
                lastComputerDirectory = directory;
            }
            lastComputerMove = { index: randI, jndex: randJ };
        }
        viewStatus("TRAFIONY!" + message, "Komputer")
    }
    if (element == 0) {
        var td = document.getElementById(randI + "_" + randJ);
        td.style.backgroundColor = "grey";
        yourBoardArray[randI][randJ] = 3;
        viewStatus("PUDŁO!", "Gracz")
    }
    if (element != 0 && element != 1) {
        computerMove();
    }
}

function detectShipSunk(index, jndex, table) {
    var resutl = false
    var jlength = table[index].length;
    var ilength = table.length;
    for (let i = jndex; i < jlength; i++) {
        let element = table[index][i];
        if (element == 1)
            return false;
        if (element == 0 || element == 3) {
            resutl = true
            break;
        }
    }
    for (let i = jndex; i > 0; i--) {
        let element = table[index][i];
        if (element == 1)
            return false;
        if (element == 0 || element == 3) {
            resutl = true
            break;
        }
    }
    for (let i = index; i < ilength; i++) {
        let element = table[i][jndex];
        if (element == 1)
            return false;
        if (element == 0 || element == 3) {
            resutl = true
            break;
        }
    }
    for (let i = index; i > 0; i--) {
        let element = table[i][jndex];
        if (element == 1)
            return false;
        if (element == 0 || element == 3) {
            resutl = true
            break;
        }
    }
    return resutl;
}

function nextMove() {

}

function generateBoard() {
    //alogyrm probuje rozstawić statki tak aby nie nachodziły na siebie
    //losowo zostaje wybrany początek statku oraz kierunek w którym statek zostanie ułożonu
    var actualFourMast = fourMastCount;
    while (actualFourMast > 0) {
        var randomStart = generateNumberNotBiggerThen(5)
        if (isHorizontal()) {
            randomVertical = Math.floor(Math.random() * 10);
            for (let i = randomStart; i < randomStart + 4; i++) {
                computerTable[randomVertical][i] = 1;
            }
        } else {
            randomHorizont = Math.floor(Math.random() * 10);
            for (let i = randomStart; i < randomStart + 4; i++) {
                computerTable[i][randomHorizont] = 1;
            }
        }
        actualFourMast--;
    }
    var actualThreeMast = threeMastCount;
    while (actualThreeMast > 0) {
        var randomStart = generateNumberNotBiggerThen(6);
        if (isHorizontal()) {
            randomVertical = Math.floor(Math.random() * 10);
            if (computerTable[randomVertical][randomStart] == 1)
                continue;
            if (computerTable[randomVertical][randomStart + 3] == 1)
                continue;
            //funkcja isGoodArea sprawdza czy można na wylosowanym obszarze umieścić statek, jeśli nie losuje znowu
            let result = isGoodArea({ index: randomVertical, jndex: randomStart }, { index: randomVertical, jndex: randomStart + 3 }, computerTable)
            if (result != false) {
                for (let i = randomStart; i < randomStart + 3; i++) {
                    computerTable[randomVertical][i] = 1;
                }
                actualThreeMast--;
            }
        } else {
            randomHorizont = Math.floor(Math.random() * 10);
            if (computerTable[randomStart][randomHorizont] == 1)
                continue;
            if (computerTable[randomStart + 3][randomHorizont] == 1)
                continue;
            let result = isGoodArea({ index: randomStart, jndex: randomHorizont }, { index: randomStart + 3, jndex: randomHorizont }, computerTable)
            if (result != false) {
                for (let i = randomStart; i < randomStart + 3; i++) {
                    computerTable[i][randomHorizont] = 1;
                }
                actualThreeMast--;
            }
        }
    }
    var actualTwoMast = twoMastCount;
    while (actualTwoMast > 0) {
        var randomStart = generateNumberNotBiggerThen(7);
        if (isHorizontal()) {
            randomVertical = Math.floor(Math.random() * 10);
            if (computerTable[randomVertical][randomStart] == 1)
                continue;
            if (computerTable[randomVertical][randomStart + 2] == 1)
                continue;
            let result = isGoodArea({ index: randomVertical, jndex: randomStart }, { index: randomVertical, jndex: randomStart + 2 }, computerTable)
            if (result != false) {
                for (let i = randomStart; i < randomStart + 2; i++) {
                    computerTable[randomVertical][i] = 1;
                }
                actualTwoMast--;
            }
        } else {
            randomHorizont = Math.floor(Math.random() * 10);
            if (computerTable[randomStart][randomHorizont] == 1)
                continue;
            if (computerTable[randomStart + 2][randomHorizont] == 1)
                continue;
            let result = isGoodArea({ index: randomStart, jndex: randomHorizont }, { index: randomStart + 2, jndex: randomHorizont }, computerTable)
            if (result != false) {
                for (let i = randomStart; i < randomStart + 2; i++) {
                    computerTable[i][randomHorizont] = 1;
                }
                actualTwoMast--;
            }
        }
    }

    var actualOneMast = oneMastCount;
    while (actualOneMast > 0) {
        let randomHorizont = generateNumberNotBiggerThen(10);
        let randomVertical = generateNumberNotBiggerThen(10);
        if (computerTable[randomVertical][randomHorizont] == 1)
            continue;

        let result = isGoodArea({ index: randomVertical, jndex: randomHorizont }, { index: randomVertical + 1, jndex: randomHorizont }, computerTable)
        if (result != false) {

            computerTable[randomVertical][randomHorizont] = 1;

            actualOneMast--;
        }
    }

}

function isGoodArea(start, end, table) {
    var direction;
    var directionText;
    var distanceHorizontal = end.jndex - start.jndex;
    var distanceVertical = end.index - start.index;

    if (distanceHorizontal > distanceVertical) {
        direction = distanceHorizontal;
        directionText = "horizontal";
    } else {
        direction = distanceVertical;
        directionText = "vertical";
    }

    var toCheck = start;
    for (let w = 0; w < direction; w++) {
        var result = checkAreaForSingle(toCheck, table)
        if (result == false)
            return false;
        if (directionText == "horizontal")
            toCheck = { index: toCheck.index, jndex: toCheck.jndex + 1 };
        else
            toCheck = { index: toCheck.index + 1, jndex: toCheck.jndex };

    }
}

function checkAreaForSingle(start, table) {
    var jlength = table[start.index].length;
    if (start.jndex + 1 <= jlength) {
        var nextElHorizont = table[start.index][start.jndex + 1];
        if (nextElHorizont == 1) {
            return false;
        }
    }
    if (start.jndex > 0) {
        var prevElementHorizont = table[start.index][start.jndex - 1]
        if (prevElementHorizont == 1) {
            return false;
        }
    }
    var ilength = table.length;
    if (start.index + 1 < ilength) {
        var nextElVerticle = table[start.index + 1][start.jndex];
        if (nextElVerticle == 1) {
            return false;
        }
    }
    if (start.index > 0) {
        var prevElementVerticle = table[start.index - 1][start.jndex]
        if (prevElementVerticle == 1) {
            return false;
        }
    }

    if (start.jndex + 1 < jlength && start.index + 1 < table.length) {
        var southEast = table[start.index + 1][start.jndex + 1];
        if (southEast == 1)
            return false;

    }
    if (start.jndex + 1 < jlength && start.index - 1 >= 0) {
        var northEast = table[start.index - 1][start.jndex + 1];
        if (northEast == 1)
            return false;

    }
    if (start.jndex - 1 >= 0 && start.index + 1 < table.length) {
        var southWest = table[start.index + 1][start.jndex - 1];
        if (southWest == 1)
            return false;

    }
    if (start.jndex - 1 >= 0 && start.index - 1 >= 0) {
        var northWest = table[start.index - 1][start.jndex - 1];
        if (northWest == 1)
            return false;

    }
}

function generateNumberNotBiggerThen(number) {
    var randomStart = Math.floor(Math.random() * 10);

    if (randomStart > number)
        randomStart = generateNumberNotBiggerThen(number)
    return randomStart;
}

function isHorizontal() {
    var randomStart = Math.floor(Math.random() * 10);
    if (randomStart >= 5)
        return true;
    else
        return false;
}

function createTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    for (let i = 0; i < tableData.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < tableData[i].length; j++) {
            let cell = document.createElement('td');
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = "white";
            cell.id = i + "_" + j;
            cell.addEventListener("click", function() {
                var value = tableData[i][j];
                //dla każdej komórki tabeli gracza zostaje dodana reakcja na zdarzenie click
                //jeśli można oznaczyć komórkie statkiem zmień kolor na zielony
                // zawsze sprawdzana jest też liczba statków (czy nie za dużo)
                if (value == 0 && canMarkShip(tableData, i, j)) {

                    tableData[i][j] = 1;
                    cell.style.backgroundColor = "green";
                    enoughtShips(tableData)
                } else {
                    tableData[i][j] = 0;
                    cell.style.backgroundColor = "white";
                    enoughtShips(tableData)
                }
            });
            row.appendChild(cell);
        }
        tableBody.appendChild(row);

    }
    table.appendChild(tableBody);
    table.id = "playerTable";
    var tableSelector = document.querySelector("#yourBoard");
    tableSelector.appendChild(table);
}

function createComputerTable(tableData) {
    var table = document.createElement('table');
    var tableBody = document.createElement('tbody');
    for (let i = 0; i < tableData.length; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < tableData[i].length; j++) {
            let cell = document.createElement('td');
            cell.style.border = "1px solid black";
            cell.style.backgroundColor = "white";
            cell.addEventListener("click", function() {
                if (moveHas == "Komputer")
                    return;
                // zostaje dodana reakcja po kliknieciu przez gracza na komórke tabli komputera
                // jeśli jest statek zmien kolor na niebieski i sprawdź czy statek nie został zatopiony
                //jeśli trafisz kontunujesz ruch w przeciwnym przypadku ruch ma komputer
                if (tableData[i][j] == 1) {
                    cell.style.backgroundColor = "blue";
                    tableData[i][j] = 2
                    var message = ""
                    if (detectShipSunk(i, j, computerTable)) {
                        message = " Zatopiony!"
                        computersSunkShip++;
                    }
                    viewStatus("TRAFIONY!" + message, "Gracz")
                } else if (tableData[i][j] == 0) {
                    cell.style.backgroundColor = "grey";
                    tableData[i][j] = 3
                    viewStatus("PUDŁO!", "Komputer")
                }
            });

            row.appendChild(cell);
        }
        tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    var tableSelector = document.querySelector("#computerBoard");
    tableSelector.appendChild(table);
}

function canMarkShip(table, i, j) {
    var jlength = table[i].length;
    if (j + 1 <= jlength) {
        var nextElHorizont = table[i][j + 1];
        if (nextElHorizont == 1) {
            if (j > 0) {
                var prevElementHorizont = table[i][j - 1]
                if (prevElementHorizont == 1) {
                    return false;
                }
            }
        }
    }
    if (j + 1 < jlength && i + 1 < table.length) {
        var southEast = table[i + 1][j + 1];
        if (southEast == 1)
            return false;

    }
    if (j + 1 < jlength && i - 1 >= 0) {
        var northEast = table[i - 1][j + 1];
        if (northEast == 1)
            return false;

    }
    if (j - 1 >= 0 && i + 1 < table.length) {
        var southWest = table[i + 1][j - 1];
        if (southWest == 1)
            return false;

    }
    if (j - 1 >= 0 && i - 1 >= 0) {
        var northWest = table[i - 1][j - 1];
        if (northWest == 1)
            return false;

    }
    if (notToLong(i, j, table) == false)
        return false;

    return true;

}
// funkcja sprawdza czy statek nie jest za długi
function notToLong(startI, startJ, board) {
    var jlength = board[startI].length;
    count = 1;
    for (let i = startJ; i < jlength; i++) {
        if (i + 1 < jlength) {
            let nEl = board[startI][i + 1];
            if (nEl == 1)
                count++
                else
                    break;

        }
    }
    for (let i = startJ; i >= 1; i--) {
        if (i - 1 > 0) {
            let nEl = board[startI][i - 1];
            if (nEl == 1)
                count++
                else
                    break;

        }
    }
    if (count > 4)
        return false;
    count = 1;
    for (let i = startI; i < board.length; i++) {
        if (i + 1 < board.length) {
            let nEl = board[i + 1][startJ];
            if (nEl == 1) {
                count++
            } else
                break;

        }
    }
    for (let i = startI; i >= 1; i--) {
        if (i - 1 > 0) {
            let nEl = board[i - 1][startJ];
            if (nEl == 1)
                count++
                else
                    break;

        }
    }
    if (count > 4)
        return false;

    return true;
}

function enoughtShips(table) {
    var oneMast = 0;
    var twoMast = 0;
    var threeMast = 0;
    var fourMast = 0;
    var startsXends = [];
    var startsYends = [];

    for (let i = 0; i < table.length; i++) {
        let start = null;
        let end = null;
        for (let j = 0; j < table[i].length; j++) {
            let element = table[i][j];
            if (element == 1 && start == null) {
                start = { index: i, jndex: j };
            }
            if (element == 0 && start != null) {
                end = { index: i, jndex: j }
            }
            if (start != null && end != null) {
                if (end.jndex - start.jndex > 1)
                    startsXends.push({ start: start, end: end });
                start = null;
                end = null;
            }
        }
        if (start != null && end == null) {
            end = { index: i, jndex: table[i].length }
            if (end.jndex - start.jndex > 1)
                startsXends.push({ start: start, end: end });
            start = null;
            end = null;
        }
    }
    for (let j = 0; j < 10; j++) {
        let start = null;
        let end = null;
        for (let i = 0; i < table.length; i++) {

            let element = table[i][j];
            if (element == 1 && start == null) {
                start = { index: i, jndex: j };
            }
            if (element == 0 && start != null) {
                end = { index: i, jndex: j }
            }
            if (start != null && end != null) {
                let existInStXEnd = false;
                for (let z = 0; z < startsXends.length; z++) {
                    if (start.index == startsXends[z].start.index && start.jndex >= startsXends[z].start.jndex && start.jndex <= startsXends[z].end.jndex) {
                        existInStXEnd = true;
                        break;
                    }
                }
                if (existInStXEnd == false) {
                    startsYends.push({ start: start, end: end });
                }
                start = null;
                end = null;
            }
        }
        if (start != null && end == null) {
            end = { index: table.length, jndex: j }
            let existInStXEnd = false;
            for (let z = 0; z < startsXends.length; z++) {
                if (start.index == startsXends[z].start.index && start.jndex >= startsXends[z].start.jndex && start.jndex <= startsXends[z].end.jndex) {
                    existInStXEnd = true;
                    break;
                }
            }
            if (existInStXEnd == false) {
                startsYends.push({ start: start, end: end });
            }
            start = null;
            end = null;
        }
    }
    var isValid = true;
    for (let i = 0; i < startsXends.length; i++) {
        var count = startsXends[i].end.jndex - startsXends[i].start.jndex;
        if (count == 4) {
            fourMast++;
            if (fourMast > fourMastCount) {
                isValid = false;
            }
        }
        if (count == 3) {
            threeMast++;
            if (threeMast > threeMastCount) {
                isValid = false;
            }
        }
        if (count == 2) {
            twoMast++;
            if (twoMast > twoMastCount) {
                isValid = false;
            }
        }
    }
    for (let i = 0; i < startsYends.length; i++) {
        var count = startsYends[i].end.index - startsYends[i].start.index;
        if (count == 4) {
            fourMast++;
            if (fourMast > fourMastCount) {
                isValid = false;
            }
        }
        if (count == 3) {
            threeMast++;
            if (threeMast > threeMastCount) {
                isValid = false;
            }
        }
        if (count == 2) {
            twoMast++;
            if (twoMast > twoMastCount) {
                isValid = false;
            }
        }
        if (count == 1) {
            oneMast++;
            if (oneMast > oneMastCount) {
                isValid = false;
            }
        }
    }
    isValid = checkShipCondition(oneMast, twoMast, threeMast, fourMast);
    return isValid;
}

function checkShipCondition(oneMast, twoMast, threeMast, fourMast) {

    var oneMastSelector = document.querySelector("#oneMastSelector");
    var oneMastAcctual = oneMastCount - oneMast;
    oneMastSelector.innerHTML = oneMastAcctual;
    if (oneMastAcctual < 0)
        oneMastSelector.style.color = "red";
    else
        oneMastSelector.style.color = "black";

    var twoMastSelector = document.querySelector("#twoMastSelector");
    var twoMastActual = twoMastCount - twoMast;
    twoMastSelector.innerHTML = twoMastActual;
    if (twoMastActual < 0)
        twoMastSelector.style.color = "red";
    else
        twoMastSelector.style.color = "black";

    var threeMastSelector = document.querySelector("#threeMastSelector");
    var threeMastActual = threeMastCount - threeMast;
    threeMastSelector.innerHTML = threeMastActual;
    if (threeMastActual < 0)
        threeMastSelector.style.color = "red";
    else
        threeMastSelector.style.color = "black";

    var fourMastSelector = document.querySelector("#fourMastSelector");
    var fourMastActual = fourMastCount - fourMast;
    fourMastSelector.innerHTML = fourMastActual;
    if (fourMastActual < 0)
        fourMastSelector.style.color = "red";
    else
        fourMastSelector.style.color = "black";

    if (oneMastAcctual == 0 && twoMastActual == 0 && threeMastActual == 0 && fourMastActual == 0)
        return true;
    return false;
}