title = "cityplan";

description = `
`;

characters = [];

let width = 100;
let height = 100;

options = {
  viewSize: {
  x: width,
  y: height,
  }
};

function update() {
  if (!ticks) {
    // drawGrid(10,1);
  }
  drawGrid(8,8,8);
  // line(8,0,8,height,1);
  // line(0,8,width,8,1);
}

function drawGrid(gSize,startx,starty){
  color("red");
  for(let x = 0; x <= width; x += gSize){
    // console.log("x=" + x);
    line(x,starty,x,height,1);
    line(x,starty+1,x,height+1,1);
    line(x,starty+2,x,height+2,1);
  }
  for(let y = 0; y <= height; y += gSize){
    // console.log("y="+ y);
    // console.log("x=" + x + " y="+ y);
    line(startx,y,width,y,1);
    line(startx+1,y,width+1,y,1);
    line(startx+2,y,width+2,y,1);
  }
}
