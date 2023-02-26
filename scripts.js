let turnoNum;
let fin = false;
let jugadores = [];
let simbolos = [];
let filas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let columnas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let diagTb = [0, 0, 0];
let diagBt = [0, 0, 0];

/* 
    |1 2 3|  filas = [[1,2,3],[4,5,6],[7,8,9]]
    |4 5 6|  columnas = [[1,4,7],[2,5,8],[3,6,9]]
    |7 8 9|  diagTb = [1,5,9]  diagBt = [7,5,3]
*/

$("#j2Nombre").hover(function () {
    $(".tooltip-text").css("display", "inline");
}, function () {
    $(".tooltip-text").css("display", "none");
})
function cambiaColorFondoA(id, color) {
    $(`#${id}`).css("background-color", color);
}

/* Cambia el color de la selección de los símbolos y asigna a cada jugador el símbolo elegido */
let handler = function (event) {
    let colorSelec = "rgba(0,255,0,0.8)";
    let colorNoSelec = "rgba(255,0,0,0.8)";

    cambiaColorFondoA(event.target.id, colorSelec);

    switch (event.target.id) {
        case "j1Sx":
            cambiaColorFondoA("j2So", colorSelec);
            cambiaColorFondoA("j1So", colorNoSelec);
            cambiaColorFondoA("j2Sx", colorNoSelec);
            break;
        case "j1So":
            cambiaColorFondoA("j2Sx", colorSelec);
            cambiaColorFondoA("j1Sx", colorNoSelec);
            cambiaColorFondoA("j2So", colorNoSelec);
            break;
        case "j2Sx":
            cambiaColorFondoA("j2So", colorNoSelec);
            cambiaColorFondoA("j1Sx", colorNoSelec);
            cambiaColorFondoA("j1So", colorSelec);
            break;
        case "j2So":
            cambiaColorFondoA("j2Sx", colorNoSelec);
            cambiaColorFondoA("j1So", colorNoSelec);
            cambiaColorFondoA("j1Sx", colorSelec);
            break;
    }
}
function obtenerSimbolos() {
    if ($("#j1Sx").css("background-color") == "rgba(0, 255, 0, 0.8)") {
        return (["X", "O"]);
    } else {
        return (["O", "X"]);
    }
}
$(".botonSimbolo").on("click", handler);

/* Pone a 0 las variables y las celdas del tablero de juego */
function limpiarTablero() {
    mapa = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    filas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    columnas = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    diagTb = [0, 0, 0];
    diagBt = [0, 0, 0];
    $("td").html("");
}

/* Cuando se pulsa sobre el botón Iniciar se comprueba si los parámetros de inicio para que comience el juego son válidos (los nombres, símbolos y turno) */
$("#buttComienzo").click(function () {

    if ($("#buttComienzo").attr("value") == "Reiniciar") {
        reiniciarJuego();
    } else {
        if ($("#j1Nombre").val() == "") {
            $(".divTurno").html("<span>Escribe el nombre del jugador 1 para poder iniciar la partida</span>");
        } else {
            if ($("#j1Sx").css("background-color") == "rgb(240, 240, 240)") {
                $(".divTurno").html("<span>Elige un símbolo para poder iniciar la partida</span>");
            } else {
                if ($("input:checked").length == 0) {
                    $(".divTurno").html("<span>Elige el tipo de turno para poder iniciar la partida</span>");
                } else {

                    if ($("#j2Nombre").val() == "") {
                        $("#j2Nombre").val("BOT")
                    }

                    jugadores = [$("#j1Nombre").val(), $("#j2Nombre").val()];
                    simbolos = obtenerSimbolos();

                    switch ($("input:checked").val()) {
                        case "1":
                            turnoNum = 0;
                            break;
                        case "2":
                            turnoNum = 1;
                            break;
                        default:
                            turnoNum = randomIntFromInterval(0, 1);
                            break;
                    }

                    if (turnoNum == 1) { jugadores.reverse(); simbolos.reverse(); turnoNum = 0; }

                    desactivarEntradas();

                    $(this).hide();

                    comienzaJuego();
                }
            }
        }
    }
});

/* Reinicia el juego para que se pueda volver a introducir nombres, símbolos y turnos */
function reiniciarJuego() {

    $("#buttComienzo").attr("value", "Iniciar");
    $("#j1Nombre").attr("disabled", false);
    $("#j2Nombre").attr("disabled", false);
    $("input[type='radio'").attr("disabled", false);
    $(".botonSimbolo").on("click", handler);
    $(".divTurno").html("");
    limpiarTablero();
}
function comienzaJuego() {

    $(".divTurno").html(`<p>Es el turno de <span>${jugadores[turnoNum % 2]}</span></p>`);

    if (jugadores.indexOf("BOT") != -1 && jugadores[turnoNum % 2] == "BOT" && $("tr.fila-1 td.columna-1").html() == "") {
        setTimeout(function () { $("tr.fila-1 td.columna-1").click(); }, 1000);
    }

    /* Función que se realiza al pulsar sobre una celda del tablero de juego */
    $("td").click(function (event) {

        let fil, col, numJug, hayGanador = false;

        /* Si la celda está vacía se rellenan los datos */
        if ($(event.target).html() == "") {

            $(event.target).html(`${simbolos[turnoNum % 2]}`);
            fil = $(event.target).parent().attr("class").slice(-1);
            col = $(event.target).attr("class").slice(-1);

            numJug = (turnoNum % 2) + 1; //Nº jugador en humano, el 1º o el 2º
            //Relleno los arrays con el jugador que ha seleccionado la celda
            filas[fil][col] = numJug;
            columnas[col][fil] = numJug;
            if ((fil == 0 && col == 0) || (fil == 2 && col == 2)) {
                diagTb[fil] = numJug;
            } else if ((fil == 2 && col == 0) || (fil == 0 && col == 2)) {
                diagBt[col] = numJug;
            } else if (fil == 1 && col == 1) {
                diagTb[fil] = numJug;
                diagBt[col] = numJug;
            }
            /* 
            Una vez rellenado la variable se comprueba si esa celda es ganadora con sus posibles
            combinaciones ganadoras de 3 en raya
             */
            switch (parseInt(fil + col)) {
                case (0):
                    hayGanador = haGanado([filas[0], columnas[0], diagTb], numJug);
                    break;
                case (01):
                    hayGanador = haGanado([filas[0], columnas[1]], numJug);
                    break;
                case (02):
                    hayGanador = haGanado([filas[0], columnas[2], diagBt], numJug);
                    break;
                case (10):
                    hayGanador = haGanado([filas[1], columnas[0]], numJug);
                    break;
                case (11):
                    hayGanador = haGanado([filas[1], columnas[1], diagTb, diagBt], numJug);
                    break;
                case (12):
                    hayGanador = haGanado([filas[1], columnas[2]], numJug);
                    break;
                case (20):
                    hayGanador = haGanado([filas[2], columnas[0], diagBt], numJug);
                    break;
                case (21):
                    hayGanador = haGanado([filas[2], columnas[1]], numJug);
                    break;
                case (22):
                    hayGanador = haGanado([filas[2], columnas[2], diagTb], numJug);
                    break;
            }

            /* 
                Si el jugador del turno actual es ganador, de desactivan los clicks en la celda
                y se muestra la frase ganador y el botón de reiniciar 
            */
            if (hayGanador) {
                fraseGanador(jugadores[(turnoNum + 1) % 2], jugadores[turnoNum % 2]);
                juegoTerminado();
            } else {
                turnoNum += 1;
                if (turnoNum == 9) {
                    $(".divTurno").html(`<span>EMPATE</span>`);
                    setTimeout(function () {
                        juegoTerminado();
                    }, 1000);
                } else {
                    $(".divTurno").html(`Es el turno de <span>${jugadores[turnoNum % 2]}</span>`);
                    if (jugadores[turnoNum % 2] == "BOT") {
                        setTimeout(function () {
                            mueveBot();
                        }, 1000);
                    }
                }
            }
        }
    });
}
function haGanado(arrays, num) {
    for (const array of arrays) {
        let numRep = array.reduce((count, valor) => (valor == num ? count + 1 : count), 0);
        if (numRep == 3) {
            return true;
        }
    }
    return false;
}
function juegoTerminado() {
    $("#buttComienzo").attr("value", "Reiniciar");
    $("#buttComienzo").show();
    $("td").off("click");
}
function fraseGanador(perdedor, ganador) {
    let frases = [`<span>${perdedor}</span> le debe una cena a <span class="verde">${ganador}</span>`, `<span>${perdedor}</span> debe hacerle la colada a <span class="verde">${ganador}</span> durante una semana`, `<span>${perdedor}</span> debe hacerle la cena a <span class="verde">${ganador}</span> durante 3 días`, `¿No te da vergüenza <span>${perdedor}</span> de haber perdido contra una <span class="verde">máquina</span>?`, `La <span class="verde">Inteligencia Artificial</span> dominará el mundo 01010110101110`, `El FIN del mundo está cerca BIP BIP`]
    if (jugadores.indexOf("BOT") != -1 && ganador == "BOT") {
        $(".divTurno").html(frases[randomIntFromInterval(3, 5)]);
    } else {
        $(".divTurno").html(frases[randomIntFromInterval(0, 2)]);
    }

}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function mueveBot() {
    let pos;
    let numBot = jugadores.indexOf("BOT") + 1;
    let numAdvers;
    let filGanAdv = colGanAdv = -1;
    let casillasLibres = [];

    (numBot == 1) ? numAdvers = 2 : numAdvers = 1;

    /* Guardamos el número que usa el BOT y el Adversario de los arrays en variables para luego buscar las mejores posiciones en la que puede mover el BOT. Si el BOT mueve primero su número será el 1, si no, será el 2, y el adversario tendrá el otro número */
    if (filas[1][1] == 0) {
        $("tr.fila-1 td.columna-1").click();
    } else {
        for (let aux = 0; aux < 3; aux++) {
            let numRep0 = filas[aux].reduce((count, valor) => (valor == 0 ? count + 1 : count), 0);
            let numRepB = filas[aux].reduce((count, valor) => (valor == numBot ? count + 1 : count), 0);
            let numRepA = filas[aux].reduce((count, valor) => (valor == numAdvers ? count + 1 : count), 0);
            if (numRep0 >= 2) {
                casillasLibres = getAllIndexes(filas[aux], casillasLibres, aux, "f");
            }
            if (numRepB == 2 && numRep0 == 1) {
                pos = "tr.fila-" + aux + " td.columna-" + filas[aux].indexOf(0);
                $(pos).click();
                return true;
            } else {
                let numRep0 = columnas[aux].reduce((count, valor) => (valor == 0 ? count + 1 : count), 0);
                let numRepB = columnas[aux].reduce((count, valor) => (valor == numBot ? count + 1 : count), 0);
                let numRepA = columnas[aux].reduce((count, valor) => (valor == numAdvers ? count + 1 : count), 0);
                if (numRep0 >= 2) {
                    casillasLibres = getAllIndexes(columnas[aux], casillasLibres, aux, "c");
                }
                if (numRepB == 2 && numRep0 == 1) {
                    pos = "tr.fila-" + columnas[aux].indexOf(0) + " td.columna-" + aux;
                    $(pos).click();
                    return true;
                } else if (aux == 2) {
                    let numRep0 = diagTb.reduce((count, valor) => (valor == 0 ? count + 1 : count), 0);
                    let numRepB = diagTb.reduce((count, valor) => (valor == numBot ? count + 1 : count), 0);
                    let numRepA = diagTb.reduce((count, valor) => (valor == numAdvers ? count + 1 : count), 0);
                    if (numRep0 >= 2) {
                        casillasLibres = getAllIndexes(diagTb, casillasLibres, aux, "tb");
                    }
                    if (numRepB == 2 && numRep0 == 1) {
                        pos = "tr.fila-" + diagTb.indexOf(0) + " td.columna-" + diagTb.indexOf(0);
                        $(pos).click();
                        return true;
                    } else {
                        let numRep0 = diagBt.reduce((count, valor) => (valor == 0 ? count + 1 : count), 0);
                        let numRepB = diagBt.reduce((count, valor) => (valor == numBot ? count + 1 : count), 0);
                        let numRepA = diagBt.reduce((count, valor) => (valor == numAdvers ? count + 1 : count), 0);
                        if (numRep0 >= 2) {
                            casillasLibres = getAllIndexes(diagBt, casillasLibres, aux, "bt");
                        }
                        if (numRepB == 2 && numRep0 == 1) {
                            pos = "tr.fila-" + (2 - diagBt.indexOf(0)) + " td.columna-" + (2 - aux);
                            $(pos).click();
                            return true;
                        } else {
                            if (numRepA == 2 && numRep0 == 1) {
                                filGanAdv = 2 - diagBt.indexOf(0);
                                colGanAdv = diagBt.indexOf(0);
                            }
                        }
                    }
                    if (numRepA == 2 && numRep0 == 1) {
                        filGanAdv = diagTb.indexOf(0);
                        colGanAdv = filGanAdv;
                    }
                }
                if (numRepA == 2 && numRep0 == 1) {
                    filGanAdv = columnas[aux].indexOf(0);
                    colGanAdv = aux;
                }
            }
            if (numRepA == 2 && numRep0 == 1) {
                filGanAdv = aux;
                colGanAdv = filas[aux].indexOf(0);
            }
        }

        if (filGanAdv != -1) {
            pos = "tr.fila-" + filGanAdv + " td.columna-" + colGanAdv;
            $(pos).click();
            return true;
        }
        if (!ponerEsquina()) {
            aux = randomIntFromInterval(0, casillasLibres.length - 1);
            pos = "tr.fila-" + casillasLibres[aux][0] + " td.columna-" + casillasLibres[aux][1];
            $(pos).click();
            return true;
        }
        return false;
    }
}
function getAllIndexes(array, arrayLibres, aux, orientacion) {

    let indexes = [], i;
    for (i = 0; i < array.length; i++) {
        if (array[i] === 0) {
            switch (orientacion) {
                case "f":
                    indexes = [aux, i];
                    break;
                case "c":
                    indexes = [i, aux];
                    break;
                case "tb":
                    indexes = [i, i];
                    break;
                case "bt":
                    indexes = [aux - i, aux - i];
                    break;
            }
        }
        if (arrayLibres.indexOf(indexes) == -1) {
            arrayLibres.push(indexes);
        }
    }

    return arrayLibres;
}
function ponerEsquina() {
    if (filas[0][0] == 0) {
        $("tr.fila-0 td.columna-0").click();
        return true;
    } else if (filas[0][2] == 0) {
        $("tr.fila-0 td.columna-2").click();
        return true;
    }
    return false;
}
function desactivarEntradas() {
    $("#j1Nombre").attr("disabled", true);
    $("#j2Nombre").attr("disabled", true);
    $("input[type='radio'").attr("disabled", true);
    $(".botonSimbolo").off("click", handler);
}