let demoContainer = document.querySelector('.demo-container');
let imageData;
let countClick = 0;
document.getElementById("image").onchange = function(e){
let fileReader = new FileReader();
let coord_1 = {
  x: 0,
  y: 0
}
let coord_2 = {
  x: 0,
  y: 0
}
fileReader.onloadend = function(){
  let imgTag = document.createElement('img');
  let resultReadFile = fileReader.result;
  imgTag.src = resultReadFile;
  imgTag.id = "img";
  document.getElementById("container").appendChild(imgTag);
  imgTag.onload = function(){
    document.getElementById("img").addEventListener('click', function(event){
      findPath(imgTag);
    })
  }
}
fileReader.readAsDataURL(e.target.files[0]);
}

function findPath(imgTag){
  let c = document.createElement("canvas");
  c.width = imgTag.width;
  c.height = imgTag.height;
  let ctx = c.getContext("2d");
  ctx.drawImage(imgTag,  0, 0, imgTag.width, imgTag.height);
  imageData = ctx.getImageData(0, 0, imgTag.width, imgTag.height);


let dataPath = {
    marked: {
      
    }
  };    

  //Tô màu đen lên các đường nối 2 điểm
  fillColorPathsOfTwoVertexs(c, imgTag, dataPath, 0,0,0);
}
function fillColorPathsOfTwoVertexs(c, imgTag, data, r, g ,b){
  c.width = imgTag.width;
  c.height = imgTag.height;
  let ctx = c.getContext("2d");
  ctx.drawImage(imgTag,  0, 0, imgTag.width, imgTag.height);
  imageData = ctx.getImageData(0, 0, imgTag.width, imgTag.height);
  //console.log(data);
  let count = 1;
    let prop = data.marked["791248"]
    // while(data.marked[prop]){
    //   imageData.data[prop] = r;
    //   imageData.data[prop + 1] = g;
    //   imageData.data[prop + 2] = b;
    //   prop = data.marked[prop];
    //   count++;
    //   if(!data.marked[prop])console.log(prop);
    // }
    for(let i in data.marked){
          imageData.data[data.marked[i]] = r;
          imageData.data[data.marked[i] + 1] = g;
          imageData.data[data.marked[i] + 2] = b;
          count++;
    }
  console.log(count);
  ctx.putImageData(imageData, 0, 0);
  demoContainer.removeChild(imgTag);
  demoContainer.appendChild(c);
  c.addEventListener("click", function(event){
      demoContainer.removeChild(c);
      demoContainer.appendChild(imgTag);
  })
}