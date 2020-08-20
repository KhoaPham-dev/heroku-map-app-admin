//Khoathiioe
function trackFullDoing(pixels, width, height, d, c) {
  let dataMarked = {};
  let count = 0;
  let positionInPixelsArray = (d * width + c) * 4;
  let queuePosition = -1;
  let queue = new Int32Array(pixels.length / 4);

  if (colorFn(pixels[positionInPixelsArray], pixels[positionInPixelsArray + 1], pixels[positionInPixelsArray + 2], pixels[positionInPixelsArray + 3])) {
    count++;
    pixels[positionInPixelsArray] = 0;
    pixels[positionInPixelsArray + 1] = 0;
    pixels[positionInPixelsArray + 2] = 0;
    queue[++queuePosition] = positionInPixelsArray;
  }

  while(queuePosition>=0){
  //xét 8 ô xung quanh ô (d,c)
    let flag = false;
    for (let i = -1; i <= 1; i++){
      for (let j = -1; j <= 1; j++){
        let anAroundPositionInPixelsArray =  ((d + i) * width + (c + j)) * 4;
        if ((d + i) >= 0
          && (d + i) < height
          && (c + j) >= 0
          && (c + j) < width
          && colorFn(pixels[anAroundPositionInPixelsArray], pixels[anAroundPositionInPixelsArray + 1], pixels[anAroundPositionInPixelsArray + 2], pixels[anAroundPositionInPixelsArray + 3]))	{//nếu là số 0 thì gọi đệ quy để loang
            count++;
            pixels[anAroundPositionInPixelsArray] = 0;
            pixels[anAroundPositionInPixelsArray + 1] = 0;
            pixels[anAroundPositionInPixelsArray + 2] = 0;
            queue[++queuePosition] = anAroundPositionInPixelsArray;
            if(!dataMarked.hasOwnProperty(`${positionInPixelsArray}`))
              dataMarked[positionInPixelsArray] = [anAroundPositionInPixelsArray];
            else
              dataMarked[positionInPixelsArray].push(anAroundPositionInPixelsArray);
            positionInPixelsArray = anAroundPositionInPixelsArray;
            flag = true;
            break;
          }	
      }
      if(flag) break;
    }
    if(!flag){
      queuePosition--;
      positionInPixelsArray = queue[queuePosition];
    }
    d = Math.floor((positionInPixelsArray / 4) / width);
    c = Math.floor((positionInPixelsArray / 4) % width);
  }
  return {
    count,
    dataMarked,
  }
}
//track all of paths in map
function trackFullSetup(pixels, width, height, currPosInPxsArr) {
  let data = {
    //name: first pixel,
    //sum: value,
    //marked:{ //mark paths in array pixel
    //}            
  };
  let nameOfPath; //Name is first pixel of the path
  let d = Math.floor((currPosInPxsArr / 4) / width);  //row
  let c = Math.floor((currPosInPxsArr / 4) % width);              //col
  if (colorFn(pixels[currPosInPxsArr], pixels[currPosInPxsArr + 1], pixels[currPosInPxsArr + 2], pixels[currPosInPxsArr + 3])) {
  nameOfPath = currPosInPxsArr;
  let result = trackFullDoing(pixels, width, height, d, c);
    data["first"] = nameOfPath;
    data["sum"] = result.count;
    data["marked"] = result.dataMarked;
  }
  return data;
};
let isNewAddedPath = false;
function trackPaths(pixels, width, height, data, dataTrackFullSetup, start) {
  if (isCorrectPixel(start, dataTrackFullSetup) && newVertexs.includes(start)) {
      nonrecursive(pixels, data, width, height, start, dataTrackFullSetup);
      if(isNewAddedPath){
        dataPath.vertexs.push(start);
        newVertexs.splice(newVertexs.indexOf(start), 1);

        dataPath.information.push(newInformation.find(e=>{return e.vertex == start}));
        newInformation.splice(newInformation.findIndex(e=>{return e.vertex == start}), 1);

        document.getElementById(`${start}`).src = "/images/destination.png";
        isNewAddedPath = false;
        return data;
      }
      else {
        alert("Không thêm được đường nào!");
        return undefined;
      }
  }   
  else if(!newVertexs.includes(start))alert("Vị trí này đã được thêm vào!");
  return undefined;
};
function colorFn(r, g, b) {
  //if (r >= 100 && r <= 135 && g >= 170 && g <= 205 && b >= 120 && b <= 155) {
  if (r >= 240 && r <= 255 && g >= 240 && g <= 255 && b >= 240 && b <= 255) {
    return true;
  }
  return false;
}
function isCorrectPixel(r, dataTrackFullSetup){
  if(dataTrackFullSetup.marked && dataTrackFullSetup.marked[r]) return true;
  return false;
}
function FindPosition(oElement)
{
if(typeof( oElement.offsetParent ) != "undefined")
{
  for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
  {
    posX += oElement.offsetLeft;
    posY += oElement.offsetTop;
  }
    return [ posX, posY ];
  }
  else
  {
    return [ oElement.x, oElement.y ];
  }
}

function GetCoordinates(e, id)
{
var PosX = 0;
var PosY = 0;
var ImgPos;
var myImg = document.getElementById(id);
ImgPos = FindPosition(myImg);
if (!e) var e = window.event;
if (e.pageX || e.pageY)
{
  PosX = e.pageX;
  PosY = e.pageY;
}
else if (e.clientX || e.clientY)
  {
    PosX = e.clientX + document.body.scrollLeft
      + document.documentElement.scrollLeft;
    PosY = e.clientY + document.body.scrollTop
      + document.documentElement.scrollTop;
  }
PosX = PosX - ImgPos[0];
PosY = PosY - ImgPos[1];
return {
  x: PosX,
  y: PosY
}
}
function radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count){
    if(!isCorrectPixel(currPosInPxsArr, dataTrackFullSetup)
      &&  (pixels[currPosInPxsArr] != 0 && pixels[currPosInPxsArr + 1] != 0 && pixels[currPosInPxsArr + 2] != 0)) return;
  
      let d = Math.floor((currPosInPxsArr / 4) / width);  //row
      let c = Math.floor((currPosInPxsArr / 4) % width);              //col
      let e = 0, w = 0, s = 0, n = 0, en = 0, es = 0, ws = 0, wn = 0;
      let t = currPosInPxsArr; //temp
      let i = areaTest //temp
      //Northern
      while(d >= 0 && d < height
      && i >= 0
      && (isCorrectPixel(t, dataTrackFullSetup) 
          || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
      ){
        d--;
        t = (d * width + c) * 4;
        n++;
        let _isDone = isDone(width, t, areaTest, data, 'n', addedDestinations, currDir == 'n' ? count : 4);
        if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
          return {
            dir: 'n',
            points: n + _isDone.points,
            end: _isDone.vertex
          }
        i--;
      }
  
      //reset t, d, i
      d = Math.floor((currPosInPxsArr / 4) / width);
      t = currPosInPxsArr;
      i = areaTest;
      //Southern
      while(d >= 0 && d < height
        && i >= 0
        && (isCorrectPixel(t, dataTrackFullSetup) 
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          d++;
          t = (d * width + c) * 4;
          s++;
          let _isDone = isDone(width, t, areaTest, data, 's', addedDestinations, currDir == 's' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 's',
              points: s + _isDone.points,
              end: _isDone.vertex
            }
          i--;
        }
  
      //reset t, d, i
      t = currPosInPxsArr;
      d = Math.floor((currPosInPxsArr / 4) / width);
      i = areaTest;
      //Western
      while(c >= 0 && c < width
        && i >= 0
        && (isCorrectPixel(t, dataTrackFullSetup) 
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c--;
          t = (d * width + c) * 4;
          w++;
          let _isDone = isDone(width, t, areaTest, data, 'w', addedDestinations, currDir == 'w' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'w',
              points: w + _isDone.points,
              end: _isDone.vertex
            }
          i--;
        }
  
      //reset t, c, i
      t = currPosInPxsArr;
      c = (currPosInPxsArr / 4) % width;
      i = areaTest;
      //Eastern
      while(c >= 0 && c < width
        && i >= 0
        && (isCorrectPixel(t, dataTrackFullSetup) 
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c++;
          t = (d * width + c) * 4;
          e++;
          let _isDone = isDone(width, t, areaTest, data, 'e', addedDestinations, currDir == 'e' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'e',
              points: e + _isDone.points,
              end: _isDone.vertex
            }
          i--;
        }
  
      //reset t, c, d
      t = currPosInPxsArr;
      c = Math.floor((currPosInPxsArr / 4) % width);
      d = Math.floor((currPosInPxsArr / 4) / width);
      //EN
      while(d >= 0 && d < height && c >= 0 && c < width
        && (isCorrectPixel(t, dataTrackFullSetup)
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c++;
          d--;
          t = (d * width + c) * 4;
          en++;
          let _isDone = isDone(width, t, areaTest, data, 'en', addedDestinations, currDir == 'en' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'en',
              points: en + _isDone.points,
              end: _isDone.vertex
            }
        }
      
      //reset t, c, d
      t = currPosInPxsArr;
      c = Math.floor((currPosInPxsArr / 4) % width);
      d = Math.floor((currPosInPxsArr / 4) / width);
      //ES
      while(d >= 0 && d < height && c >= 0 && c < width
        && (isCorrectPixel(t, dataTrackFullSetup)
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c++;
          d++;
          t = (d * width + c) * 4;
          es++;
          let _isDone = isDone(width, t, areaTest, data, 'es', addedDestinations, currDir == 'es' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'es',
              points: es + _isDone.points,
              end: _isDone.vertex
            }
        }
  
      //reset t, c, d
      t = currPosInPxsArr;
      c = Math.floor((currPosInPxsArr / 4) % width);
      d = Math.floor((currPosInPxsArr / 4) / width);
      //WS
      while(d >= 0 && d < height && c >= 0 && c < width
        && (isCorrectPixel(t, dataTrackFullSetup)
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c--;
          d++;
          t = (d * width + c) * 4;
          ws++;
          let _isDone = isDone(width, t, areaTest, data, 'ws', addedDestinations, currDir == 'ws' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'ws',
              points: ws + _isDone.points,
              end: _isDone.vertex
            }
        }
      //reset t, c, d
      t = currPosInPxsArr;
      c = Math.floor((currPosInPxsArr / 4) % width);
      d = Math.floor((currPosInPxsArr / 4) / width);
      //WN
      while(d >= 0 && d < height && c >= 0 && c < width
        && (isCorrectPixel(t, dataTrackFullSetup) 
            || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
        ){
          c--;
          d--;
          t = (d * width + c) * 4;
          wn++;
          let _isDone = isDone(width, t, areaTest, data, 'wn', addedDestinations, currDir == 'wn' ? count : 4);
          if(!(pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0) && _isDone && !isCrossed)
            return {
              dir: 'wn',
              points: wn + _isDone.points,
              end: _isDone.vertex
            }
        }
  
      return {
        w,e,s,n,es,en,ws,wn
      }
}
function tobeMiddle(res, width, currPosInPxsArr, areaTest, currDir, subDir){
  let d = Math.floor((currPosInPxsArr / 4) / width);  //row
  let c = Math.floor((currPosInPxsArr / 4) % width);              //col
  let t;
  let count = 0;
  let dir = {
    w: false,
    e: false,
    s: false,
    n: false
  }
  if(res.w >= areaTest || (res.w >= areaTest / 2 && currDir == 'w')){count++; dir.w = true;};
  if(res.s >= areaTest || (res.s >= areaTest / 2 && currDir == 's')){count++; dir.s = true;};
  if(res.e >= areaTest || (res.e >= areaTest / 2 && currDir == 'e')){count++; dir.e = true;};
  if(res.n >= areaTest || (res.n >= areaTest / 2 && currDir == 'n')){count++; dir.n = true;};
  if (count == 2 && !subDir[currDir] && (res.w + res.e < areaTest + 2 || res.n + res.s < areaTest + 2)){
    //w, e
    if(!dir.w && !dir.e && (currDir == 's' || currDir == 'n')){
      t = Math.floor((res.w + res.e - 1) / 2) + 1 - res.w;
      c+=t;
    }
      //n, s
    else if(!dir.n && !dir.s && (currDir == 'w' || currDir == 'e')){
      t = Math.floor((res.n + res.s - 1) / 2) + 1 - res.n;
      d+=t;
    }
  }
  else if(count <= 2 && subDir[currDir]){
    c = c + (areaTest / 2 - res.w);
  }
  return (d * width + c) * 4;
}
function isDone(width, currPosInPxsArr, areaTest, data, radarDir, addedDestinations, count){
//current position
    let d = Math.floor((currPosInPxsArr / 4) / width);  //row
  let c = Math.floor((currPosInPxsArr / 4) % width);              //col
  if(count > 1)areaTest = 4;
for(let i = 0; i < data.vertexs.length; i++){
    if(addedDestinations.findIndex(e=>{return e.vertex == data.vertexs[i] && e.reachedDir == radarDir || (e.reachedDir == '' && this.length > 1)}) == -1){
      //End position
      let dEnd = Math.floor((data.vertexs[i] / 4) / width);  //row
      let cEnd = (data.vertexs[i] / 4) % width;     //col

      if(d == dEnd && Math.abs(cEnd - c) <= areaTest / 2)return {
        vertex: data.vertexs[i],
        points: cEnd - c
      };
      if(c == cEnd && Math.abs(dEnd - d) <= areaTest / 2)return {
        vertex: data.vertexs[i],
        points: dEnd - d
      };
    }
}

return undefined;
}
function backTracking(originalPixels, pixels, queue, queueDir, marked, subDir, dir, 
                    currPosInPxsArr, currDir, queuePosition, width, jump, start){
  let newCurrPosInPxsArr;
  do{        
    currPosInPxsArr = queue[queuePosition];
    currDir = queueDir[queuePosition--];
    if(currDir == '') return;
    let d = Math.floor((currPosInPxsArr / 4) / width);  //row
    let c = Math.floor((currPosInPxsArr / 4) % width);              //col
    newCurrPosInPxsArr = dir[currDir] ? ((d + dir[currDir]['d'] * jump) * width + (c + dir[currDir]['c'] * jump)) * 4
                            : ((d + subDir[currDir]['d'] * jump) * width + (c + subDir[currDir]['c'] * jump)) * 4;
    let marked_2 = {};
    //xóa trắng pixels
    pixels.set(originalPixels);
    //Và xóa đánh dấu
    let prop = start;
    pixels[prop] = -2;
    pixels[prop + 1] = -2;
    pixels[prop + 2] = -2;
    pixels[prop + 3] = -2;
    while(prop != currPosInPxsArr && prop != undefined){
      marked_2[prop] = marked[prop];
      prop = marked[prop];
      pixels[prop] = -2;
      pixels[prop + 1] = -2;
      pixels[prop + 2] = -2;
      pixels[prop + 3] = -2;
    }
    marked = {...marked_2};
  }while(marked[newCurrPosInPxsArr]);
  //Nối lại với hướng mới
  marked[currPosInPxsArr] = newCurrPosInPxsArr;
  //reverseMarked[newCurrPosInPxsArr] = currPosInPxsArr;
  currPosInPxsArr = newCurrPosInPxsArr
  backTrack = true;
  return {
    backTrack,
    currPosInPxsArr,
    currDir,
    queuePosition,
    pixels,
    marked
}
}
function findAreaTest(pixels, width, height, currPosInPxsArr, areaTest, currDir, dataTrackFullSetup){
  let d = Math.floor((currPosInPxsArr / 4) / width);  //row
  let c = Math.floor((currPosInPxsArr / 4) % width);              //col
  let e = 0, w = 0, s = 0, n = 0, en = 0, es = 0, ws = 0, wn = 0;
  let t = currPosInPxsArr; //temp
  let count = 0;
  let subCount = 0;
  //#region 
  //Northern
  while(d >= 0 && d < height
  && (isCorrectPixel(t, dataTrackFullSetup)
      || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
  ){
    d--;
    t = (d * width + c) * 4;
    n++;
    }

  //reset t, d
  d = Math.floor((currPosInPxsArr / 4) / width);
  t = currPosInPxsArr;
  //Southern
  while(d >= 0 && d < height
    && (isCorrectPixel(t, dataTrackFullSetup)
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      d++;
      t = (d * width + c) * 4;
      s++;
    }

  //reset t, d
  t = currPosInPxsArr;
  d = Math.floor((currPosInPxsArr / 4) / width);
  //Western
  while(c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup) 
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c--;
      t = (d * width + c) * 4;
      w++;
    }

  //reset t, c
  t = currPosInPxsArr;
  c = (currPosInPxsArr / 4) % width;
  i = areaTest;
  //Eastern
  while(c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup) 
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c++;
      t = (d * width + c) * 4;
      e++;
    }

  //reset t, c, d
  t = currPosInPxsArr;
  c = (currPosInPxsArr / 4) % width;
  d = Math.floor((currPosInPxsArr / 4) / width);
  //EN
  while(d >= 0 && d < height && c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup)
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c++;
      d--;
      t = (d * width + c) * 4;
      en++;
    }
  
  //reset t, c, d
  t = currPosInPxsArr;
  c = (currPosInPxsArr / 4) % width;
  d = Math.floor((currPosInPxsArr / 4) / width);
  //ES
  while(d >= 0 && d < height && c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup) 
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c++;
      d++;
      t = (d * width + c) * 4;
      es++;
    }

  //reset t, c, d
  t = currPosInPxsArr;
  c = (currPosInPxsArr / 4) % width;
  d = Math.floor((currPosInPxsArr / 4) / width);
  //WS
  while(d >= 0 && d < height && c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup) 
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c--;
      d++;
      t = (d * width + c) * 4;
      ws++;
    }
  //reset t, c, d
  t = currPosInPxsArr;
  c = (currPosInPxsArr / 4) % width;
  d = Math.floor((currPosInPxsArr / 4) / width);
  //WN
  while(d >= 0 && d < height && c >= 0 && c < width
    && (isCorrectPixel(t, dataTrackFullSetup)
        || (pixels[t] == 0 && pixels[t + 1] == 0 && pixels[t + 2] == 0)) 
    ){
      c--;
      d--;
      t = (d * width + c) * 4;
      wn++;
    }
  //#endregion
  let dir = {
    w: {
    state: false,
    d: 0,
    c: -1,
    opp: 'e'
    },
    e: {
    state: false,
    d: 0,
    c: 1,
    opp: 'w'
    },
    s: {
    state: false,
    d: 1,
    c: 0,
    opp: 'n'
    },
    n: {
    state: false,
    d: -1,
    c: 0,
    opp: 's'
    }
  }
  let subDir = {
      wn: {
      state: false,
      d: -1,
      c: -1,
      opp: 'es'
      },
      ws: {
      state: false,
      d: 1,
      c: -1,
      opp: 'en'
      },
      en: {
      state: false,
      d: -1,
      c: 1,
      opp: 'ws'
      },
      es: {
      state: false,
      d: 1,
      c: 1,
      opp: 'wn'
      }
  }
  if(w >= areaTest || (w >= areaTest / 2 && currDir == 'w')){dir.w.state = true; count++};
  if(s >= areaTest || (s >= areaTest / 2 && currDir == 's')){dir.s.state = true; count++};
  if(e >= areaTest || (e >= areaTest / 2 && currDir == 'e')){dir.e.state = true; count++};
  if(n >= areaTest || (n >= areaTest / 2 && currDir == 'n')){dir.n.state = true; count++};
  if(en >= areaTest || (en >= areaTest / 2 && (currDir == 'en' || currDir == 'e' || currDir == 'n') || (currDir == '' && en >= areaTest / 4))){subDir.en.state = true; subCount++;};
  if(es >= areaTest || (es >= areaTest / 2 && (currDir == 'es' || currDir == 'e' || currDir == 's') || (currDir == '' && es >= areaTest / 4))){subDir.es.state = true; subCount++;};
  if(ws >= areaTest || (ws >= areaTest / 2 && (currDir == 'ws' || currDir == 'w' || currDir == 's') || (currDir == '' && ws >= areaTest / 4))){subDir.ws.state = true; subCount++;};
  if(wn >= areaTest || (wn >= areaTest / 2 && (currDir == 'wn' || currDir == 'w' || currDir == 'n') || (currDir == '' && wn >= areaTest / 4))){subDir.wn.state = true; subCount++;};

  if((currDir == 'w' || currDir == 'e') && count == 2 && !dir.n.state && !dir.s.state)
    if(Math.abs(areaTest - (n + s)) <= (n + s) * 0.5)
      areaTest = n + s;
  else if((currDir == 'n' || currDir == 's') && count == 2 && !dir.w.state && !dir.e.state)
    if(Math.abs(areaTest - (w + e)) <= (w + e) * 0.5)
        areaTest = w + e;
  else if((currDir == 'wn' || currDir == 'es') && subCount == 2 && !subDir.ws.state && !subDir.en.state)
    if(Math.abs(areaTest - (ws + en)) <= (ws + en) * 0.5)
        areaTest = ws + en;
  else if((currDir == 'ws' || currDir == 'en') && subCount == 2 && !subDir.wn.state && !subDir.es.state)
    if(Math.abs(areaTest - (wn + es)) <= (wn + es) * 0.5)
        areaTest = wn + es;
  else areaTest = DEFAULTAREATEST;
  return areaTest;
}
const DEFAULTAREATEST = 45;
function nonrecursive(pixels, data, width, height, start, dataTrackFullSetup) {
  const LIMIT_LENGTH_PATH = width / 5;
  let originalPixels = new Uint8ClampedArray(pixels);
  let jump = 1;
  let areaTest = DEFAULTAREATEST;
  let addedDestinations = [{
    reachedDir: '',
    vertex: start
  }];
  //let nuaduongcheo = Math.floor(areaTest*Math.sqrt(2));
  let backTrack = false;
  let marked = {}; //save path
  marked[start] = start;
  let isCrossed = false;
  let prevDir = {};
  let prevSubDir = {};
  let prevCurrDir;
  let prevSubCurrDir;
  let count = 0;
  //use for position
  let currPosInPxsArr = start;
  let queuePosition = -1;
  let queue = new Int32Array(pixels.length / 4);

  //use for direction
  let queueDir = [];
  let currDir = ''; //current direction of moving

  queue[++queuePosition] = currPosInPxsArr;
  queueDir[queuePosition] = currDir;

  //Init setting up
  let res = radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count = 0);
  if(!res)return;
  

  while(queuePosition>=0){
      let dir = {
          w: {
          state: false,
          d: 0,
          c: -1,
          opp: 'e'
          },
          e: {
          state: false,
          d: 0,
          c: 1,
          opp: 'w'
          },
          s: {
          state: false,
          d: 1,
          c: 0,
          opp: 'n'
          },
          n: {
          state: false,
          d: -1,
          c: 0,
          opp: 's'
          }
      }
      let subDir = {
          wn: {
          state: false,
          d: -1,
          c: -1,
          opp: 'es'
          },
          ws: {
          state: false,
          d: 1,
          c: -1,
          opp: 'en'
          },
          en: {
          state: false,
          d: -1,
          c: 1,
          opp: 'ws'
          },
          es: {
          state: false,
          d: 1,
          c: 1,
          opp: 'wn'
          }
      }

      let subCount = 0;
      //areaTest = findAreaTest(pixels, width, height, currPosInPxsArr, areaTest, currDir, dataTrackFullSetup);
      //Xác định loại đường (ngang, dọc, ngã ba, ngã tư, cụt đường)
      //ngang: s, w lớn hơn độ rộng đường
      //dọc: n, s lớn hơn độ rộng đường
      //ngã 3: 3 / 4 hướng có giá trị lớn hơn đô rộng đường
      //ngã 4: 4 / 4
      //đường cụt: 1 / 4 lớn hơn độ rộng đường
      //đường cong xấu: 0 / 4 hoặc 1 / 4 lớn hơn độ rộng đường (xử lý sau)
      res = radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count);
      if(!res){
          //backtrack về hướng mới
          let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
          currPosInPxsArr, currDir, queuePosition, width, jump, start);
          if(!result){
            console.log("end");
            return;
          }
          backTrack = result.backTrack;
          currPosInPxsArr = result.currPosInPxsArr;
          dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
          currDir = result.currDir;
          queuePosition = result.queuePosition;
          pixels.set(result.pixels);
          marked = {...result.marked};
      }
      //Đã đến nơi
      //Nếu tới rồi thì nối đến điểm cần đến đó, thêm một tên, đường đi và độ dài vào data.path
      else if(res.dir){
        //Nếu hướng tìm thấy điểm đến không trùng với hướng đang đi, 
        //đồng thời hướng đang đi là thuộc 4 hướng chính và hướng tìm thấy thuộc hướng phụ
        // thì mới thêm vào queue
        if(res.dir != currDir && subDir[res.dir] && dir[currDir]){
          queue[++queuePosition] = currPosInPxsArr;
          queueDir[queuePosition] = currDir;
        }
        let d = Math.floor((currPosInPxsArr / 4) / width);  //row
        let c = Math.floor((currPosInPxsArr / 4) % width);              //col
        for(let i = 1; i <= res.points; i++){
          let t = dir[res.dir] ? ((d + dir[res.dir]['d'] * jump * i) * width + (c + dir[res.dir]['c'] * jump * i)) * 4
                              : ((d + subDir[res.dir]['d'] * jump * i) * width + (c + subDir[res.dir]['c'] * jump * i)) * 4;
          marked[currPosInPxsArr] = t;
          currPosInPxsArr = t;
        }
        marked[currPosInPxsArr] = res.end;
        currPosInPxsArr = res.end;
        //nếu đoạn đường này chưa có thì mới thêm vào
        let isAvail = false;
        for(let j = 0; j < data.path.length; j++){
          let availPathNames = data.path[j]["name"].split("_");
          if(availPathNames.includes(`${start}`) && availPathNames.includes(`${currPosInPxsArr}`)){
            //Nếu độ dài đường mới ngắn hơn thì lấy đường mới, bỏ đường cũ
            if(Object.keys(marked).length + 1 < data.path[j]["length"])
              data.path.splice(j, 1);
            else isAvail = true;
            break;
          }
        }
        if(!isAvail){
          data.path.push({
            name: `${start}_${currPosInPxsArr}`,
            length: Object.keys(marked).length + 1,
            marked: {...marked}
          })
          addedDestinations.push({
            vertex: res.end,
            reachedDir: res.dir
          });
          isNewAddedPath = true;
        }
        //backtrack về hướng mới
        let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
            currPosInPxsArr, currDir, queuePosition, width, jump, start);
        if(!result){
          console.log("end");
          return;
        }
        backTrack = result.backTrack;
        currPosInPxsArr = result.currPosInPxsArr;
        dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
        currDir = result.currDir;
        queuePosition = result.queuePosition;
        pixels.set(result.pixels);
        marked = {...result.marked};
      }
      else{ 
        //Kiểm tra có phải điểm nằm chính giữa đường chưa
        //Nếu chưa phải thì di chuyển đến điểm chính giữa đường
        //Và xử lý xem có gặp lại điểm đã đi hay không
        let newCurrPosInPxsArr = tobeMiddle(res, width, currPosInPxsArr, areaTest, currDir, subDir);
        //Kiểm tra trùng đường đã đi
        //Và kiểm tra giới hạn ĐỘ DÀI ĐƯỜNG
        if((marked[newCurrPosInPxsArr] && currDir) || Object.keys(marked).length + 1 > LIMIT_LENGTH_PATH){
          console.log('trung hoac qua dai');
          //backtrack về hướng mới
          let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
              currPosInPxsArr, currDir, queuePosition, width, jump, start);
          if(!result){
            console.log("end");
            return;
          }
          backTrack = result.backTrack;
          currPosInPxsArr = result.currPosInPxsArr;
          dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
          currDir = result.currDir;
          queuePosition = result.queuePosition;
          pixels.set(result.pixels);
          marked = {...result.marked};
          res = radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count);
        }
        else if(newCurrPosInPxsArr != currPosInPxsArr){
          marked[currPosInPxsArr] = newCurrPosInPxsArr;
          //Đánh dấu điểm hiện tại đã đi qua
          pixels[currPosInPxsArr] = -2;
          pixels[currPosInPxsArr + 1] = -2;
          pixels[currPosInPxsArr + 2] = -2;
          pixels[currPosInPxsArr + 3] = -2;
          currPosInPxsArr = newCurrPosInPxsArr;
        }
        //Đánh dấu điểm hiện tại đã đi qua
        pixels[currPosInPxsArr] = -2;
        pixels[currPosInPxsArr + 1] = -2;
        pixels[currPosInPxsArr + 2] = -2;
        pixels[currPosInPxsArr + 3] = -2;
        count = 0;
        //các hướng có thể đi (gía trị true)
        if(res.w >= areaTest || (res.w >= areaTest / 2 && currDir == 'w')){dir.w.state = true; count++};
        if(res.s >= areaTest || (res.s >= areaTest / 2 && currDir == 's')){dir.s.state = true; count++};
        if(res.e >= areaTest || (res.e >= areaTest / 2 && currDir == 'e')){dir.e.state = true; count++};
        if(res.n >= areaTest || (res.n >= areaTest / 2 && currDir == 'n')){dir.n.state = true; count++};
        if(res.en >= areaTest || (res.en >= areaTest / 2 && (currDir == 'en' || currDir == 'e' || currDir == 'n'))){subDir.en.state = true; subCount++;};
        if(res.es >= areaTest || (res.es >= areaTest / 2 && (currDir == 'es' || currDir == 'e' || currDir == 's'))){subDir.es.state = true; subCount++;};
        if(res.ws >= areaTest || (res.ws >= areaTest / 2 && (currDir == 'ws' || currDir == 'w' || currDir == 's'))){subDir.ws.state = true; subCount++;};
        if(res.wn >= areaTest || (res.wn >= areaTest / 2 && (currDir == 'wn' || currDir == 'w' || currDir == 'n'))){subDir.wn.state = true; subCount++;};
        let d = Math.floor((currPosInPxsArr / 4) / width);  //row
        let c = Math.floor((currPosInPxsArr / 4) % width);  //col
      
        //Nếu type of path thay đổi (chỉ tính trường hợp từ đường thẳng sang khúc quẹo, 3, 4),
        //thì thêm những hướng có thể đi vào queue(đông, tây, nam, bắc)
        if(JSON.stringify(prevDir) !== JSON.stringify(dir) && !backTrack){
          let isAdded = false;
          let truthyTJunction = true;
          let prevCount = 0;
          let differ;
          if(prevDir.e && dir[currDir]){
            //Nếu count == 3
            //Và trước đó đang bằng 2
            for(let i in prevDir){
              if(prevDir[i].state)prevCount++;
              if(prevDir[i].state != dir[i].state)differ = i;
            }
            if(count == 3 && prevCount == 2 && differ == dir[currDir].opp){
              truthyTJunction = false;
            }
          }

          //Cập nhật prevDir
          for(let i in dir)
            prevDir[i] = {...dir[i]}

          //Nếu vào ngã, 3, 4 hoặc TH: subDir -> dir; hoặc trước  count == 1 giờ count == 2 và differ khác hướng ngược của hướng hiện tại
          if(count >= 3 && truthyTJunction || (count <= 2 && subDir[currDir]) || !currDir || (count == 2 && prevCount == 1 && differ != dir[currDir].opp)){ //TH: thực sự vào khúc quẹo, 3, 4 thì mới thêm vào queue
              //Nhảy bước vào giữa khúc quẹo, 3, 4 (Kiểm tra trùng luôn)
              if(currDir && dir[currDir] && count >= 3){
                let isTrung = false;
                isCrossed = true;
                for(let i = 0 ; i < res[currDir] / 2; i++){
                    let t = ((d + dir[currDir]['d'] * jump * i) * width + (c + dir[currDir]['c'] * jump * i)) * 4;
                    if(!marked[t]){
                      t = tobeMiddle(res, width, t, areaTest, currDir, subDir);
                      pixels[t] = -2;
                      pixels[t + 1] = -2;
                      pixels[t + 2] = -2;
                      pixels[t + 3] = -2;
                      marked[currPosInPxsArr] = t;
                      currPosInPxsArr = t;
                    }
                    //Trùng
                    else{
                      console.log('trung');
                      isTrung = true;
                      break;
                    }
                }
                //Xét lại dir, prevDir, d, c, count
                res = radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count);
                isCrossed = false;
                if(!res || isTrung){
                    //backtrack về hướng mới
                    let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
                    currPosInPxsArr, currDir, queuePosition, width, jump, start);
                    if(!result){
                      console.log("end");
                      return;
                    }
                    backTrack = result.backTrack;
                    currPosInPxsArr = result.currPosInPxsArr;
                    dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
                    currDir = result.currDir;
                    queuePosition = result.queuePosition;
                    pixels.set(result.pixels);
                    marked = {...result.marked};
                    res = radar(pixels, width, height, currPosInPxsArr, areaTest, data, currDir, dataTrackFullSetup, addedDestinations, isCrossed, count);
                }
                //các hướng có thể đi (gía trị true)
                count = 0;
                dir.w.state = dir.s.state = dir.n.state = dir.e.state = false;
                if(res.w >= areaTest){dir.w.state = true; count++};
                if(res.s >= areaTest){dir.s.state = true; count++};
                if(res.e >= areaTest){dir.e.state = true; count++};
                if(res.n >= areaTest){dir.n.state = true; count++};
                //Cập nhật prevDir
                for(let i in dir)
                    prevDir[i] = {...dir[i]}
                //cập nhật d, c
                d = Math.floor((currPosInPxsArr / 4) / width);  //row
                c = Math.floor((currPosInPxsArr / 4) % width);              //col
              }

              if(!backTrack){
                //Nếu có thể đi hướng tây
                //Thêm hướng tây vào queue
                if(dir.w.state && currDir != 'e' && currDir != 'es' && currDir != 'en'){
                    queue[++queuePosition] = currPosInPxsArr;
                    queueDir[queuePosition] = 'w';
                    isAdded = true;
                }
                //Nếu có thể đi hướng bắc
                //Thêm hướng bắc vào queue
                if(dir.n.state && currDir != 's' && currDir != 'es' && currDir != 'ws'){
                    queue[++queuePosition] = currPosInPxsArr;
                    queueDir[queuePosition] = 'n';
                    isAdded = true;
                }
                //Nếu có thể đi hướng đông
                //Thêm hướng đông vào queue
                if(dir.e.state && currDir != 'w' && currDir != 'ws' && currDir != 'wn'){
                    queue[++queuePosition] = currPosInPxsArr;
                    queueDir[queuePosition] = 'e';
                    isAdded = true;
                }
                //Nếu có thể đi hướng nam
                //Thêm hướng nam vào queue
                if(dir.s.state && currDir != 'n' && currDir != 'wn' && currDir != 'en'){
                    queue[++queuePosition] = currPosInPxsArr;
                    queueDir[queuePosition] = 's';
                    isAdded = true;
                }
              }
              //Đổi hướng
              //update current pos
              //update marked
              if(isAdded){
                let d = Math.floor((queue[queuePosition] / 4) / width);  //row
                let c =  Math.floor((queue[queuePosition] / 4) % width);              //col
                dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
                currDir = queueDir[queuePosition--];
                let t =  ((d + dir[currDir]['d'] * jump) * width + (c + dir[currDir]['c'] * jump)) * 4;
                marked[currPosInPxsArr] = t;
                currPosInPxsArr = t;
                //reset prevsubdir
                prevSubDir = {};
              }
          }
         
          //Nếu không có chuyển thêm hướng chính nào và một trong những hướng chính đi được là hướng đang đi thì
          //Đi tiếp tục và không chuyển hướng
          if(!isAdded && !backTrack && count >= 1 && dir[currDir] && dir[currDir].state){ 
              //Đi bình thường
              let t = ((d + dir[currDir]['d'] * jump) * width + (c + dir[currDir]['c'] * jump)) * 4;
              marked[currPosInPxsArr] = t;
              //reverseMarked[t] = currPosInPxsArr;
              currPosInPxsArr = t;
          }
          //Trường hợp còn lại vào đường cong xấu hoặc đường cụt
          else if(!isAdded && !backTrack && count <= 2 && (!dir[currDir] || !dir[currDir].state)){
              //Đường cong xấu
            if(JSON.stringify(prevSubDir) !== JSON.stringify(subDir)){
              //Cập nhật subprevDir
              for(let i in subDir)
                prevSubDir[i] = {...subDir[i]}
              //Nếu đang đi hướng tây
              //Và WS hoặc WN đi được
              //Thêm những hướng này vào queue
              if(currDir == 'w' || (prevCurrDir == "w" && subDir[currDir])){
                  if(subDir.ws.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'ws';
                  isAdded = true;
                  }
                  if(subDir.wn.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'wn';
                  isAdded = true;
                  }
              }
              //Nếu đang đi hướng đông
              //Và ES hoặc EN đi được
              //Thêm những hướng này vào queue
              else if(currDir == 'e' || (prevCurrDir == "e" && subDir[currDir])){
                  if(subDir.es.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'es';
                  isAdded = true;
                  }
                  if(subDir.en.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'en';
                  isAdded = true;
                  }
              }
              //Nếu đang đi hướng nam
              //Và WS hoặc ES đi được
              //Thêm những hướng này vào queue
              else if(currDir == 's' || (prevCurrDir == "s" && subDir[currDir])){
                  if(subDir.ws.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'ws';
                  isAdded = true;
                  }
                  if(subDir.es.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'es';
                  isAdded = true;
                  }
              }
              //Nếu đang đi hướng bắc
              //Và WN hoặc EN đi được
              //Thêm những hướng này vào queue
              else if(currDir == 'n' || (prevCurrDir == "n" && subDir[currDir])){
                  if(subDir.wn.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'wn';
                  isAdded = true;
                  }
                  if(subDir.en.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'en';
                  isAdded = true;
                  }
              }
              //Nếu là điểm đặt đầu
              else if(!currDir){
                if(subDir.wn.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'wn';
                  isAdded = true;
                  }
                if(subDir.en.state){
                queue[++queuePosition] = currPosInPxsArr;
                queueDir[queuePosition] = 'en';
                isAdded = true;
                }
                if(subDir.ws.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'ws';
                  isAdded = true;
                  }
                if(subDir.es.state){
                  queue[++queuePosition] = currPosInPxsArr;
                  queueDir[queuePosition] = 'es';
                  isAdded = true;
                  }
              }
              if(isAdded){
                let d = Math.floor((queue[queuePosition] / 4) / width);  //row
                let c =  Math.floor((queue[queuePosition] / 4) % width);              //col
                subDir[currDir] ? prevSubCurrDir = currDir : prevCurrDir = currDir;
                currDir = queueDir[queuePosition--];
                for(let i = 1 ; i < 2; i++){
                let t = ((d + subDir[currDir]['d'] * jump * i) * width + (c + subDir[currDir]['c'] * jump * i)) * 4;
                pixels[t] = -2;
                pixels[t + 1] = -2;
                pixels[t + 2] = -2;
                pixels[t + 3] = -2;
                marked[currPosInPxsArr] = t;
                currPosInPxsArr = t;
                }
              }
              else{
                //Nếu vào đường cụt
                //backtrack về hướng mới
                let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
                  currPosInPxsArr, currDir, queuePosition, width, jump, start);
                if(!result){
                  console.log("end");
                  return;
                }
                backTrack = result.backTrack;
                currPosInPxsArr = result.currPosInPxsArr;
                dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
                currDir = result.currDir;
                queuePosition = result.queuePosition;
                pixels.set(result.pixels);
                marked = {...result.marked};
              }
            }
            //Đi tiếp tục hướng phụ
            else{
              for(let i = 1 ; i < 2; i++){
                let t = subDir[currDir] ? ((d + subDir[currDir]['d'] * jump * i) * width + (c + subDir[currDir]['c'] * jump * i)) * 4
                                        : ((d + dir[currDir]['d'] * jump * i) * width + (c + dir[currDir]['c'] * jump * i)) * 4;
                pixels[t] = -2;
                pixels[t + 1] = -2;
                pixels[t + 2] = -2;
                pixels[t + 3] = -2;
                marked[currPosInPxsArr] = t;
                currPosInPxsArr = t;
                }
            }
          }
        }
        //TH: Đang đi hướng sub thì prevSubDir khác subDir
        else if(JSON.stringify(prevSubDir) !== JSON.stringify(subDir) && subDir[currDir] && !backTrack){
          let isAdded = false;
            //Cập nhật subprevDir
            for(let i in subDir)
              prevSubDir[i] = {...subDir[i]}

            for(let i in subDir){
              if(subDir[i].state && i != subDir[currDir].opp){
                queue[++queuePosition] = currPosInPxsArr;
                queueDir[queuePosition] = i;
                isAdded = true;
              } 
            }
            
            if(isAdded){
              let d = Math.floor((queue[queuePosition] / 4) / width);  //row
              let c = Math.floor((queue[queuePosition] / 4) % width);              //col
              prevSubCurrDir = currDir;
              currDir = queueDir[queuePosition--];
              for(let i = 1 ; i < 2; i++){
                let t = ((d + subDir[currDir]['d'] * jump * i) * width + (c + subDir[currDir]['c'] * jump * i)) * 4;
                pixels[t] = -2;
                pixels[t + 1] = -2;
                pixels[t + 2] = -2;
                pixels[t + 3] = -2;
                marked[currPosInPxsArr] = t;
                currPosInPxsArr = t;
              }
            }
            else{
              //Nếu vào đường cụt
              //backtrack về hướng mới
              let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir , dir, 
                currPosInPxsArr, currDir, queuePosition, width, jump, start);
              if(!result){
                console.log("end");
                return;
              }
              backTrack = result.backTrack;
              currPosInPxsArr = result.currPosInPxsArr;
              dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
              currDir = result.currDir;
              queuePosition = result.queuePosition;
              pixels.set(result.pixels);
              marked = {...result.marked};
            }
        }
        else{
        //Cập nhật prevDir
        for(let i in dir)
            prevDir[i] = {...dir[i]}
        //Cập nhật prevSubDir
        if(subDir[currDir] || backTrack)
          for(let i in subDir)
            prevSubDir[i] = {...subDir[i]}

        //Đặt lại backtrack
        backTrack = false;
        //xử lý TH bình thường (tiếp tục hướng đi)
        if(count >= 1 && dir[currDir]){
            let t = ((d + dir[currDir]['d'] * jump) * width + (c + dir[currDir]['c'] * jump)) * 4;
            marked[currPosInPxsArr] = t;
            currPosInPxsArr = t;
        }
        else if(subDir[currDir] && subDir[currDir].state){
            for(let i = 1 ; i < 2; i++){
            let t = ((d + subDir[currDir]['d'] * jump * i) * width + (c + subDir[currDir]['c'] * jump * i)) * 4;
            pixels[t] = -2;
            pixels[t + 1] = -2;
            pixels[t + 2] = -2;
            pixels[t + 3] = -2;
            marked[currPosInPxsArr] = t;
            currPosInPxsArr = t;
            }
        }
        else{
            //Nếu vào đường cụt
            //backtrack về hướng mới
            let result = backTracking(originalPixels, pixels, queue, queueDir, marked, subDir, dir, 
            currPosInPxsArr, currDir, queuePosition, width, jump, start);
            if(!result){
              console.log("end");
              return;
            }
            backTrack = result.backTrack;
            currPosInPxsArr = result.currPosInPxsArr;
            dir[currDir] ? prevCurrDir = currDir : prevSubCurrDir = currDir;
            currDir = result.currDir;
            queuePosition = result.queuePosition;
            pixels.set(result.pixels);
            marked = {...result.marked};
        }
        }
      }
  }
}