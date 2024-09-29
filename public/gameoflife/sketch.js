const SIZE = 800;
const SPEED = 50; // ms to finish one step, higher = slower play speed

const ALIVE = 0;
const DEAD = 255;
const COLORS = [ALIVE, DEAD]; // Black = alive & White = dead

const size = 10; // size of a cell
let board = [];
let count = 0;
let aliveCounter = 0;
let generations = 0;
let canvas;

async function setup() {
  canvas = createCanvas(SIZE, SIZE);
  count = SIZE/size;
  translate(size/2, size/2);
  
  initBoard();
  
  xdraw();
  
  await step();
}

function initBoard(){
  let id = 0;
  for (let x = 0; x < count; x ++){
    board.push([]);
    for (let y = 0; y < count; y++){
      
      let data = {id: id, x: x, y: y, alive: false, size: size, color: DEAD, gonnaLive: false};
      board[x][y] = data;
      
      id++;
    }
  }
  
  hardcode_GOD();
  
  start_human_race();
}

function start_human_race(){
  for (let x = 0; x < 17; x ++){
    for (let y = 0; y < 17; y++){
      let rng = int(random(0, COLORS.length));
      board[x][y].alive = rng == ALIVE;
    }
  }
}

// Recursive to modify data
async function step(){
  await sleep(SPEED);
  
  applyRules();    
  
  xdraw();
  
  //saveImage();
  
  generations ++;
  
  await step();
}

function saveImage(){
  // store steps, 10 pictures
  if (generations % 100 == 0 && generations <= 1000) {
    saveCanvas(canvas, "gameoflife_" + generations + "_" + new Date(), "jpg");
  }
}

function applyRules(){
  for(let x = 0; x < count; x++){
    for(let y = 0; y < count; y++){
      let d = board[x][y];
      let neighbours = countAliveNeighbour(x, y);
      
      board[x][y].gonnaLive = shouldLive(board[x][y], neighbours);
    }
  }
  
  aliveCounter = 0;
  for(let x = 0; x < count; x++){
    for(let y = 0; y < count; y++){
      let alive = board[x][y].gonnaLive;
      board[x][y].alive = alive;
      aliveCounter += alive ? 1 : 0;
      
      board[x][y].gonnaLive = false;
    }
  }
}

// RULES: https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
function shouldLive(d, neighbours){
  // Any live cell with fewer than two live neighbours dies (underpopulation)
  if (d.alive && neighbours < 2) return false;
  // Any live cell with two or three live neighbours lives on to the next generation.
  if (d.alive && (neighbours == 2 || neighbours == 3)) return true;
  // Any live cell with more than three live neighbours dies (overpopulation)
  if (d.alive && neighbours > 3) return false;
  // Any dead cell with exactly three live neighbours becomes a live cell (reproduction)
  if (!d.alive && neighbours == 3) return true;
  
  return false;
}

function countAliveNeighbour(x, y){
  let total = 0;
  
  // +
  total += (x - 1 >= 0) && board[x-1][y].alive ? 1 : 0;
  total += (x + 1 < count) && board[x+1][y].alive ? 1 : 0;
  total += (y - 1 >= 0) && board[x][y-1].alive ? 1 : 0;
  total += (y + 1 < count) && board[x][y+1].alive ? 1 : 0;
  // x
  total += (x - 1 >= 0) && (y - 1 >= 0) && board[x-1][y-1].alive ? 1 : 0;
  total += (x + 1 < count) && (y - 1 >= 0) && board[x+1][y-1].alive ? 1 : 0;
  total += (x - 1 >= 0) && (y + 1 < count) && board[x-1][y+1].alive ? 1 : 0;
  total += (x + 1 < count) && (y + 1 < count) && board[x+1][y+1].alive ? 1 : 0;
  return total;
}

function randomColor(){
  return color(int(random(0, 255)), int(random(0, 255)), int(random(0, 255)), 255);
}

function xdraw() {
  clear();
  background(150);
  
  for(let x = 0; x < count; x++){
    for (let y = 0; y < count; y++){
      let d = board[x][y]; // data
      let c = d.alive ? ALIVE : DEAD;
      
      //fill(d.color);
      fill(c);
      //rect(d.x * d.size - 2, d.y * d.size - 2, d.size - 2, d.size - 2);      
      ellipse(d.x * d.size, d.y * d.size, d.size - 4, d.size - 4);
    }  
  }
  
  push();
  fill(color(200, 0, 0, 255));
  strokeWeight(2);
  stroke(255);
  
  textSize(30);
  text(generations, 0, 20);
  text(aliveCounter, width - 80, 20);
  pop();
}

// Utility + test cases
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mouseClicked() {
  let dx = floor(mouseX / size);
  let dy = floor(mouseY / size);
  
  board[dx][dy].color = randomColor();
  let neighbours = countAliveNeighbour(dx, dy);
  let status = shouldLive(board[dx][dy], neighbours) ? ". I'm gonna live!" : ". Too crowded, I'm fucking done!!";
  print("[" + dx + "," + dy + "] Alive neighbours = " + neighbours + status);
}

function hardcode_GOD(){
  // line 0
  board[25][20].alive = true;
  board[30][20].alive = true;
  board[31][20].alive = true;
  
  board[36][20].alive = true;
  board[37][20].alive = true;
  
  board[42][20].alive = true;
  board[43][20].alive = true;
  
  // line 1
  board[22][21].alive = true;
  board[25][21].alive = true;
  board[27][21].alive = true;
  board[28][21].alive = true;
  board[31][21].alive = true;
  board[33][21].alive = true;
  board[34][21].alive = true;
  board[37][21].alive = true;
  board[39][21].alive = true;
  board[40][21].alive = true;
  board[43][21].alive = true;
  board[45][21].alive = true;
  
  // line 2
  board[21][22].alive = true;
  board[22][22].alive = true;
  board[24][22].alive = true;
  board[27][22].alive = true;
  board[28][22].alive = true;
  board[30][22].alive = true;
  board[33][22].alive = true;
  board[34][22].alive = true;
  board[36][22].alive = true;  
  board[39][22].alive = true;  
  board[40][22].alive = true;
  board[42][22].alive = true;
  board[45][22].alive = true;
  board[46][22].alive = true;
  // line 3
  board[24][23].alive = true;
  board[25][23].alive = true;
  board[30][23].alive = true;
  board[31][23].alive = true;
  
  board[36][23].alive = true;
  board[37][23].alive = true;
  board[42][23].alive = true;
  board[43][23].alive = true;
  
  // line 4
  board[20][24].alive = true;
  
  board[21][24].alive = true;
  board[23][24].alive = true;
  
  board[26][24].alive = true;
  
  board[27][24].alive = true;
  board[29][24].alive = true;
  
  board[32][24].alive = true;
  
  board[33][24].alive = true;
  board[35][24].alive = true;
  
  board[38][24].alive = true;
  
  board[39][24].alive = true;
  board[41][24].alive = true;
  
  board[44][24].alive = true;
  board[45][24].alive = true;
  // line 5
  board[20][25].alive = true;
  
  board[22][25].alive = true;
  board[23][25].alive = true;
  
  board[26][25].alive = true;
  
  board[28][25].alive = true;
  board[29][25].alive = true;
  
  board[32][25].alive = true;
  
  board[34][25].alive = true;
  board[35][25].alive = true;
  
  board[38][25].alive = true;
  
  board[40][25].alive = true;
  board[41][25].alive = true;
  
  board[44][25].alive = true;
  board[46][25].alive = true;
  board[47][25].alive = true;
  // line 6
  board[24][26].alive = true;
  board[25][26].alive = true;
  board[30][26].alive = true;
  board[31][26].alive = true;
  
  board[36][26].alive = true;
  board[37][26].alive = true;
  board[42][26].alive = true;
  board[43][26].alive = true;
  
  // line 7
  board[21][27].alive = true;  
  board[22][27].alive = true;
  board[25][27].alive = true;
  
  board[27][27].alive = true;
  
  board[28][27].alive = true;
  board[31][27].alive = true;
  
  board[33][27].alive = true;
  
  board[34][27].alive = true;
  board[37][27].alive = true;
  
  board[39][27].alive = true;
  
  board[40][27].alive = true;
  board[43][27].alive = true;
  
  board[45][27].alive = true;
  
  board[46][27].alive = true;
  // line 8
  board[21][28].alive = true;
  
  board[22][28].alive = true;
  
  board[24][28].alive = true;
  board[27][28].alive = true;
  
  board[28][28].alive = true;
  
  board[30][28].alive = true;
  board[33][28].alive = true;
  
  board[34][28].alive = true;
  
  board[36][28].alive = true;
  board[39][28].alive = true;
  
  board[40][28].alive = true;
  
  board[42][28].alive = true;
  board[45][28].alive = true;
  
  board[46][28].alive = true;
  // line 9
  board[24][29].alive = true;
  board[25][29].alive = true;
  board[30][29].alive = true;
  board[31][29].alive = true;
  
  board[36][29].alive = true;
  board[37][29].alive = true;
  board[42][29].alive = true;
  board[43][29].alive = true;
  
  // line 10
  board[20][30].alive = true;
  
  board[21][30].alive = true;
  board[23][30].alive = true;
  
  board[26][30].alive = true;
  
  board[27][30].alive = true;
  board[29][30].alive = true;
  
  board[32][30].alive = true;
  
  board[33][30].alive = true;
  board[35][30].alive = true;
  
  board[38][30].alive = true;
  
  board[39][30].alive = true;
  board[41][30].alive = true;
  
  board[44][30].alive = true;
  board[45][30].alive = true;
  board[47][30].alive = true;
  // line 11
  board[20][31].alive = true;
  
  board[22][31].alive = true;
  board[23][31].alive = true;
  
  board[26][31].alive = true;
  
  board[28][31].alive = true;
  board[29][31].alive = true;
  
  board[32][31].alive = true;
  
  board[34][31].alive = true;
  board[35][31].alive = true;
  
  board[38][31].alive = true;
  
  board[40][31].alive = true;
  board[41][31].alive = true;
  
  board[44][31].alive = true;
  board[46][31].alive = true;
  board[47][31].alive = true;
  // line 12
  board[24][32].alive = true;
  board[25][32].alive = true;
  board[30][32].alive = true;
  board[31][32].alive = true;
  
  board[36][32].alive = true;
  board[37][32].alive = true;
  board[42][32].alive = true;
  board[43][32].alive = true;
  // line 13
  board[21][33].alive = true;
  
  board[22][33].alive = true;
  board[25][33].alive = true;
  
  board[27][33].alive = true;
  
  board[28][33].alive = true;
  board[31][33].alive = true;
  
  board[33][33].alive = true;
  
  board[34][33].alive = true;
  board[37][33].alive = true;
  
  board[39][33].alive = true;
  
  board[40][33].alive = true;
  board[43][33].alive = true;
  
  board[45][33].alive = true;
  
  board[46][33].alive = true;
  // line 14
  board[21][34].alive = true;
  
  board[22][34].alive = true;
  
  board[24][34].alive = true;
  board[27][34].alive = true;
  
  board[28][34].alive = true;
  
  board[30][34].alive = true;
  board[33][34].alive = true;
  
  board[34][34].alive = true;
  
  board[36][34].alive = true;
  board[39][34].alive = true;
  
  board[40][34].alive = true;
  
  board[42][34].alive = true;
  board[45][34].alive = true;
  
  board[46][34].alive = true;
  // line 15
  board[24][35].alive = true;
  board[25][35].alive = true;
  board[30][35].alive = true;
  board[31][35].alive = true;
  
  board[36][35].alive = true;
  board[37][35].alive = true;
  board[42][35].alive = true;
  board[43][35].alive = true;
  // line 16
  board[20][36].alive = true;
  
  board[21][36].alive = true;
  board[23][36].alive = true;
  
  board[26][36].alive = true;
  
  board[27][36].alive = true;
  board[29][36].alive = true;
  
  board[32][36].alive = true;
  
  board[33][36].alive = true;
  board[35][36].alive = true;
  
  board[38][36].alive = true;
  
  board[39][36].alive = true;
  board[41][36].alive = true;
  
  board[44][36].alive = true;
  board[45][36].alive = true;
  board[47][36].alive = true;
  // line 17
  board[22][37].alive = true;
  board[23][37].alive = true;
  
  board[26][37].alive = true;
  
  board[28][37].alive = true;
  board[29][37].alive = true;
  
  board[32][37].alive = true;
  
  board[34][37].alive = true;
  board[35][37].alive = true;
  
  board[38][37].alive = true;
  
  board[40][37].alive = true;
  board[41][37].alive = true;
  
  board[44][37].alive = true;
  board[46][37].alive = true;
  board[47][37].alive = true;
  // line 18
  board[24][38].alive = true;
  board[25][38].alive = true;
  board[30][38].alive = true;
  
  board[31][38].alive = true;
  board[36][38].alive = true;
  board[37][38].alive = true;
  board[42][38].alive = true;
  
  board[43][38].alive = true;  
  // line 19
  board[21][39].alive = true;
  
  board[22][39].alive = true;
  board[25][39].alive = true;
  
  board[27][39].alive = true;
  
  board[28][39].alive = true;
  board[31][39].alive = true;
  
  board[33][39].alive = true;
  
  board[34][39].alive = true;
  board[37][39].alive = true;
  
  board[39][39].alive = true;
  
  board[40][39].alive = true;
  board[43][39].alive = true;
  
  board[45][39].alive = true;
  
  board[46][39].alive = true;
  // line 20
  board[22][40].alive = true;
  
  board[24][40].alive = true;
  board[27][40].alive = true;
  
  board[28][40].alive = true;
  
  board[30][40].alive = true;
  board[33][40].alive = true;
  
  board[34][40].alive = true;
  
  board[36][40].alive = true;
  board[39][40].alive = true;
  
  board[40][40].alive = true;
  
  board[42][40].alive = true;
  board[45][40].alive = true;
  
  // line 21
  board[24][41].alive = true;
  
  board[25][41].alive = true;
  board[30][41].alive = true;
  board[31][41].alive = true;
  board[36][41].alive = true;
  
  board[37][41].alive = true;
  board[42][41].alive = true;
  
  // Yellow cells
  // 20-3 = 17
  board[29][17].alive = true;
  board[30][17].alive = true;
  board[35][17].alive = true;
  board[36][17].alive = true;
  
  // 20 - 2 = 18
  board[29][18].alive = true;
  board[35][18].alive = true;
  
  // 20 - 1 = 19
  board[24][19].alive = true;
  board[25][19].alive = true;
  board[31][19].alive = true;
  board[37][19].alive = true;
  board[45][19].alive = true;
  board[46][19].alive = true;
  
  // 20 - 0 = 20
  board[23][20].alive = true;
  board[46][20].alive = true;
  
  // 21
  board[19][21].alive = true;
  board[20][21].alive = true;
  
  // 22
  board[19][22].alive = true;
  
  // 23
  board[47][23].alive = true;
  
  // 24
  board[48][24].alive = true;
  
  // 25
  board[48][25].alive = true;
  
  // 20 + 9 = 29
  board[49][29].alive = true;
  board[50][29].alive = true;
  
  // 20 + 10 = 30
  board[19][30].alive = true;
  board[50][30].alive = true;
  
  // 20 + 11 = 31
  board[17][31].alive = true;
  board[48][31].alive = true;
  
  // 20 + 12 = 32
  board[17][32].alive = true;
  board[18][32].alive = true;
  
  // 20 + 16 = 36
  board[19][36].alive = true;
  
  // 20 + 17 = 37
  board[19][37].alive = true;
  
  // 20 + 18 = 38
  board[20][38].alive = true;
  
  // 20 + 19 = 39
  board[48][39].alive = true;
  
  // 20 + 20 = 40
  board[47][40].alive = true;
  board[48][40].alive = true;
  
  // 20 + 21 = 41
  board[21][41].alive = true;
  board[44][41].alive = true;
  
  // 20 + 22 = 42
  board[21][42].alive = true;
  board[22][42].alive = true;
  
  board[30][42].alive = true;
  
  board[36][42].alive = true;
  
  board[42][42].alive = true;
  board[43][42].alive = true;
  
  // 20 + 23 = 43
  board[32][43].alive = true;
  board[38][43].alive = true;
  
  // 20 + 24 = 44
  board[31][44].alive = true;
  board[32][44].alive = true;
  
  board[37][44].alive = true;
  board[38][44].alive = true;
}