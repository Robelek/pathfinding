const tileTemplate = document.querySelector(".tile");
const gridContainer = document.querySelector(".grid-container");

gridContainer.removeChild(tileTemplate);
const selects = document.querySelector(".selectContainer").children;
//console.log(selects);
//console.log(selects[0].classList);
const sizeXElement= document.querySelector("#xSize");
const sizeYElement= document.querySelector("#ySize");
let sizeX=0;
let sizeY=0;

let startTile = null;
let endTile = null;

let allTiles = [];

let currentMode = "test";
function renderCurrentValues(tileElement)
{
 // console.log(tileElement.id);
  let id = parseInt(tileElement.id);
  tileElement.querySelector(".gCost").textContent=allTiles[id].gCost;
  tileElement.querySelector(".hCost").textContent=allTiles[id].hCost;
  tileElement.querySelector(".fCost").textContent=allTiles[id].fCost;
}
function changeMode(element)
{
  currentMode=element.value;
  for(let i=0;i<selects.length;i++)
  {
   if(selects[i].classList.contains("current"))
   {
     selects[i].classList.remove("current");
   }
   
  }
  element.classList.add("current");
    
  
  element.classList.add("current");
}
function Tile(id)
{
  this.tileID=id;
  this.position = idToVector2(id);
  this.tileType = "empty";
  this.fCost = null;
  this.gCost = null;
  this.hCost = null;
  this.parent = null;
  this.tempParent = null;
  
}
function Vector2(x, y)
{
  this.x = x;
  this.y = y;
}
Vector2.prototype.add = function(secondVector)
  {
    return new Vector2(this.x+secondVector.x, this.y+secondVector.y);
  }
 Vector2.prototype.distanceTo = function(secondVector)
 {
   let x1 = this.x;
   let x2 = secondVector.x;
   let y1 = this.y;
   let y2 = secondVector.y;
   let a, b = 0;
   if(x1>=x2)
   {
     a=x1-x2;
   }
   else 
   {
     a=x2-x1;
   }
   if(y1>=y2)
   {
     b=y1-y2;
   }
   else 
   {
     b=y2-y1;
   }
   return Math.floor(Math.sqrt(a*a+b*b)*10);
 
}
let vec1 = new Vector2(5,0);
let vec2 = new Vector2(-2,0);
console.log(vec1.distanceTo(vec2));
function idToVector2(id)
{
//  console.log(typeof id, typeof sizeX);
  let y=Math.floor(id/sizeX);
  let x=id%sizeX;
  return new Vector2(x, y);
}
function vector2ToID(vector)
{
  return vector.y*sizeX+vector.x;
}
function isLegit(pos)
{
 // console.log(pos);
  if(pos.x>=0&&pos.x<sizeX&&pos.y>=0&&pos.y<sizeY)
{
let tileID = vector2ToID(pos);
  let tile = allTiles[tileID];
  if(tile.tileType!=="obstacle"&&tile.tileType!=="start")
  {
    return true;
  }
}
  
 
  return false;
}

//dziala wysmienicie
function findNearbyTiles(tile)
{
  let position = tile.position;
  //console.log(`pos ${position}`);
  let nearbyTiles= [];
  for(let x=-1;x<=1;x++)
  {
    for(let y=-1;y<=1;y++)
    {
      if(x!=0||y!=0)
      {
        let newPosition = position.add(new Vector2(x, y));
        if(isLegit(newPosition))
        {
          let currentTile=allTiles[vector2ToID(newPosition)];
          //currentTile.tempParent=tile;
          nearbyTiles.push(currentTile);
        }
      }
    }
  }
  return nearbyTiles;
}

function tileClick(tileElement)
{
  let tile = allTiles[tileElement.id];
  //console.log(position);
  switch(currentMode)
  { 
    case "test":
      console.log("------------");
      console.log(`tileID: ${tile.tileID}`);
      console.log(`Position: ${tile.position.x},${tile.position.y}`);
      console.log(`Tiletype: ${tile.tileType}`);
      console.table(findNearbyTiles(tile));
      break;
    case "start":
      if(startTile!==null)
      {
        let prevTile= allTiles[startTile];
        prevTile.tileType="empty"; 
        prevTile.gCost = 0;
        prevTile.hCost = 0;
        prevTile.fCost = 0;
        let prevElement = document.getElementById(startTile);
        
        renderCurrentValues(prevElement);
        prevElement.classList = ["tile"];
      }
      startTile=tile.tileID;
      tileElement.classList.add("start");
      tile.tileType = "start";
      tile.gCost = null;
      tile.hCost = null;
      tile.fCost = null;
      renderCurrentValues(tileElement);
      
      

    //  console.log("Set start");
      break;
     case "end":
      if(endTile!==null)
      {
        let prevTile= allTiles[endTile];
        prevTile.tileType="empty"; 
        let prevElement = document.getElementById(endTile);
        prevElement.classList = ["tile"];
        prevTile.hCost= 0;
        prevTile.gCost = 0;
        prevTile.fCost = 0;
        renderCurrentValues(prevElement);
      }
      endTile=tile.tileID;
      tileElement.classList.add("end");
      tile.tileType = "end";
      tile.gCost = null;
      tile.hCost = null;
      tile.fCost = null;
      renderCurrentValues(tileElement);
    //  console.log("Set start");
      break;
     case "obstacle":
      if(tileElement.classList.contains("obstacle"))
      {
        tile.tileType="empty"; 
      
        tileElement.classList = ["tile"];
      tile.gCost = 0;
      tile.hCost = 0;
      tile.fCost = 0;
      renderCurrentValues(tileElement);
      }
      else
      {
      tile.tileType="obstacle";
      tileElement.classList.add("obstacle");
      tile.gCost = null;
      tile.hCost = null;
      tile.fCost = null;
      renderCurrentValues(tileElement);
      }
      
    //  console.log("Set start");
      break;
    default:
  }
  
}
function compareFunction(a, b)
{
  if(a.fCost==b.fCost)
  {
    return 0;
  }
  if(a.fCost<b.fCost)
  {
    return -1;
  }
  if(a.fCost>b.fCost)
  {
    return 1;
  }
}
let test = [];
test.push(new Tile(69));
test.push(new Tile(70));
test.push(new Tile(71));
test[1].fCost = 23;
test[2].fCost = 1;
test[0].fCost = 8;
 test.sort(compareFunction);
console.table(test);

let limitTiles=2000;
let checkedTiles=0;

function findPath()
{
  if(startTile!==null&&endTile!==null)
{
  start = allTiles[startTile];
  end = allTiles[endTile];
  let open= [start];
  let closed = [];
  let thisTile = null;
  while(thisTile!=end&&open.length>0&&checkedTiles<limitTiles)
  {
    checkedTiles++;
    console.log(open);
    open.sort(compareFunction);
    thisTile=open[0];
    if(thisTile==end)
    {
      open=[];
    }
    else
{
  
    open.splice(0, 1);
    closed.push(thisTile);
    let nearby = findNearbyTiles(thisTile);
    for(let i=0;i<nearby.length;i++)
    {
      if(nearby[i].tileType!=="start"&&nearby[i]!=="obstacle"&&closed.includes(nearby[i])===false)
      {
        nearby[i].tempParent=thisTile;
        let currentTile = nearby[i];
   
   //console.log(currentTile);
    let hCost = currentTile.position.distanceTo(currentTile.tempParent.position)+currentTile.tempParent.hCost;
    
    
    if(hCost<currentTile.hCost||currentTile.parent===null)
    {
      let gCost = currentTile.position.distanceTo(end.position);
    let fCost = gCost+hCost;
    
      currentTile.parent= currentTile.tempParent;
      currentTile.hCost = hCost;
      currentTile.gCost = gCost;
      currentTile.fCost = fCost;
      //tu się kraczy, bo id nie widzi
      let tileElement = document.getElementById(currentTile.tileID);
    //  console.log(`${typeof hCost}, ${typeof gCost}, ${typeof fCost}`);
      renderCurrentValues(tileElement);
    }
        open.push(nearby[i]);
      }
      
    }
}
  
    
    
  }
  }
  retracePath();
}

function retracePath()
{
  allTiles[endTile].parent = allTiles[endTile].tempParent;
  let currentTile=allTiles[endTile].parent;
  while(currentTile!=allTiles[startTile])
  {
    let element = document.getElementById(currentTile.tileID);
    element.classList.add("path");
    currentTile=currentTile.parent;
  }
}
 

function newGrid(e)
{
 e.preventDefault();
 e.stopPropagation();
 let child = gridContainer.lastElementChild;
 while(child)
 {
   gridContainer.removeChild(child);
   child = gridContainer.lastElementChild;
 }
 allTiles=[];
 sizeX= parseInt(sizeXElement.value);
 sizeY= parseInt(sizeYElement.value);
 startTile=null;
 endTile=null;
 gridContainer.style.gridTemplateColumns= `repeat(${sizeX}, 1fr)`;
 for(let i=0; i<sizeY;i++)
 {
   for(let j=0;j<sizeX;j++)
   {
     let newNode = tileTemplate.cloneNode(true);
    let newID=i*sizeX+j;
   

   
   newNode.id=newID;
   let newTile = new Tile(newID);
   allTiles.push(newTile);
   gridContainer.appendChild(newNode);
   }
   
 }
 
}