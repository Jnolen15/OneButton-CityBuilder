title = "cityplan";

description = `
`;

characters = [
`
bbbbb
b   b
b   b
b   b
bbbbb
`,
];

const S = {
	WIDTH: 100,     // Game Width
  HEIGHT: 100,    // Game Height
  GRIDSIZE: 10,   // Size of quares in the grid
  GRIDNUM: 8,     // Number of rows / columns in grid
  BOUNDX: 0,      // Grid buffer on x
  BOUNDY: 0       // Grid buffer on y
};

options = {
  viewSize: {
  x: S.WIDTH,
  y: S.HEIGHT,
  }
};

// Declaring stuff
let dict = new Map();
let cursor;

function update() {
  if (!ticks) {
    // Cursor
    cursor = vec(S.WIDTH * 0.5, S.HEIGHT * 0.5)

    // Setup Grid Dictionary
    for(let i = 1; i <= S.GRIDNUM; i++){
      for(let j = 1; j <= S.GRIDNUM; j++){
        const xpos = S.BOUNDX+(i*(S.GRIDSIZE));
        const ypos = S.BOUNDY+(j*(S.GRIDSIZE));
        const tempA = [xpos, ypos];
        const tempS = tempA.join(',');
        dict.set(tempS, "empty");
      }
    }
  }
  
  //Create Grid
  Filldict(S.GRIDNUM, S.GRIDSIZE, S.BOUNDX, S.BOUNDY);

  // Cursor
  color("light_purple");
  let mouse = rect(cursor, 1, 1);
  cursor = vec(input.pos.x - (input.pos.x % S.GRIDSIZE), input.pos.y - (input.pos.y % S.GRIDSIZE));
  
  // Cursor collison check
  colCheck(mouse)
  
}

/*function drawGrid(gSize,startx,starty){
  color("red");
  for(let x = 0; x <= S.WIDTH; x += gSize){
    // console.log("x=" + x);
    line(x,starty,x,S.HEIGHT,1);
    line(x,starty+1,x,S.HEIGHT+1,1);
    line(x,starty+2,x,S.HEIGHT+2,1);
  }
  for(let y = 0; y <= S.HEIGHT; y += gSize){
    // console.log("y="+ y);
    // console.log("x=" + x + " y="+ y);
    line(startx,y,S.WIDTH,y,1);
    line(startx+1,y,S.WIDTH+1,y,1);
    line(startx+2,y,S.WIDTH+2,y,1);
  }
}*/

function Filldict(num, size, boundx, boundy){
  for(let i = 1; i <= num; i++){
    for(let j = 1; j <= num; j++){
      const xpos = boundx+(i*(size));
      const ypos = boundy+(j*(size));
      const tempA = [xpos, ypos];
      const tempS = tempA.join(',');
      // Draw Land
      color("green");
      rect(xpos, ypos, size, size);
      // Draw Buildings
      if(dict.get(tempS)=="house"){
        color("black");
        char('a', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
      }
    }
  }
  //console.log(dict)
}

function colCheck(mouse){
  if(mouse.isColliding.rect.green){
    const xpos = input.pos.x - (input.pos.x % S.GRIDSIZE);
    const ypos = input.pos.y - (input.pos.y % S.GRIDSIZE);
    const tempA = [xpos, ypos];
    const tempS = tempA.join(',');

    // Highlight selected area with box
    color("yellow");
    rect(xpos, ypos, 1, S.GRIDSIZE);
    rect(xpos, ypos, S.GRIDSIZE, 1);
    rect(xpos+S.GRIDSIZE, ypos, 1, S.GRIDSIZE);
    rect(xpos, ypos+S.GRIDSIZE, S.GRIDSIZE+1, 1);

    // Place building
    if(input.isJustPressed){
      dict.set(tempS, "house");
      color("black");
      char('a', xpos+3, ypos+3);
    }
  }
}
