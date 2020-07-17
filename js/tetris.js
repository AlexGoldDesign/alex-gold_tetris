var points = 0;
var color = "blue";
var spacesTaken = [];
var rowTally = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
var points = 0;

var currentTetObject;
var tetShape;
var tetRotations;
var rotationNumber = 0;
var currentTet;
var tetStepperSlow;
var tetStepperFast;
var stopbuttonbugfix = true;


///////////////////////////////////////////tetrimino constructor

function TetrisObject() {
  this.shape = [  [2301, 2401, 2501, 2601, 2400, 2401, 2402, 2403, 2301, 2401, 2501, 2601, 2400, 2401, 2402, 2403],
                  [2300, 2301, 2401, 2501, 2500, 2400, 2401, 2402, 2502, 2501, 2401, 2301, 2402, 2502, 2501, 2500],
                  [2600, 2601, 2501, 2401, 2602, 2502, 2501, 2500, 2401, 2400, 2500, 2600, 2400, 2500, 2501, 2502],
                  [2400, 2500, 2401, 2501, 2400, 2500, 2401, 2501, 2400, 2500, 2401, 2501, 2400, 2500, 2401, 2501],
                  [2600, 2500, 2501, 2401, 2602, 2601, 2501, 2500, 2600, 2500, 2501, 2401, 2602, 2601, 2501, 2500],
                  [2500, 2601, 2501, 2401, 2601, 2502, 2501, 2500, 2502, 2401, 2501, 2601, 2401, 2500, 2501, 2502],
                  [2400, 2500, 2501, 2601, 2500, 2501, 2401, 2402, 2400, 2500, 2501, 2601, 2500, 2501, 2401, 2402]  ]
                };


///////////////////////////////////////////tetrimino object

var tetrimino = {
  tetrisGenerator: function(){
    currentTetObject = new TetrisObject();
    var tetGen = Math.floor(Math.random() * 7);
    tetShape = currentTetObject.shape[tetGen];
    // tetShape = currentTetObject.shape[0];

    tetrimino.colorPusher();
    tetStepperSlow = setInterval(tetrimino.tetStepper, 500);
  },

  colorPusher: function(){
    tetRotations = [  [tetShape[0], tetShape[1], tetShape[2], tetShape[3]],
                      [tetShape[4], tetShape[5], tetShape[6], tetShape[7]],
                      [tetShape[8], tetShape[9], tetShape[10], tetShape[11]],
                      [tetShape[12], tetShape[13], tetShape[14], tetShape[15]]  ]
    currentTet = tetRotations[rotationNumber];
    for(var i = 0; i < currentTet.length; i++){
      var pushColor = document.getElementById(currentTet[i]);
      pushColor.setAttribute("class", color);
    }
  },

  colorDeleter: function(){
    for(var i = 0; i < currentTet.length; i++){
      var deleteColor = document.getElementById(currentTet[i]);
      deleteColor.classList.remove(color);
      deleteColor.setAttribute("class", "grid-item");
    }
  },

  tetStepper: function(){
    if (bottomCollision()){
      return false;
    }
    if (tetCollision()){
      return false;
    }
    for(var i = 0; i < tetShape.length; i++){
      tetrimino.colorDeleter();
      tetShape[i] += 1;
      tetrimino.colorPusher();
    }

  },

  tetPush: function(){
    for(var i = 0; i < currentTet.length; i++){
    spacesTaken.push(currentTet[i]);
  }
},

  stopCurrentTet: function(){
    clearInterval(tetStepperSlow);
    clearInterval(tetStepperFast);
    tetrimino.tetPush();
    rowTallyFunction();
    counterAndInitiator()
    delete currentTetObject;
    tetrimino.tetrisGenerator();
    stopbuttonbugfix = true;
}

}


///////////////////////////////////////////controller object

var controller = {
  controllerRotate: function(){
    if(!rotationCollisionTester()){
      tetrimino.colorDeleter();
      rotationNumber += 1;
      currentTet = tetRotations[rotationNumber];
      if(rotationNumber === 4){
        rotationNumber = 0;
      }
      tetrimino.colorPusher();
    }
    },

    controllerLeft: function(){
      if(leftCollision(currentTet, 2100) || tetCollision() || tetCollisionLeft()){
        return false;
      } else {
      for(var i = 0; i < tetShape.length; i++){
        tetrimino.colorDeleter();
        tetShape[i] = tetShape[i] - 100;
        tetrimino.colorPusher();
      }
    }
    },

    controllerRight: function(){
      if(rightCollision(currentTet, 2900) || tetCollision() || tetCollisionRight()){
        return false;
      } else {
      for(var i = 0; i < tetShape.length; i++){
        tetrimino.colorDeleter();
        tetShape[i] = tetShape[i] + 100;
        tetrimino.colorPusher();
      }
    }
  },

    controllerDown: function(){
      if(stopbuttonbugfix){
        clearInterval(tetStepperSlow);
        tetStepperFast = setInterval(tetrimino.tetStepper, 50);
        stopbuttonbugfix = false;
      }
    }
    // ,

    // controllerStop: function(){
    //   clearInterval(tetStepperSlow);
    //   clearInterval(tetStepperFast);
    //   console.log(spacesTaken);
    //   console.log(rowTally);
    // }

}


///////////////////////////////////////////collision detectors & stop tet

function leftCollision(tetTest, cellID){
  for(var i = 0; i < tetTest.length; i++){
    if(tetTest[i] < cellID){
      return true;
    }
  } return false;
}

function rightCollision(tetTest, cellID){
  for(var i = 0; i < tetTest.length; i++){
    if(tetTest[i] > cellID){
      return true;
    }
  } return false;
}

function rotationCollisionTester(){
  var rotationNumberTester = rotationNumber;
  rotationNumberTester += 1;
  if(rotationNumberTester === 4){
    rotationNumberTester = 0;
  }
  var currentTetRotationTester = tetRotations[rotationNumberTester];
  if(leftCollision(currentTetRotationTester, 2000) || rightCollision(currentTetRotationTester, 3000)){
    return true;
} return false;
}

function bottomCollision(){
  for(var i = 0; i < currentTet.length; i++){
    var stringedCurrentTetNumber = currentTet[i].toString();
    var row = stringedCurrentTetNumber.substring(2);
    if(row == 19){
      tetrimino.stopCurrentTet();
      return true;
    }
  } return false;
}

function tetCollision(){
  for(var i = 0; i < currentTet.length; i++){
    var stringedCurrentTetNumber = currentTet[i];
    stringedCurrentTetNumber += 1;
    if(spacesTaken.indexOf(stringedCurrentTetNumber) >= 0){
      tetrimino.stopCurrentTet();
      return true;
    }
  } return false;
}

function tetCollisionRight(){
  for(var i = 0; i < currentTet.length; i++){
    var stringedCurrentTetNumber = currentTet[i];
    stringedCurrentTetNumber += 100;
    if(spacesTaken.indexOf(stringedCurrentTetNumber) >= 0){
      return true;
    }
  } return false;
}

function tetCollisionLeft(){
  for(var i = 0; i < currentTet.length; i++){
    var stringedCurrentTetNumber = currentTet[i];
    stringedCurrentTetNumber -= 100;
    if(spacesTaken.indexOf(stringedCurrentTetNumber) >= 0){
      return true;
    }
  } return false;
}


///////////////////////////////////////////row tally & row deletions


function rowTallyFunction(){
  //iterates through currentTet and gets last two digits and passes +1 to rowTally.
  for(var i = rowTally.length - 1; i >= 0; i--){
    rowTally[i] = 0;
  }
  for(var i = spacesTaken.length - 1; i >= 0; i--){
    var stringedCurrentTetNumber = spacesTaken[i].toString();
    var row = stringedCurrentTetNumber.substring(2);
    rowTally[row] += 1;
  }
}

function counterAndInitiator(){
  var rowCounter = 0;
  var rowStart;

  for(var i = rowTally.length - 1; i >= 0; i--){
    if(rowTally[i] == 10){
      rowCounter += 1;
    }
  }

  rowStart = rowTally.findIndex(index => index === 10);

  if (rowCounter > 0){
    deleteRow(rowCounter, rowStart);
    dropRemaining(rowCounter, rowStart);

    var pointsMath = rowCounter * 1000;
    var points2 = pointsMath + (pointsMath / 2)
    points += points2;

  var pointsHTML = document.getElementById("points");
  pointsHTML.innerHTML = points;

  for(var i = rowTally.length; i >= 0; i--){
    if(rowTally[i] == 10){
      rowTally.splice(i, 1);
      rowTally.push(0);
    }
  }

  rowCounter = 0;
  rowStart = undefined;
  }
}

function deleteRow(rowCounter, rowStart){
  var array = [];
  spacesTaken.sort();

  for(var i = 0; i < rowCounter; i++){
    for(var j = 0; j < spacesTaken.length; j++){
      var spaceToDelete = spacesTaken[j].toString();
      var spacesTakenSub = spaceToDelete.substring(2)
      if(spacesTakenSub == rowStart){
        array.push(spacesTaken[j]);
        spacesTaken.splice(j, 1);
        j--;
      }
    }
    rowStart += 1;
  }
  for(var i = array.length - 1; i >= 0; i--){
    var deleteColor = document.getElementById(array[i]);
    deleteColor.classList.remove(color);
    deleteColor.setAttribute("class", "grid-item");
    array.splice(i, 1);
  }
  rowTallyFunction();
}

function dropRemaining(rowCounter, rowStart){
  for(var i = spacesTaken.length - 1; i >= 0; i--){
    var spaceToDelete = spacesTaken[i].toString();
    var spacesTakenDrop = spaceToDelete.substring(2)
    if(spacesTakenDrop < rowStart){
      var deleteColor = document.getElementById(spacesTaken[i]);
      deleteColor.classList.remove(color);
      deleteColor.setAttribute("class", "grid-item");
            spacesTaken[i] += rowCounter;
            var pushColor = document.getElementById(spacesTaken[i]);
            pushColor.setAttribute("class", color);
    }
  }
}




///////////////////////////////////////////initiallisation and event handlers

window.onload = function(){
  var startButton = document.getElementById("startButton");
  startButton.onclick = tetrimino.tetrisGenerator;

  var rotateKeyPress = document.getElementById("rotateButton");
  rotateKeyPress.onclick = controller.controllerRotate;

  var leftKeyPress = document.getElementById("leftButton");
  leftKeyPress.onclick = controller.controllerLeft;

  var rightKeyPress = document.getElementById("rightButton");
  rightKeyPress.onclick = controller.controllerRight;

  var downKeyPress = document.getElementById("downButton");
  downKeyPress.onclick = controller.controllerDown;

  // var stopKeyPress = document.getElementById("stopButton");
  // stopKeyPress.onclick = controller.controllerStop;
}







//////////test code
  // console.log(spacesTaken)
  //
  // var shapez = [2301, 2401, 2501, 2601, 2400, 2401, 2402, 2403, 2301, 2401, 2501, 2601, 2400, 2401, 2402, 2403];

  // spacesTaken.push(shapez[2]);
  // console.log(spacesTaken);
  // var currentTetCollisionTest = shapez[2]
  // if(spacesTaken.indexOf(currentTetCollisionTest)){
  //     console.log("yes");
  // } else {
  //     console.log("no");
  // }

  // var output = shapez.findIndex(shape => shape === 2501);
  // console.log(output)






// for(var i = 0; i <= 100; i++){
//   var output = "";
//
//   if(i % 3 == 0){output = "fizz"}
//   if(i % 5 == 0){output = "buzz"}
//   if((i % 3 == 0) && (i % 5 == 0)){output = "fizzbuzz"}
//   if(output == ""){output = i}
//
//   console.log(output)
// }
