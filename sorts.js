var resizeCol;

var VAL_MAIN;
const borderColor = '#DDD'; // I would use 'const', not 'const', but it breaks in IE
const barColor = '#000';
const finishedBarColor = '#000';
const movingBarColor = '#DDD';
const movingBarOutlineColor = '#888';
const boxColor = '#D0D';
const multiBoxColor = '#0B0';
const maxColor = '#F00';

var barGap = 2;

var IDLE = 0;
var STARTING = 1;
var RUN = 2;
var STEPPING = 3;
var PAUSED = 4;

var tempSort = '0';
var state = IDLE;

var g; // graphic context for drawing on the canvas.
var width, height; // width and height of the canvas.

var barWidth, barHeight, minBarHeight, barIncrement; // measurements used for drawinbubble.
var leftOffset, firstRow_y, secondRow_y, textAscent;

var method; // The sorting method that is being used, coded as 1,2,3,4,5; controlled by a select element.

var fast = false; // Things move faster when this is true;  the value is controlled by a checkbox.

var item = new Array(); // a 33-element array containing the numbers to be sorted in positions 1 to 26.
// item[0] holds the value of temp.  positions 27 - 33 are used in MergeSort.
// a value of -1 in this array means that no item is present.  When an item
// is in its final position, 100 is added to the value as a signal that the
// item should be drawn in black.

var tempOn = false; // Variables that control the extra stuff that is sometimes drawn, in addition to items.
var mergeBox = [-1, -1, -1];
var multiBoxLoc = {
  x: -1,
  y: -1,
};
var movingItemLoc = {
  x: -1,
  y: -1,
};
var maxLoc, hiLoc, loLoc, box1Loc, box2Loc, movingItem;

var moveCt; // Number of copies done so far in the current sort.
var compCt; // Number of comparisons done so far in the current sort.

var timeout = null; // When non-null, indicates a pending timeout (so it can be cleared to stop the animation).

function stopRunning() {
  // does any pending actions in the action queue (with no delay) and cancels any timeout.
  while (actionQueue.length > 0) {
    doAction(actionQueue.shift());
  }
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
}

function setState(newState) {
  state = newState;
  $('#runBtn1').attr(
    'disabled',
    state == RUN || state == IDLE || state == STEPPING
  );
  $('#pauseBtn').attr('disabled', state != RUN);
  $('#stepBtn').attr(
    'disabled',
    state == RUN || state == IDLE || state == STEPPING
  );
  $('#sortSelect').attr(
    'disabled',
    state == RUN || state == PAUSED || state == STEPPING
  );
}

function newSort() {
  stopRunning();
  setState(STARTING);
  /**
   * resizeCol: Variável que redimensiona as colunas, fixa o bug onde ficavam
   * colunas muito grande no início
   */
  resizeCol = (100 * VAL_MAIN) / 16;
  tempSort = '0';
  valid = false;
  maxLoc = -1;
  hiLoc = -1;
  loLoc = -1;
  box1Loc = -1;
  box2Loc = -1;
  multiBoxLoc.x = -1;
  mergeBox[0] = [-1, -1, -1];
  movingItem = -1;
  // tempOn = false;
  for (var i = 1; i <= VAL_MAIN; i++) item[i] = i;
  for (var i = VAL_MAIN; i >= 2; i--) {
    var j = 1 + Math.floor(Math.random() * i);
    var temp = item[i];
    item[i] = item[j];
    item[j] = temp;
  }
  item[0] = -1;
  for (var i = VAL_MAIN + 1; i < VAL_MAIN * 2 + 1; i++) item[i] = -1;
  $('#bubbleCompCt').html('0');
  $('#bubbleMoveCt').html('0');
  $('#selectionCompCt').html('0');
  $('#selectionMoveCt').html('0');
  $('#quickCompCt').html('0');
  $('#quickMoveCt').html('0');
  compCt = 0;
  moveCt = 0;
  valid = false;
  bubbleDraw();
  selectionDraw();
  quickDraw();
}

//-------------------------------- Drawing ------------------------------------------

// Template
function putItem(i) {
  // draws item i from the array item[]; if item[i] is -1, nothing is drawn.
  var h = item[i];
  if (h == -1) return;
  var x, y, ht;
  if (h > VAL_MAIN) {
    ht = (h - resizeCol) * barIncrement + minBarHeight;
    bubble.fillStyle = '#F00';
  } else {
    ht = h * barIncrement + minBarHeight;
    bubble.fillStyle = barColor;
  }
  if (i == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y - ht;
  } else if (i < VAL_MAIN + 1) {
    x = leftOffset + (i - 1) * (barWidth + barGap);
    y = firstRow_y - ht;
  } else {
    x = leftOffset + (i - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y - ht;
  }
  try {
    bubble.fillRect(x, y, barWidth + 2.5, ht); // Desenha a coluna
    bubble.strokeStyle = finishedBarColor;
  } catch (e) {
    if (timeout != null) timeout.cancel();
    setState(IDLE);
    alert('Internal error while drawing!!??');
  }
}
function bubblePutItem(i) {
  var h = item[i];
  var x, y, ht;
  if (h > VAL_MAIN) {
    ht = (h - resizeCol) * barIncrement + minBarHeight;
    bubble.fillStyle = '#F00';
  } else {
    ht = h * barIncrement + minBarHeight;
    bubble.fillStyle = barColor;
  }
  if (i == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y - ht;
  } else if (i < VAL_MAIN + 1) {
    x = leftOffset + (i - 1) * (barWidth + barGap);
    y = firstRow_y - ht;
  } else {
    x = leftOffset + (i - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y - ht;
  }
  try {
    bubble.fillRect(x, y, barWidth + 2.5, ht); // Desenha a coluna
    bubble.strokeStyle = finishedBarColor;
  } catch (e) {
    if (timeout != null) timeout.cancel();
    setState(IDLE);
    alert('Internal error while drawing!!??');
  }
}
function selectionPutItem(i) {
  var h = item[i];
  if (h == -1) return;
  var x, y, ht;
  if (h > VAL_MAIN) {
    ht = (h - resizeCol) * barIncrement + minBarHeight;
    selection.fillStyle = '#F00';
  } else {
    ht = h * barIncrement + minBarHeight;
    selection.fillStyle = barColor;
  }
  if (i == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y - ht;
  } else if (i < VAL_MAIN + 1) {
    x = leftOffset + (i - 1) * (barWidth + barGap);
    y = firstRow_y - ht;
  } else {
    x = leftOffset + (i - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y - ht;
  }
  try {
    selection.fillRect(x, y, barWidth + 2.5, ht); // Desenha a coluna
    selection.strokeStyle = finishedBarColor;
  } catch (e) {
    if (timeout != null) timeout.cancel();
    setState(IDLE);
    alert('Internal error while drawing!!??');
  }
}
function quickPutItem(i) {
  var h = item[i];
  if (h == -1) return;
  var x, y, ht;
  if (h > VAL_MAIN) {
    ht = (h - resizeCol) * barIncrement + minBarHeight;
    quick.fillStyle = '#F00';
  } else {
    ht = h * barIncrement + minBarHeight;
    quick.fillStyle = barColor;
  }
  if (i == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y - ht;
  } else if (i < VAL_MAIN + 1) {
    x = leftOffset + (i - 1) * (barWidth + barGap);
    y = firstRow_y - ht;
  } else {
    x = leftOffset + (i - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y - ht;
  }
  try {
    quick.fillRect(x, y, barWidth + 2.5, ht); // Desenha a coluna
    quick.strokeStyle = finishedBarColor;
  } catch (e) {
    if (timeout != null) timeout.cancel();
    setState(IDLE);
    alert('Internal error while drawing!!??');
  }
}

// Template
function drawMovingItem() {
  // Draws an item that is being moved to animate the copying of an item from one place to another.
  var ht = movingItem * barIncrement + minBarHeight;
  bubble.fillStyle = movingBarColor;
  bubble.fillRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);
  bubble.strokeColor = movingBarOutlineColor;
  bubble.strokeRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);
}
// function bubbleDrawMovingItem() {
//   // Draws an item that is being moved to animate the copying of an item from one place to another.
//   var ht = movingItem * barIncrement + minBarHeight;
//   bubble.fillStyle = movingBarColor;
//   bubble.fillRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);
//   bubble.strokeColor = movingBarOutlineColor;
//   bubble.strokeRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);
// }

// Template
function drawMax() {
  // Writes "Max" under one of the items, with an arrow pointing to the item.
  var sw = 30; // (guess at string width)
  var x = leftOffset + (maxLoc - 1) * (barWidth + barGap) + barWidth / 2;
  var y = firstRow_y + 38 + textAscent;
  bubble.fillStyle = maxColor;
  bubble.fillText('Maior', x - sw / 2, y + textAscent);
  bubble.strokeStyle = maxColor;
  bubble.beginPath();
  bubble.moveTo(x, y);
  bubble.lineTo(x, y - 29);
  bubble.moveTo(x, y - 29);
  bubble.lineTo(x + 6, y - 24);
  bubble.moveTo(x, y - 29);
  bubble.lineTo(x - 6, y - 24);
  bubble.stroke();
}

// Template
function drawBox(boxLoc) {
  // draws a box aroud one of the items (indicated by boxLoc)
  var x, y;
  if (boxLoc == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y;
  } else if (boxLoc < VAL_MAIN + 1) {
    x = leftOffset + (boxLoc - 1) * (barWidth + barGap);
    y = firstRow_y;
  } else {
    x = leftOffset + (boxLoc - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y;
  }
  bubble.strokeStyle = boxColor;
  bubble.strokeRect(x - 2, y - barHeight - 2, barWidth + 4, barHeight + 4);
}
function bubbleDrawBox(boxLoc) {
  // draws a box aroud one of the items (indicated by boxLoc)
  var x, y;
  if (boxLoc == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y;
  } else if (boxLoc < VAL_MAIN + 1) {
    x = leftOffset + (boxLoc - 1) * (barWidth + barGap);
    y = firstRow_y;
  } else {
    x = leftOffset + (boxLoc - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y;
  }
  bubble.strokeStyle = boxColor;
  bubble.strokeRect(x - 2, y - barHeight - 2, barWidth + 4, barHeight + 4);
}
function selectionDrawBox(boxLoc) {
  // draws a box aroud one of the items (indicated by boxLoc)
  var x, y;
  if (boxLoc == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y;
  } else if (boxLoc < VAL_MAIN + 1) {
    x = leftOffset + (boxLoc - 1) * (barWidth + barGap);
    y = firstRow_y;
  } else {
    x = leftOffset + (boxLoc - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y;
  }
  selection.strokeStyle = boxColor;
  selection.strokeRect(x - 2, y - barHeight - 2, barWidth + 4, barHeight + 4);
}
function quickDrawBox(boxLoc) {
  // draws a box aroud one of the items (indicated by boxLoc)
  var x, y;
  if (boxLoc == 0) {
    x = leftOffset + ((barWidth + barGap) * 25) / 2;
    y = secondRow_y;
  } else if (boxLoc < VAL_MAIN + 1) {
    x = leftOffset + (boxLoc - 1) * (barWidth + barGap);
    y = firstRow_y;
  } else {
    x = leftOffset + (boxLoc - (VAL_MAIN + 1)) * (barWidth + barGap);
    y = secondRow_y;
  }
  quick.strokeStyle = boxColor;
  quick.strokeRect(x - 2, y - barHeight - 2, barWidth + 4, barHeight + 4);
}

// Template
function drawMultiBox() {
  // draws a box around items number multiBoxLoc.x through multiBoxLoc.y
  var x, y, wd;
  if (multiBoxLoc.x < VAL_MAIN + 1) {
    y = firstRow_y;
    x = leftOffset + (multiBoxLoc.x - 1) * (barWidth + barGap);
  } else {
    y = secondRow_y;
    x = leftOffset + (multiBoxLoc.x - (VAL_MAIN + 1)) * (barWidth + barGap);
  }
  wd = (multiBoxLoc.y - multiBoxLoc.x) * (barGap + barWidth) + barWidth;
  bubble.strokeStyle = multiBoxColor;
  bubble.strokeRect(x - 4, y - barHeight - 4, wd + 8, barHeight + 8);
}
function bubbleDrawMultiBox() {
  // draws a box around items number multiBoxLoc.x through multiBoxLoc.y
  var x, y, wd;
  if (multiBoxLoc.x < VAL_MAIN + 1) {
    y = firstRow_y;
    x = leftOffset + (multiBoxLoc.x - 1) * (barWidth + barGap);
  } else {
    y = secondRow_y;
    x = leftOffset + (multiBoxLoc.x - (VAL_MAIN + 1)) * (barWidth + barGap);
  }
  wd = (multiBoxLoc.y - multiBoxLoc.x) * (barGap + barWidth) + barWidth;
  bubble.strokeStyle = multiBoxColor;
  bubble.strokeRect(x - 4, y - barHeight - 4, wd + 8, barHeight + 8);
}
function quickDrawMultiBox() {
  // draws a box around items number multiBoxLoc.x through multiBoxLoc.y
  var x, y, wd;
  if (multiBoxLoc.x < VAL_MAIN + 1) {
    y = firstRow_y;
    x = leftOffset + (multiBoxLoc.x - 1) * (barWidth + barGap);
  } else {
    y = secondRow_y;
    x = leftOffset + (multiBoxLoc.x - (VAL_MAIN + 1)) * (barWidth + barGap);
  }
  wd = (multiBoxLoc.y - multiBoxLoc.x) * (barGap + barWidth) + barWidth;
  quick.strokeStyle = multiBoxColor;
  quick.strokeRect(x - 4, y - barHeight - 4, wd + 8, barHeight + 8);
}

function drawMergeListBoxes() {
  // Draws a pair of boxes around lists that are being merged in MergeSort
  var x, y, wd1, wd2;
  y = firstRow_y;
  x = leftOffset + (mergeBox[0] - 1) * (barWidth + barGap);
  wd1 = (mergeBox[1] - mergeBox[0]) * (barGap + barWidth) + barWidth;
  wd2 = (mergeBox[2] - mergeBox[0]) * (barGap + barWidth) + barWidth;
  bubble.strokeStyle = multiBoxColor;
  bubble.strokeRect(x - 4, y - barHeight - 4, wd1 + 8, barHeight + 8);
  bubble.strokeRect(x - 4, y - barHeight - 4, wd2 + 8, barHeight + 8);
}

// Template
function defaultDraw() {
  // Completely redraws the canvas to show the current state.
  bubble.clearRect(0, 0, width, height);
  bubble.strokeStyle = borderColor;
  bubble.strokeRect(0, 0, width, height);
  bubble.strokeRect(1, 1, width - 2, height - 2);

  for (var i = 1; i <= VAL_MAIN; i++) putItem(i);

  // Código que insere os números em baixo das barras

  // sort.fillStyle = borderColor;
  // for (var i = 1; i <= VAL_MAIN; i++) {
  //   var sw = i < 10 ? 6 : 12;
  //   sort.fillText(
  //     '' + i,
  //     leftOffset + (i - 1) * (barWidth + barGap) + (barWidth - sw) / 2,
  //     firstRow_y + 6 + textAscent
  //   );
  // }

  for (var i = VAL_MAIN + 1; i <= VAL_MAIN * 2; i++) putItem(i);

  // Desenha a variável temporária

  // if (tempOn) {
  //   bubble.fillStyle = borderColor;
  //   var sw = 40;
  //   bubble.fillText(
  //     'Temp',
  //     leftOffset + (VAL_MAIN * barWidth + 25 * barGap - sw) / 2,
  //     secondRow_y + 5 + textAscent
  //   );
  //   putItem(0);
  // }

  if (maxLoc >= 0) drawMax();
  if (box1Loc >= 0) drawBox(box1Loc);

  // Desenha a box rosa nas colunas da segunda linha
  // if (box2Loc >= 0) drawBox(box2Loc);

  if (multiBoxLoc.x > 0) drawMultiBox();
  if (mergeBox[0] > 0) drawMergeListBoxes();
  if (movingItem >= 0) drawMovingItem();
}
function bubbleDraw() {
  bubble.clearRect(0, 0, width, height);
  bubble.strokeStyle = borderColor;
  bubble.strokeRect(0, 0, width, height);
  bubble.strokeRect(1, 1, width - 2, height - 2);

  for (var i = 1; i <= VAL_MAIN; i++) bubblePutItem(i);
  for (var i = VAL_MAIN + 1; i <= VAL_MAIN * 2; i++) bubblePutItem(i);

  if (box1Loc >= 0) bubbleDrawBox(box1Loc);

  // Faz a animação das barras indo para segunda linhe e voltando
  // if (movingItem >= 0) bubbleDrawMovingItem();
}
function selectionDraw() {
  selection.clearRect(0, 0, width, height);
  selection.strokeStyle = borderColor;
  selection.strokeRect(0, 0, width, height);
  selection.strokeRect(1, 1, width - 2, height - 2);

  for (var i = 1; i <= VAL_MAIN; i++) selectionPutItem(i);
  for (var i = VAL_MAIN + 1; i <= VAL_MAIN * 2; i++) selectionPutItem(i);

  if (box1Loc >= 0) selectionDrawBox(box1Loc);
}
function quickDraw() {
  quick.clearRect(0, 0, width, height);
  quick.strokeStyle = borderColor;
  quick.strokeRect(0, 0, width, height);
  quick.strokeRect(1, 1, width - 2, height - 2);

  for (var i = 1; i <= VAL_MAIN; i++) quickPutItem(i);
  for (var i = VAL_MAIN + 1; i <= VAL_MAIN * 2; i++) quickPutItem(i);

  if (box1Loc >= 0) quickDrawBox(box1Loc);
  if (multiBoxLoc.x > 0) quickDrawMultiBox();
}
function insertionDraw() {}
function mergeDraw() {}

// ---------------------------- Stepping through the sorts ------------------------------

var actionQueue = new Array(); // A queue of pending actions for implmenting some aspects of the animation.

var done = false; // state variables for scripting the various sorting algorithms.
var i, j, k;
var hi, lo;
var stack = new Array();
var stackCt;
var sortLength, end_i, end_j;
var valid = false; // false when a sort is just ready to start; set to true when the first step is taken.

function copyItem(toItem, fromItem) {
  // copy an item from one place to another (actually just enqueue actions to do so)
  if (fast) {
    // enqueue a single copy action when the "fast" checkbox is seledted.
    actionQueue.push({
      action: 'copy',
      from: fromItem,
      to: toItem,
      delay: 0, // Tempo que a barra fica em TEMP - default: 200
    });
  } else {
    // enqueue a series of actions that move the item gradually from old position to new.
    var x1, y1, x2, y2;
    if (toItem == 0) {
      x2 = leftOffset + ((barWidth + barGap) * 25) / 2;
      y2 = secondRow_y;
    } else if (toItem < VAL_MAIN + 1) {
      x2 = leftOffset + (toItem - 1) * (barWidth + barGap);
      y2 = firstRow_y;
    } else {
      x2 = leftOffset + (toItem - (VAL_MAIN + 1)) * (barWidth + barGap);
      y2 = secondRow_y;
    }
    if (fromItem == 0) {
      x1 = leftOffset + ((barWidth + barGap) * (VAL_MAIN - 1)) / 2;
      y1 = secondRow_y;
    } else if (fromItem < VAL_MAIN + 1) {
      x1 = leftOffset + (fromItem - 1) * (barWidth + barGap);
      y1 = firstRow_y;
    } else {
      x1 = leftOffset + (fromItem - (VAL_MAIN + 1)) * (barWidth + barGap);
      y1 = secondRow_y;
    }
    var dist = Math.round(
      Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    );
    var ct = Math.round(dist / 3);
    if (ct > VAL_MAIN - 1) ct = VAL_MAIN - 1;
    else if (ct < 6) ct = 6;
    actionQueue.push({
      action: 'startmove',
      from: fromItem,
      x: x1,
      y: y1,
      delay: 0,
    });
    for (var i = 0; i <= ct; i++) {
      actionQueue.push({
        action: 'move',
        x: x1 + Math.round(((x2 - x1) * i) / ct),
        y: y1 + Math.round(((y2 - y1) * i) / ct),
        delay: 0 - 1,
      });
    }
    actionQueue.push({
      action: 'donemove',
      to: toItem,
      delay: 0,
    });
  }
}

function swapItems(a, b) {
  // swaps two items; actually just enqueues actions to do that
  copyItem(0, a);
  copyItem(a, b);
  copyItem(b, 0);
}

function greaterThan(itemA, itemB) {
  // test if one item is greater than another; boxes are shown around the two items.
  putBoxes(itemA, itemB);
  return item[itemA] > item[itemB];
}

function putBoxes(itemA, itemB) {
  // show boxes around two items
  box1Loc = itemA;
  box2Loc = itemB;
}

function scriptSetup() {
  // The first step in a sort
  method = tempSort;
  switch (method) {
    case '1': {
      j = VAL_MAIN;
      i = 1;
      // tempOn = true;
      break;
    }
    case '2': {
      // tempOn = true;
      j = VAL_MAIN;
      i = 2;
      maxLoc = 1;
      break;
    }
    case '3': {
      stackCt = 0;
      hi = VAL_MAIN;
      lo = 1;
      k = 0;
      i = 1; // i and j are starting valuse for lo and hi
      j = VAL_MAIN;
      multiBoxLoc.x = 1;
      multiBoxLoc.y = VAL_MAIN;
      // tempOn = true;
      break;
    }
    case '4': {
      sortLength = 1;
      i = 1;
      end_i = 1;
      j = 2;
      end_j = 2;
      k = VAL_MAIN + 1;
      lo = 0;
      hi = 1;
      multiBoxLoc.x = VAL_MAIN + 1;
      multiBoxLoc.y = VAL_MAIN + 2;
      mergeBox = [1, 1, 2];
      break;
    }
    case '5': {
      j = 0;
      multiBoxLoc.x = 1;
      multiBoxLoc.y = 1;
      break;
    }
  }
}

function scriptStep() {
  switch (method) {
    case '1': // bubble sort
      if (i == j) {
        putBoxes(-1, -1);
        if (j == 2) {
          done = true;
          // tempOn = false;
          item[1] = resizeCol + item[1];
        } else {
          j = j - 1;
          i = 1;
        }
      } else {
        if (greaterThan(i, i + 1)) {
          compCt++;
          $('#bubbleCompCt').html('' + compCt);
          swapItems(i, i + 1);
        }
        i = i + 1;
        if (i == j) {
          actionQueue.push({
            action: 'finishItem',
            itemNum: j,
            delay: 0,
          });
        }
      } // end case 1
      break;
    case '2': // selection sort
      if (j == 1) {
        done = true;
        item[1] = resizeCol + item[1];
        // tempOn = false;
      } else if (i == -1) {
        i = 2;
        maxLoc = 1;
      } else if (i > j) {
        putBoxes(-1, -1);
        k = maxLoc;
        actionQueue.push({
          action: 'maxoff',
          delay: 0,
        });
        if (k == j)
          console.log('Item ' + j + ' is already in its correct location.');
        else {
          if (j == 2) console.log('Swap item 2 with item 1');
          else
            console.log(
              'Swap item ' +
                j +
                ' with maximum among items 1 through ' +
                (j - 1)
            );
          swapItems(k, j);
        }
        actionQueue.push({
          action: 'finishItem',
          itemNum: j,
          delay: 0,
        });
        j = j - 1;
        i = -1;
      } else if (greaterThan(i, maxLoc)) {
        compCt++;
        $('#selectionCompCt').html('' + compCt);
        maxLoc = i;
        i = i + 1;
      } else {
        i = i + 1;
      } // end case 2
      break;
    case '3': // quicksort
      if (k == 0) {
        if (hi == lo) {
          item[hi] = resizeCol + item[hi]; // Alerado pois bugava as colunas
          multiBoxLoc.x = -1;
          multiBoxLoc.y = -1;
          k = 1;
        } else {
          copyItem(0, lo);
          k = -1;
        }
      } else if (k == 1) {
        if (stackCt == 0) {
          // tempOn = false;
          done = true;
        } else {
          hi = stack[stackCt];
          lo = stack[stackCt - 1];
          j = hi;
          i = lo;
          stackCt = stackCt - 2;
          multiBoxLoc.x = lo;
          multiBoxLoc.y = hi;
          k = 0;
        }
      } else if (k == 2) {
        multiBoxLoc.x = -1;
        multiBoxLoc.y = -1;
        item[hi] = resizeCol + item[hi];
        if (hi < j) {
          stack[stackCt + 1] = hi + 1;
          stack[stackCt + 2] = j;
          stackCt = stackCt + 2;
        }
        if (hi > i) {
          stack[stackCt + 1] = i;
          stack[stackCt + 2] = hi - 1;
          stackCt = stackCt + 2;
        }
        k = 1;
      } else if (hi == lo) {
        putBoxes(-1, -1);
        copyItem(hi, 0);
        k = 2;
      } else if (item[lo] == -1) {
        if (greaterThan(0, hi)) {
          compCt++;
          $('#quickCompCt').html('' + compCt);
          copyItem(lo, hi);
          lo = lo + 1;
          multiBoxLoc.x = lo;
          multiBoxLoc.y = hi;
        } else {
          hi = hi - 1;
          multiBoxLoc.x = lo;
          multiBoxLoc.y = hi;
        }
      } else if (item[hi] == -1) {
        if (greaterThan(lo, 0)) {
          compCt++;
          $('#quickCompCt').html('' + compCt);
          copyItem(hi, lo);
          hi = hi - 1;
          multiBoxLoc.x = lo;
          multiBoxLoc.y = hi;
        } else {
          lo = lo + 1;
          multiBoxLoc.x = lo;
          multiBoxLoc.y = hi;
        }
      }
      break;
    case '4': // merge sort
      if (lo == 1 && sortLength == VAL_MAIN / 2) {
        // sortLength é o VAL_MAIN / 2
        console.log('caiu no 1 IF');
        for (var x = 1; x <= VAL_MAIN; x++) item[x] += resizeCol;
        done = true;
      } else if (lo == 1) {
        console.log('caiu no 2 IF');
        hi = hi + 1;
        sortLength = sortLength * 2;
        k = VAL_MAIN + 1;
        i = 1;
        j = sortLength + 1;
        end_i = i + sortLength - 1;
        end_j = j + sortLength - 1;
        multiBoxLoc.x = i + VAL_MAIN;
        multiBoxLoc.y = end_j + VAL_MAIN;
        mergeBox = [i, end_i, end_j];
        lo = 0;
      } else if (end_i < i && end_j < j) {
        console.log('caiu no 3 IF');
        if (k == VAL_MAIN * 2 + 1) {
          console.log('caiu no 3/1 IF');
          multiBoxLoc.x = -1;
          multiBoxLoc.y = -1;
          mergeBox = [-1, -1, -1];
          for (var n = 1; n < VAL_MAIN + 1; n++) {
            actionQueue.push({
              action: 'copy',
              from: n + VAL_MAIN,
              to: n,
              delay: 0,
            });
          }
          lo = 1;
        } else {
          console.log('caiu no 3/2 IF');
          end_i = end_i + 2 * sortLength;
          end_j = end_j + 2 * sortLength;
          j = end_i + 1;
          i = j - sortLength;
          multiBoxLoc.x = i + VAL_MAIN;
          multiBoxLoc.y = end_j + VAL_MAIN;
          mergeBox = [i, end_i, end_j];
        }
      } else if (end_i < i) {
        console.log('caiu no 4 IF');
        putBoxes(-1, -1);
        copyItem(k, j);
        j = j + 1;
        k = k + 1;
      } else if (end_j < j) {
        console.log('caiu no 5 IF');
        putBoxes(-1, -1);
        copyItem(k, i);
        i = i + 1;
        k = k + 1;
      } else if (greaterThan(i, j)) {
        compCt++;
        $('#mergeCompCt').html('' + compCt);
        console.log('caiu no 5 IF');
        copyItem(k, j);
        j = j + 1;
        k = k + 1;
      } else {
        console.log('caiu no ELSE');
        copyItem(k, i);
        i = i + 1;
        k = k + 1;
      } // end case 4
      break;
    case '5': // insertions sort
      if (j == 0) {
        copyItem(0, 2);
        j = 2;
        i = 1;
        // tempOn = true;
      } else if (j == VAL_MAIN + 1) {
        multiBoxLoc.x = -1;
        multiBoxLoc.y - 1;
        for (var x = 1; x <= VAL_MAIN; x++) item[x] += resizeCol;
        done = true;
        // tempOn = false;
      } else if (i == 0) {
        copyItem(1, 0);
        i = -1;
      } else if (i == -1) {
        putBoxes(-1, -1);
        multiBoxLoc.x = 1;
        multiBoxLoc.y = j;
        j = j + 1;
        i = -2;
      } else if (i == -2) {
        copyItem(0, j);
        i = j - 1;
      } else if (greaterThan(i, 0)) {
        compCt++;
        $('#insertionCompCt').html('' + compCt);
        copyItem(i + 1, i);
        i = i - 1;
      } else {
        copyItem(i + 1, 0);
        i = -1;
      } // end case 3
      break;
  } // end switch
} // end scriptStep()

function doAction(what) {
  // perform one action from the action queue; actions are encoded as objects.
  switch (what.action) {
    case 'copy':
      item[what.to] = item[what.from];
      item[what.from] = -1;
      moveCt++;
      if (tempSort == '1') $('#bubbleMoveCt').html('' + moveCt);
      if (tempSort == '2') $('#selectionMoveCt').html('' + moveCt);
      if (tempSort == '3') $('#quickMoveCt').html('' + moveCt);
      if (tempSort == '4') $('#insertionMoveCt').html('' + moveCt);
      if (tempSort == '5') $('#mergeMoveCt').html('' + moveCt);
      break;
    case 'startmove':
      movingItem = item[what.from];
      item[what.from] = -1;
      movingItemLoc.x = what.x;
      movingItemLoc.y = what.y;
      break;
    case 'move':
      movingItemLoc.x = what.x;
      movingItemLoc.y = what.y;
      break;
    case 'donemove':
      item[what.to] = movingItem;
      movingItem = -1;
      moveCt++;
      if (tempSort == '1') $('#bubbleMoveCt').html('' + moveCt);
      if (tempSort == '2') $('#selectionMoveCt').html('' + moveCt);
      if (tempSort == '3') $('#quickMoveCt').html('' + moveCt);
      if (tempSort == '4') $('#insertionMoveCt').html('' + moveCt);
      if (tempSort == '5') $('#mergeMoveCt').html('' + moveCt);
      break;
    case 'finishItem':
      item[what.itemNum] += resizeCol;
      break;
    case 'maxoff':
      maxLoc = -1;
      break;
  }
}

function frame() {
  timeout = null;
  fast = $('#fastCheckbox').attr('checked');
  if (actionQueue.length > 0) {
    var what;
    do {
      what = actionQueue.shift();
      doAction(what);
    } while (actionQueue.length > 0 && what.delay == 0);
    timeout = setTimeout(frame, Math.max(5, what.delay));
  } else {
    if (!valid) {
      scriptSetup();
      valid = true;
      done = false;
      if (state == RUN) timeout = setTimeout(frame, fast ? 0 : 1000);
    } else {
      scriptStep();
      if (!done && state == RUN) timeout = setTimeout(frame, fast ? 0 : 1000);
    }
    if (done) setState(IDLE);
    else if (state == STEPPING) setState(PAUSED);
  }
  if (done && actionQueue.length == 0) setState(IDLE);
  else if (state == STEPPING && actionQueue.length == 0) setState(PAUSED);

  switch (tempSort) {
    case '1':
      bubbleDraw();
      break;

    case '2':
      selectionDraw();
      break;

    case '3':
      quickDraw();
      break;

    case '4':
      break;

    case '5':
      break;

    default:
      console.log('Caiu no default: ' + tempSort);
      // tempSort = '0';
      defaultDraw();
      break;
  }
}

// ---------------------------- Control and Initialization -------------------------------

function doRun(sort) {
  if (tempSort == '0') {
    tempSort = sort;
    console.log(`(${tempSort}) tempSort estava zerado`);
  } else if (
    tempSort == '1' ||
    tempSort == '2' ||
    tempSort == '3' ||
    tempSort == '4' ||
    tempSort == '5'
  ) {
    console.log(`(${tempSort}) resume...`);
  } else {
    console.log(`(${tempSort}) setou tempSort como '0'`);
    tempSort = '0';
  }
  if (state == RUN || state == IDLE || state == STEPPING) return;
  setState(RUN);
  frame();
}
function doStep(sort) {
  if (state == RUN || state == IDLE || state == STEPPING) return;
  setState(STEPPING);
  frame();
}
function doPause(sort) {
  if (state != RUN) return;
  stopRunning();
  setState(PAUSED);
  if (sort == '1') bubbleDraw();
  if (sort == '2') selectionDraw();
  if (sort == '3') bubbleDraw();
  if (sort == '4') bubbleDraw();
  if (sort == '5') bubbleDraw();
}
function doNew() {
  // handler for "New" button
  newSort();
}

function bubbleCanva() {
  var bubbleCanvas = document.getElementById('bubbleCanvas');
  bubble = bubbleCanvas.getContext('2d');

  $('#runBtn1').click(() => {
    doRun('1');
  });
  $('#stepBtn1').click(() => {
    doStep('1');
  });
  $('#pauseBtn1').click(() => {
    doPause('1');
  });
  $('#newBtn').click(doNew);
  $('#fastCheckbox').change(function () {
    if ($('#fastCheckbox').attr('checked'));
  });
}
function selectionCanva() {
  var selectionCanvas = document.getElementById('selectionCanvas');
  selection = selectionCanvas.getContext('2d');
  width = selectionCanvas.width;
  height = selectionCanvas.height;

  $('#runBtn2').click(() => {
    doRun('2');
  });
  $('#stepBtn2').click(() => {
    doStep('2');
  });
  $('#pauseBtn2').click(() => {
    doPause('2');
  });
  $('#newBtn').click(doNew);
}
function quickCanva() {
  var quickCanvas = document.getElementById('quickCanvas');
  quick = quickCanvas.getContext('2d');
  width = quickCanvas.width;
  height = quickCanvas.height;

  $('#runBtn3').click(() => {
    doRun('3');
  });
  $('#stepBtn3').click(() => {
    doStep('3');
  });
  $('#pauseBtn3').click(() => {
    doPause('3');
  });
  $('#newBtn').click(doNew);
}
function insertionCanva() {}
function mergeCanva() {}

function size1(w, h) {
  width = w;
  height = h;
  var x = (width + 5) / VAL_MAIN;
  barWidth = x - 3;
  leftOffset = (width - VAL_MAIN * barWidth - 30 * barGap) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function size2(w, h) {
  width = w;
  height = h;
  var x = (width - 20 + barGap) / VAL_MAIN;
  barWidth = x - barGap;
  leftOffset = (width - VAL_MAIN * barWidth * 1.2) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function size3(w, h) {
  width = w;
  height = h;
  var x = (width - 20 + barGap) / VAL_MAIN;
  barWidth = x - barGap;
  leftOffset = (width - VAL_MAIN * barWidth * 1.5) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function size4(w, h) {
  width = w;
  height = h;
  var x = (width - 20 + barGap) / VAL_MAIN;
  barWidth = x - barGap;
  leftOffset = (width - VAL_MAIN * barWidth * 3.05) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function size5(w, h) {
  width = w;
  height = h;
  var x = (width - 20 + barGap) / VAL_MAIN;
  barWidth = x - barGap;
  leftOffset = (width - VAL_MAIN * barWidth * -2.9) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function size6(w, h) {
  width = w;
  height = h;
  var x = (width - 20 + barGap) / VAL_MAIN;
  barWidth = x - barGap;
  leftOffset = (width - VAL_MAIN * barWidth * -0.59) / 2;
  barHeight = height - 20;
  barIncrement = (barHeight - 3) / (VAL_MAIN + 1);
  minBarHeight = barHeight - (VAL_MAIN + 1) * barIncrement;
  firstRow_y = barHeight + 10;
  secondRow_y = 2 * barHeight + 25;
}

function setValMain(x) {
  VAL_MAIN = parseInt(x);
  if (VAL_MAIN === 32) size1(width, height);
  if (VAL_MAIN === 64) size2(width, height);
  if (VAL_MAIN === 128) size3(width, height);
  if (VAL_MAIN === 256) size4(width, height);
  if (VAL_MAIN === 512) size5(width, height);
  if (VAL_MAIN === 1024) size6(width, height);
  newSort();
  return VAL_MAIN;
}

$(document).ready(function () {
  bubbleCanva();
  selectionCanva();
  quickCanva();
  setValMain($('select option:selected').val());
  $('#newBtn').click(() => {
    setValMain($('select option:selected').val());
  });
});
