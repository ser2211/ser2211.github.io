let game = {
    pole: [],
    snake: [],
    width: 20,
    height: 20,
    num_of_snake: 3,
    num_of_eat_inc: 2,
    num_of_eat_dec: 2,
    num_of_stone: 2,
    vector: { dx: 0, dy: 1 },
    colors: { 0: "white", 1: "green", 2: "red", 3: "gray", 9: "pink" }
}

game.random_point = function() {
    let check = 0;
    let x1 = 0;
    let y1 = 0;
    while (check == 0) {
        x1 = Math.floor(Math.random() * this.width);
        y1 = Math.floor(Math.random() * this.height);
        if (this.pole[x1][y1] == 0) check = 1;
    }
    let res = { x: x1, y: y1 };
    return res;
}

game.init = function() {
    for (x = 0; x < this.width; x++) {
        this.pole[x] = [];
        for (y = 0; y < this.height; y++) {
            this.pole[x][y] = 0;
        }
    }

    let yn = Math.round(this.height / 2);
    for (n = 0; n < this.num_of_snake; n++) {
        let xn = this.num_of_snake - n;
        this.snake[n] = { x: xn, y: yn };
        this.pole[xn][yn] = 9;
    }

    for (n = 1; n <= this.num_of_eat_inc; n++) {
        point = this.random_point();
        this.pole[point['x']][point['y']] = 1;
    }

    for (n = 1; n <= this.num_of_eat_dec; n++) {
        point = this.random_point();
        this.pole[point['x']][point['y']] = 2;
    }

    for (n = 1; n <= this.num_of_stone; n++) {
        point = this.random_point();
        this.pole[point['x']][point['y']] = 3;
    }

};

game.next_step = function() {
    let vector = this.vector;
    let debug = "";
    let head = this.snake[0];
    debug = "hx=" + head['x'] + ", hy=" + head['y'] + "dx=" + vector['dx'] + ", dy=" + vector['dy'];
    //console.log(debug);
    //document.getElementById('debug').textContent = debug;
    // Проверка, что змейка не идет назад
    if (this.num_of_snake > 1) {
        neck = this.snake[1];
        debug = "hx=" + head['x'] + ", hy=" + head['y'] + ", nx=" + neck['x'] + ", ny=" + neck['y'] + ", dx=" + vector['dx'] + ", dy=" + vector['dy'];
        //console.log(debug);
        if ((head['x'] + vector['dx'] == neck['x']) && (head['y'] + vector['dy'] == neck['y'])) {
            //document.getElementById('debug').textContent = debug;
            alert("Вы проиграли1!" + debug);
            window.location = "index.html";
        }
    }

    let newx = head['x'] + vector['dx'];
    let newy = head['y'] + vector['dy'];
    if (newx >= this.width) newx = 0;
    if (newy >= this.height) newy = 0;
    debug = "newx=" + newx + ", newy=" + newy;
    console.log(debug);
    //alert("Новое положение головы");
    if (this.pole[newx][newy] == 3) {
        // Проверка, что змейка не врезалась в камень
        debug = "hx=" + head['x'] + ", hy=" + head['y'] + ", nx=" + neck['x'] + ", ny=" + neck['y'] + ", dx=" + vector['dx'] + ", dy=" + vector['dy'];
        console.log(debug);
        alert("Вы проиграли2!" + debug);
        window.location = "index.html";
    } else if (this.pole[newx][newy] == 1) {
        // Змейка съела зеленую еду и увеличивается
        this.num_of_snake++;
    } else if (this.pole[newx][newy] == 2) {
        // Змейка съела красную еду и уменьшается
        last = this.num_of_snake;
        chain = this.snake[last - 1];
        document.getElementById('cell' + chain['x'] + `-` + chain['y']).style.backgroundColor = this.colors[0];
        chain = this.snake[last - 2];
        document.getElementById('cell' + chain['x'] + `-` + chain['y']).style.backgroundColor = this.colors[0];
        this.num_of_snake--;
    } else {
        // Змейка просто двигается
        last = this.num_of_snake;
        chain = this.snake[last - 1];
        document.getElementById('cell' + chain['x'] + `-` + chain['y']).style.backgroundColor = this.colors[0];
    }

    // создадим новый массив змейки
    new_snake = [];
    new_snake[0] = { x: newx, y: newy };
    document.getElementById('cell' + newx + `-` + newy).style.backgroundColor = this.colors[9];
    for (n = 1; n < this.num_of_snake; n++) {
        new_snake[n] = { x: this.snake[n - 1]['x'], y: this.snake[n - 1]['y'] };
    }
    this.snake = new_snake;

}

game.mytable = function() {
    document.write("<table>");
    let color = "green";
    for (i = 0; i < this.width; i++) {
        document.write("<tr>");
        for (j = 0; j < this.height; j++) {
            color = this.colors[this.pole[i][j]];
            document.write(`<td id='cell${i}-${j}' bgcolor="${color}"></td>`);
        };
        document.write("</tr>");
    };
    document.write("</table>");
    for (n = 0; n < this.num_of_snake; n++) {
        chain = this.snake[n];
        document.getElementById('cell' + chain['x'] + `-` + chain['y']).style.backgroundColor = this.colors[9];
    }
    document.write(`<div id='debug'>Отладка</div>`);
};

game.init();
game.mytable();
document.addEventListener("keydown", function(event) {
    if (event.key === 'ArrowUp') {
        game.vector['dy'] = 0;
        game.vector['dx'] = -1;
        //console.log(verh);
    } else if (event.key === 'ArrowDown') {
        game.vector['dy'] = 0;
        game.vector['dx'] = 1;
        //console.log(verh);
    } else if (event.key === 'ArrowLeft') {
        game.vector['dy'] = -1;
        game.vector['dx'] = 0;
        //console.log(verh);
    } else if (event.key === 'ArrowRight') {
        game.vector['dy'] = 1;
        game.vector['dx'] = 0;
        //console.log(verh);
    }
});
var timerId = setInterval(function() {
    game.next_step();
}, 1000);