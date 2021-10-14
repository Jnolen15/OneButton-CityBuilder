title = "cityplan";

description = `   [TAP] to 
   place building
`;

characters = [
`
 bbb 
bb bb
b   b
b   b
bbbbb
`,
`
 bbb 
yb by
by yb
b y b
bybyb
`,
`
  l  
 lPl
lPPPl
lPlPl
lPlPl
`,
`
     
lllll
bbbbb
blblb
bbblb
`,
`
  l l
 lyly
lyyyy
lylyl
lylyl
`,
`
 GGG 
 GGG
 GGG
  l 
  l
`
];

const S = {
	WIDTH: 100,     // Game Width
  HEIGHT: 100,    // Game Height
  GRIDSIZE: 10,    // Size of quares in the grid
  GRIDNUM: 8,     // Number of rows / columns in grid
  BOUNDX: 0,      // Grid buffer on x
  BOUNDY: 0,       // Grid buffer on y
};

const B = {
  RESIDENTIAL: "c",
  COMMERCIAL: "d",
  INDUSTRIAL: "e",
  RECREATIONAL: "f",
}

options = {
  viewSize: {
  x: S.WIDTH,
  y: S.HEIGHT,
  }
};

// Declaring stuff
let dict = new Map();
let cursor;
let bankArray = [];
let tickCount = 0;
let clockWidth = (S.GRIDSIZE)+1;
let clockspeed = 10; //the number of ticks between clock incremental increase

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

    //Generate initial bank
    bankArray = this.genBank();
    console.log(bankArray);
  }
  //Increase clock
  tickCount++;
  if(tickCount%clockspeed == 0) {
    clockWidth++;
  }
  if(clockWidth > (S.GRIDSIZE/2+1)+S.GRIDSIZE+1+(S.GRIDSIZE)-2) { //Once clock cycle completes, reset
    clockWidth = S.GRIDSIZE+1;
    //INSERT CODE HERE TO TRIGGER EVENT ON CLOCK COMPLETION
  }
  
  //Draw Grid
  Filldict(S.GRIDNUM, S.GRIDSIZE, S.BOUNDX, S.BOUNDY);

  // Cursor
  color("light_purple");
  let mouse = rect(cursor, 1, 1);
  cursor = vec(input.pos.x - (input.pos.x % S.GRIDSIZE), input.pos.y - (input.pos.y % S.GRIDSIZE));

  // Render Bank
  renderBank();

  // Render Clock
  renderClock();
  
  // Cursor collison check
  colCheck(mouse)

  // Building check test
  buildingCheck();
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
      // Draw Buildings (PROBS SHOULD MAKE THIS A SWITCH STATEMET)
      if(dict.get(tempS)=="house"){ // House
        color("black");
        char('a', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
      } else if(dict.get(tempS)=="chouse"){ //condemned house
        color("black");
        char('b', xpos+(S.GRIDSIZE/2), ypos+(S.GRIDSIZE/2));
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
      // dict.set(tempS, bankArray[0]) //Feel free to fix, bankArray[0] always has the building next up in the queue
      bankArray.splice(0,1); //Clears top building from stack
      bankArray.push(randBuilding()); //Adds new random building to the end of the array

      dict.set(tempS, "house");
      color("black");
      char('a', xpos+3, ypos+3);
    }
  }
}

function buildingCheck(){
  // Check each space on the grid
  for (const [key, value] of dict) {
      // THIS IS JUST AN EXAMPLE FOR NOW
      // If a house has 2 more houses next to it, condemn it
    if(value == "house"){
      // Gt surrounding spaces
      const pos = key.split(",");
      const xpos = parseInt(pos[0]);
      const ypos = parseInt(pos[1]);
      const up = [xpos, ypos-S.GRIDSIZE].join(',');
      const down = [xpos, ypos+S.GRIDSIZE].join(',');
      const left = [xpos-S.GRIDSIZE, ypos].join(',');
      const right = [xpos+S.GRIDSIZE, ypos].join(',');

      // check surrounding spaces
      let condemnNum = 0;
      if(dict.get(up) == "house" || dict.get(up) == "chouse") condemnNum++;
      if(dict.get(down) == "house" || dict.get(down) == "chouse") condemnNum++;
      if(dict.get(left) == "house" || dict.get(left) == "chouse") condemnNum++;
      if(dict.get(right) == "house" || dict.get(right) == "chouse") condemnNum++;
      
      if(condemnNum >= 2) dict.set(key, "chouse");
    }
  }
}

//Generate initial bank
function genBank(){
  let returnArray = [];
  for(let i = 0; i < 4; i++) {
    returnArray.push(randBuilding());
  }
  return returnArray;
}

//Return a random building
function randBuilding(){
  let buildingIndex = [B.RESIDENTIAL,B.COMMERCIAL,B.INDUSTRIAL,B.RECREATIONAL]
  return buildingIndex[Math.floor(Math.random()*buildingIndex.length)]
}

//Draw the bank
function renderBank(){
  let x = (S.WIDTH/S.GRIDSIZE)+(S.GRIDSIZE*2);
  let y = (S.GRIDSIZE*S.GRIDNUM)+S.GRIDSIZE;
  let w = ((S.WIDTH/S.GRIDSIZE)*S.GRIDNUM)-(S.GRIDSIZE*4);
  let h = S.GRIDSIZE;
  let o = 1;

  color("black"); //Draw the outline
  rect(x,y,w,h);
  color("white"); //Draw the inner white rectangle
  rect(x+o,y+o,w-(2*o),h-(2*o));

  color("black"); //Draw the buildings in the bank
  let i = 0;
  for(const element of bankArray) {
    char(element,(x+(S.GRIDSIZE*i))+(4*o),y+(S.GRIDSIZE/2));
    i++;
  }
  text("bank",x+(S.GRIDSIZE*4)+(3*o),y+(S.GRIDSIZE/2));
}

function renderClock(){
  //Draw red rectangle
  let x = S.GRIDSIZE;
  let y = S.HEIGHT-S.GRIDSIZE+2;
  let h = S.GRIDSIZE/2+1;
  color("red");
  rect(x,y,x+h,h);
  //Draw white rectangle on top
  color("white")
  let w = (x-2)-(clockWidth-(x+1));
  rect(clockWidth,y+1,w+h,h-2);
}
