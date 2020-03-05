window.addEventListener("DOMContentLoaded", start);

var fourMastCount = 1;
var threeMastCount = 2;
var twoMastCount =3;
var oneMastCount = 4;

function start() {

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
    var board = document.querySelector("#yourBoard");
    createTable(yourBoardArray);

    var computerBoardArray = generateBoard();
    // for(let i = 0;i <= yourBoardArray.length; i++){
    //     for(let j =0;j <= yourBoardArray.length; j++){
    //         var node = document.createElement("div");
    //         node.style="height:20pxwidth:20px:background-color:red";
    //         board.appendChild(node);
    //     }
    // }

}

function generateBoard() {

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
            cell.addEventListener("click", function () {
                var value = tableData[i][j];

                if (value == 0 && canMarkShip(tableData, i, j)) {

                    tableData[i][j] = 1;
                    cell.style.backgroundColor = "green";

                }
                else {
                    tableData[i][j] = 0;
                    cell.style.backgroundColor = "white";

                }
                // checkShipCondition();
            });
            // cell.appendChild(document.createTextNode(tableData[i][j]));
            row.appendChild(cell);
        }
        tableBody.appendChild(row);

    }
    table.appendChild(tableBody);
    document.body.appendChild(table);
}

function markElement(i, j, board, element) {

}
function canMarkShip(table, i, j) {
    var jlength = table[i].length;
    if (j + 1 <= jlength) {
        var nextElHorizont = table[i][j + 1];
        if (nextElHorizont == 1)
        {
            if(j > 0){
                var prevElementHorizont = table[i][j-1]
                if(prevElementHorizont == 1){
                    return false;
                }
            }
        }
    }
    if(notToLong(i,j,table))
        return true;

    return false;

}

function notToLong(startI, startJ,board){
    var jlength = board[startI].length;
    count = 1;
    for (let i = startJ; i < jlength; i++) {
        if (i + 1 <= jlength) {
            let nEl = board[startI][i + 1];
            if(nEl == 1)
                count++
            else
                break;
            
        }
    }
    for (let i = startJ; i >= 1; i--) {
        if (i - 1 > 0) {
            let nEl = board[startI][i - 1];
            if(nEl == 1)
                count++
            else
                break;
            
        }
    }
    if(count > 4)
        return false;
    return true;
}

function enoughtShips(table){
    var oneMast = 0;
    var twoMast = 0;
    var threeMast = 0;
    var fourMast = 0;
    for(let i = 0; i <= table.length; i++){
        for(let j =0; j <= table[i].length; j++){
            let element = table[i][j];
            if(element == 1 && ( j == 0 || element[i][j -1] == 0))
            {

            }
             
        }
    }

}

function checkShipCondition() {
    var oneMast = 0;
    var twoMast = 0;
    var threeMast = 0;
    var fourMast = 0;

    for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < tableData[i].length; j++) {
            var value = tableData[i][j];
            if (value == 1) {

            }
        }
    }
}