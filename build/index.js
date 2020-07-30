let demoContainer = document.querySelector('#container');
let imgTemplateTag = document.getElementById("img-template");
let imgTag = document.getElementById("img");
let c = document.createElement("canvas");
let addVertexsOrFindPathModeBtn = document.getElementById("toggle-two-mode");
let rmEditModeBtn = document.getElementById("rm-edit-mode");
let newVertexs = [];
let newInformation = [];
let imageData;
let countClick = 0;
let isFindPathMode = false;
let areMode = "add";
let coord_1 = {
  x: 0,
  y: 0
}    
//------------init for dataPath-----------------------
//This dataPath will get from database
let dataPath = {
  path: [
      //{
      //name: 12345_472, //example: from 12345 vertex to 472 => name: 12345_472,
      //length: 100, //length of the path 100 pixels
      //marked:{ //mark paths in array pixel
      //   //12345: 12346,
      //   //12346: 12347,
      //    ...
      // }   
      //},
  ],
  //vertexs:[337280, 103408, 1764892, 1834652, 1225040, 57748, 797004]      //saved vertexs
  //vertexs:[6362224, 6410292, 5618632]  //spkt
  vertexs:[],
  information:[
    //vertex: 337280,
    //name: ["abc", "edg"],
    //type: deg,
    //qty_care: 1
  ],
  width: imgTemplateTag.width,
  height: imgTemplateTag.height
};
//------------get dataPath from mongodb-------------------
// //get from database
window.onload = async function(){
  let res = await fetch('/preload');
  res = await res.json();
  if(res.width && res.width != 0)dataPath = res;
  console.log(dataPath); // parses JSON response into native JavaScript objects
  for(let i = 0; i < dataPath.vertexs.length; i++){
    let dest = document.createElement("img");
    dest.src = "/images/destination.png";
    dest.classList.add("dest");
    document.getElementById("container").appendChild(dest);
    dest.onload = function(){
      let y = Math.floor((dataPath.vertexs[i] / 4) / dataPath.width);  //row
      let x = (dataPath.vertexs[i] / 4) % dataPath.width;              //col
      dest.style.left = x - dest.width / 2;
      dest.style.top = y - dest.height;
      dest.id = `${dataPath.vertexs[i]}`;
      dest.addEventListener("click", function(event){
        if(isFindPathMode){
          chooseVertex(event);
        }
      })
    }
  }
}
//end---------get dataPath from mongodb----------------

document.getElementById("submit-dataPath").addEventListener("click",async function(event){
    const response = await fetch('/upload-data', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(dataPath) // body data type must match "Content-Type" header
    });
    if(response)console.log("Done!");
})
addVertexsOrFindPathModeBtn.addEventListener('click', function(event){
  if(!isFindPathMode){
    event.target.style.backgroundColor = "blue";
    event.target.innerHTML = "Add Vertexs";
    document.getElementById("mode").innerHTML = "Tìm đường giữa hai địa điểm";
    countClick = 0;
  }
  else{
    event.target.style.backgroundColor = "white";
    event.target.innerHTML = "Find Paths";
    document.getElementById("mode").innerHTML = "Thêm địa điểm";
    c.click();
    countClick = 0;
  }
  imgTemplateTag.classList.toggle("de-active");
  imgTag.classList.toggle("active");
  isFindPathMode = !isFindPathMode;
})
let ev;
imgTemplateTag.addEventListener('click', function(event){
  $('#addVertex').modal('show');
  ev = event;
  document.getElementById("submitVertex").addEventListener("click", function(){
    let nameVertex = document.getElementById("nameOfVertex");
    if(nameVertex.value && window.confirm("Bạn có chắc chứ?")){
      addingVertex(ev, nameVertex.value);
      nameVertex.value = '';
      $('#addVertex').modal('hide');
    }
  }, false)
})

function chooseVertex(event){
  countClick++;
  if(countClick == 1){
    coord_1 = Number(event.target.id);
    findPath(imgTag, coord_1);
    countClick = 0;
  }
}
function addingVertex(event, nameVertex){
  nameVertex = nameVertex.split("|");
  let coord = GetCoordinates(event, 'img-template');
  let posInArrayPixel_coord = (coord.y * imgTag.width + coord.x) * 4;
  newVertexs.push(posInArrayPixel_coord);
  //dataPath.vertexs.push(posInArrayPixel_coord);
  newInformation.push({
    vertex: posInArrayPixel_coord,
    name: nameVertex,
    qty_care: 0
  })
  let dest = document.createElement("img");
  dest.src = "/images/newdestination.png";
  dest.classList.add("dest");
  document.getElementById("container").appendChild(dest);
  dest.onload = function(){
    dest.style.left = coord.x - dest.width / 2;
    dest.style.top = coord.y - dest.height;
    dest.id = `${posInArrayPixel_coord}`;
    dest.addEventListener("click", function(event){
      if(isFindPathMode){
        chooseVertex(event);
      }
    })
  }
}
function getDataOfTemplateImage(){
  let c = document.createElement("canvas");
  c.width = imgTemplateTag.width;
  c.height = imgTemplateTag.height;
  let ctx = c.getContext("2d");
  ctx.drawImage(imgTemplateTag,  0, 0, imgTemplateTag.width, imgTemplateTag.height);
  return imageData = ctx.getImageData(0, 0, imgTemplateTag.width, imgTemplateTag.height);
}
function findPath(imgTag, coord_1){
  c.width = imgTag.width;
  c.height = imgTag.height;
  let ctx = c.getContext("2d");
  ctx.drawImage(imgTag,  0, 0, imgTag.width, imgTag.height);
  imageData = ctx.getImageData(0, 0, imgTag.width, imgTag.height);

  let startToTrackFull = coord_1;
  console.log(startToTrackFull);
  //This is setting up template
  let dataTrackFullSetup = trackFullSetup(getDataOfTemplateImage().data, imgTag.width, imgTag.height, startToTrackFull);
  //start tracking paths
  imageData = ctx.getImageData(0, 0, imgTag.width, imgTag.height);
  let data = trackPaths(imageData.data, imgTag.width, imgTag.height, dataPath, dataTrackFullSetup, startToTrackFull);

  //Tô màu đen lên các đường nối 2 điểm
  if(data)
    fillColorPathsOfTwoVertexs(imgTag, data, 0,0,0);
}
function fillColorPathsOfTwoVertexs(imgTag, data, r, g ,b){
  c.width = imgTag.width;
  c.height = imgTag.height;
  let ctx = c.getContext("2d");
  ctx.drawImage(imgTag,  0, 0, imgTag.width, imgTag.height);
  imageData = ctx.getImageData(0, 0, imgTag.width, imgTag.height);
  console.log(data);
  let count = 1;
  for(let i = 0; i < data.path.length; i++){
    //let prop = data.path[i]["name"].split("_")[0];
    // while(data.path[i].marked[prop]){
    //   imageData.data[prop] = r;
    //   imageData.data[prop + 1] = g;
    //   imageData.data[prop + 2] = b;
    //   prop = data.path[i].marked[prop];
    //   count++;
    //   if(!data.path[i].marked[prop])console.log(prop);
    // }
    for(let j in data.path[i].marked){
      imageData.data[data.path[i].marked[j]] = r;
      imageData.data[data.path[i].marked[j] + 1] = g;
      imageData.data[data.path[i].marked[j] + 2] = b;
      count++;
    }
  }
  console.log(count);
  ctx.putImageData(imageData, 0, 0);
  try {
    demoContainer.removeChild(imgTag);
  } catch (error) {}
  demoContainer.appendChild(c);
  c.addEventListener("click", function(event){
    try {
      demoContainer.removeChild(c);
    } catch (error) {
      
    }
    demoContainer.appendChild(imgTag);
  })
}
function fillColorAllOfPaths(imgTag, data, imageData){
  let ctx = c.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  demoContainer.removeChild(imgTag);
  demoContainer.appendChild(c);
  c.addEventListener("click", function(event){
    try {
      demoContainer.removeChild(c);
    } catch (error) {}
      demoContainer.appendChild(imgTag);
  })
}
