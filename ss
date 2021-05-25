[1mdiff --git a/index.php b/index.php[m
[1mindex 91c9258..61c8504 100644[m
[1m--- a/index.php[m
[1m+++ b/index.php[m
[36m@@ -25,9 +25,7 @@[m
           <option value="524">524</option>[m
         </select>[m
       </div>[m
[31m-      <button type="button" class="btn btn-primary mx-2">Gerar</button>[m
[31m-      <button type="button" class="btn btn-success mx-2">Iniciar</button>[m
[31m-      <button type="button" class="btn btn-warning mx-2">Resetar</button>[m
[32m+[m[32m      <button type="button" id="newBtn" class="btn btn-primary mx-2">Gerar</button>[m
     </form>[m
   </div>[m
   <div class="container-fluid mt-5">[m
[36m@@ -39,19 +37,18 @@[m
             <label>Comparações:</label> <span id="compCt">0</span>[m
             <b>/</b>[m
             <label>Cópias: </label> <span id="moveCt">0</span>[m
[31m-            <canvas id="sortcanvas1" width=700 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>[m
[32m+[m[32m            <canvas id="bubbleCanvas" width=700 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>[m
           </div>[m
           <div class="col">[m
[31m-            <p><select id="sortSelect">[m
[32m+[m[32m            <!-- <p><select id="sortSelect">[m
                 <option value="1">Bubble Sort</option>[m
                 <option value="2">Selection Sort</option>[m
                 <option value="3">Insertion Sort</option>[m
                 <option value="4">Merge Sort</option>[m
                 <option value="5">Quick Sort</option>[m
[31m-              </select></p>[m
[31m-            <p><button id="newBtn">New Sort</button></p>[m
[32m+[m[32m              </select></p> -->[m
             <p><input type=checkbox id="fastCheckbox"><label for="fastCheckbox">Fast</label></p>[m
[31m-            <p><button id="runBtn">Run</button></p>[m
[32m+[m[32m            <button type="button" id="runBtn" class="btn btn-success my-2">Iniciar</button>[m
             <p><button id="pauseBtn">Pause</button></p>[m
             <p><button id="stepBtn">Step</button></p>[m
           </div>[m
[36m@@ -64,19 +61,18 @@[m
             <label>Comparações:</label> <span id="compCt">0</span>[m
             <b>/</b>[m
             <label>Cópias: </label> <span id="moveCt">0</span>[m
[31m-            <canvas id="sortcanvas1" width=700 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>[m
[32m+[m[32m            <canvas id="selectionCanvas" width=700 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>[m
           </div>[m
           <div class="col">[m
[31m-            <p><select id="sortSelect">[m
[32m+[m[32m            <!-- <p><select id="sortSelect">[m
                 <option value="1">Bubble Sort</option>[m
                 <option value="2">Selection Sort</option>[m
                 <option value="3">Insertion Sort</option>[m
                 <option value="4">Merge Sort</option>[m
                 <option value="5">Quick Sort</option>[m
[31m-              </select></p>[m
[31m-            <p><button id="newBtn">New Sort</button></p>[m
[32m+[m[32m              </select></p> -->[m
             <p><input type=checkbox id="fastCheckbox"><label for="fastCheckbox">Fast</label></p>[m
[31m-            <p><button id="runBtn">Run</button></p>[m
[32m+[m[32m            <button type="button" id="runBtn" class="btn btn-success my-2">Iniciar</button>[m
             <p><button id="pauseBtn">Pause</button></p>[m
             <p><button id="stepBtn">Step</button></p>[m
           </div>[m
[1mdiff --git a/sortlab_AGORAVAI.html b/sortlab_AGORAVAI.html[m
[1mdeleted file mode 100644[m
[1mindex c0aaca9..0000000[m
[1m--- a/sortlab_AGORAVAI.html[m
[1m+++ /dev/null[m
[36m@@ -1,906 +0,0 @@[m
[31m-<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">[m
[31m-<!--[m
[31m-   Requires support for the HTML5 "canvas" element.  Should work in new[m
[31m-   browsers, including Firefox, Chrome, Safari, Opera, and Internet Explorer 9.[m
[31m-   Uses Javascript and a canvas to demonstate several sorting algoithms.[m
[31m-   This is a port of a Java program from about 1998, which was itself a[m
[31m-   post of an older Macintosh Pascal program.  The hard part of the Javascript[m
[31m-   port was that the original code uses loops in a separate thread, which isn't[m
[31m-   possible in Javascript (except maybe with "worker" threads, which I haven't[m
[31m-   tried yet).  The solution that I used here is an "actionQueue" that contains[m
[31m-   a queue of actions to be performed.[m
[31m--->[m
[31m-<html>[m
[31m-[m
[31m-<head>[m
[31m-  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">[m
[31m-  <title>Sorting with HTML Canvas</title>[m
[31m-  <!-- <script src="jquery-1.6.1.min.js" type="text/javascript"></script> -->[m
[31m-  <script src="https://code.jquery.com/jquery-1.6.1.js" integrity="sha256-Du92qVg6bHoet2TTP+N2v+GGHfefq4LCw/XRYYPoIBY="[m
[31m-    crossorigin="anonymous"></script>[m
[31m-  <!--[if lt IE 9]>[m
[31m-    <script src="excanvas.js"></script>[m
[31m-<![endif]-->[m
[31m-  <script type="text/javascript">[m
[31m-    var borderColor = "#00D"; // I would use 'const', not 'var', but it breaks in IE[m
[31m-    var barColor = "#888";[m
[31m-    var finishedBarColor = "#000";[m
[31m-    var movingBarColor = "#DDD";[m
[31m-    var movingBarOutlineColor = "#888";[m
[31m-    var boxColor = "#D0D";[m
[31m-    var multiBoxColor = "#0B0";[m
[31m-    var maxColor = "#F00";[m
[31m-[m
[31m-    var barGap = 10;[m
[31m-[m
[31m-    var IDLE = 0; // possible values for the "state" variable.[m
[31m-    var STARTING = 1;[m
[31m-    var RUN = 2;[m
[31m-    var STEPPING = 3;[m
[31m-    var PAUSED = 4;[m
[31m-[m
[31m-    var state = IDLE;[m
[31m-[m
[31m-    var g; // graphic context for drawing on the canvas.[m
[31m-    var width, height; // width and height of the canvas.[m
[31m-[m
[31m-    var barWidth, barHeight, minBarHeight, barIncrement; // measurements used for drawing.[m
[31m-    var leftOffset, firstRow_y, secondRow_y, textAscent;[m
[31m-[m
[31m-    var method; // The sorting method that is being used, coded as 1,2,3,4,5; controlled by a select element.[m
[31m-[m
[31m-    var fast = false; // Things move faster when this is true;  the value is controlled by a checkbox.[m
[31m-[m
[31m-    var item = new Array(); // a 33-element array containing the numbers to be sorted in positions 1 to 16.[m
[31m-    // item[0] holds the value of temp.  positions 17 - 33 are used in MergeSort.[m
[31m-    // a value of -1 in this array means that no item is present.  When an item[m
[31m-    // is in its final position, 100 is added to the value as a signal that the[m
[31m-    // item should be drawn in black.[m
[31m-[m
[31m-    var tempOn = false; // Variables that control the extra stuff that is sometimes drawn, in addition to items.[m
[31m-    var mergeBox = [-1, -1, -1];;[m
[31m-    var multiBoxLoc = {[m
[31m-      x: -1,[m
[31m-      y: -1[m
[31m-    };[m
[31m-    var movingItemLoc = {[m
[31m-      x: -1,[m
[31m-      y: -1[m
[31m-    };[m
[31m-    var maxLoc, hiLoc, loLoc, box1Loc, box2Loc, movingItem;[m
[31m-[m
[31m-    var copyCt; // Number of copies done so far in the current sort.[m
[31m-    var compCt; // Number of comparisons done so far in the current sort.[m
[31m-[m
[31m-    var timeout = null; // When non-null, indicates a pending timeout (so it can be cleared to stop the animation).[m
[31m-[m
[31m-    function say1(message) { // put the message in the paragraph with id "message1"[m
[31m-      $("#message1").html(message);[m
[31m-    }[m
[31m-[m
[31m-    function say2(message) { // put the message in the paragraph with id "message2", unless running at "fast" speed[m
[31m-      if (!fast || state != RUN || message == "")[m
[31m-        $("#message2").html(message);[m
[31m-    }[m
[31m-[m
[31m-    function stopRunning() { // does any pending actions in the action queue (with no delay) and cancels any timeout.[m
[31m-      while (actionQueue.length > 0) {[m
[31m-        doAction(actionQueue.shift());[m
[31m-      }[m
[31m-      if (timeout) {[m
[31m-        clearTimeout(timeout);[m
[31m-        timeout = null;[m
[31m-      }[m
[31m-    }[m
[31m-[m
[31m-    function setState([m
[31m-      newState) { // called whenever the state changes; sets enabled/disabled status of various elements.[m
[31m-      state = newState;[m
[31m-      $("#runBtn").attr("disabled", state == RUN || state == IDLE || state == STEPPING);[m
[31m-      $("#pauseBtn").attr("disabled", state != RUN);[m
[31m-      $("#stepBtn").attr("disabled", state == RUN || state == IDLE || state == STEPPING);[m
[31m-      $("#sortSelect").attr("disabled", state == RUN || state == PAUSED || state == STEPPING);[m
[31m-    }[m
[31m-[m
[31m-    function newSort() { // Set up to get ready for a new sort by storing items in random array positions, etc.[m
[31m-      stopRunning();[m
[31m-      setState(STARTING);[m
[31m-      valid = false;[m
[31m-      maxLoc = -1;[m
[31m-      hiLoc = -1;[m
[31m-      loLoc = -1;[m
[31m-      box1Loc = -1;[m
[31m-      box2Loc = -1;[m
[31m-      multiBoxLoc.x = -1;[m
[31m-      mergeBox[0] = [-1, -1, -1];[m
[31m-      movingItem = -1;[m
[31m-      tempOn = false;[m
[31m-      for (var i = 1; i <= 16; i++)[m
[31m-        item[i] = i;[m
[31m-      for (var i = 16; i >= 2; i--) {[m
[31m-        var j = 1 + Math.floor(Math.random() * i);[m
[31m-        var temp = item[i];[m
[31m-        item[i] = item[j];[m
[31m-        item[j] = temp;[m
[31m-      }[m
[31m-      item[0] = -1;[m
[31m-      for (var i = 17; i < 33; i++)[m
[31m-        item[i] = -1;[m
[31m-      $("#compCt").html("0");[m
[31m-      $("#moveCt").html("0");[m
[31m-      compCt = 0;[m
[31m-      copyCt = 0;[m
[31m-      valid = false;[m
[31m-      say1("Click \"Run\" or \"Step\" to begin sorting.");[m
[31m-      say2("");[m
[31m-      draw();[m
[31m-    }[m
[31m-[m
[31m-    //-------------------------------- Drawing ------------------------------------------[m
[31m-[m
[31m-    function putItem(i) { // draws item i from the array item[]; if item[i] is -1, nothing is drawn.[m
[31m-      var h = item[i];[m
[31m-      if (h == -1)[m
[31m-        return;[m
[31m-      var x, y, ht;[m
[31m-      if (h > 16) {[m
[31m-        ht = (h - 100) * barIncrement + minBarHeight;[m
[31m-        g.fillStyle = finishedBarColor;[m
[31m-      } else {[m
[31m-        ht = h * barIncrement + minBarHeight;[m
[31m-        g.fillStyle = barColor;[m
[31m-      }[m
[31m-      if (i == 0) {[m
[31m-        x = leftOffset + ((barWidth + barGap) * 15) / 2;[m
[31m-        y = secondRow_y - ht;[m
[31m-      } else if (i < 17) {[m
[31m-        x = leftOffset + (i - 1) * (barWidth + barGap);[m
[31m-        y = firstRow_y - ht;[m
[31m-      } else {[m
[31m-        x = leftOffset + (i - 17) * (barWidth + barGap);[m
[31m-        y = secondRow_y - ht;[m
[31m-      }[m
[31m-      try {[m
[31m-        g.fillRect(x, y, barWidth, ht);[m
[31m-        g.strokeStyle = finishedBarColor;[m
[31m-        g.strokeRect(x, y, barWidth, ht);[m
[31m-      } catch (e) { // (Got an error during development when item[i] was undefined.  Shouldn't happen again. :-)[m
[31m-        if (timeout != null)[m
[31m-          timeout.cancel();[m
[31m-        setState(IDLE);[m
[31m-        alert("Internal error while drawing!!??");[m
[31m-      }[m
[31m-    }[m
[31m-[m
[31m-    function drawMovingItem() { // Draws an item that is being moved to animate the copying of an item from one place to another.[m
[31m-      var ht = movingItem * barIncrement + minBarHeight;[m
[31m-      g.fillStyle = movingBarColor;[m
[31m-      g.fillRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);[m
[31m-      g.strokeColor = movingBarOutlineColor;[m
[31m-      g.strokeRect(movingItemLoc.x, movingItemLoc.y - ht, barWidth, ht);[m
[31m-    }[m
[31m-[m
[31m-    function drawMax() { // Writes "Max" under one of the items, with an arrow pointing to the item.[m
[31m-      var sw = 30; // (guess at string width)[m
[31m-      var x = leftOffset + (maxLoc - 1) * (barWidth + barGap) + barWidth / 2;[m
[31m-      var y = firstRow_y + 38 + textAscent;[m
[31m-      g.fillStyle = maxColor;[m
[31m-      g.fillText("Max", x - sw / 2, y + textAscent);[m
[31m-      g.strokeStyle = maxColor;[m
[31m-      g.beginPath();[m
[31m-      g.moveTo(x, y);[m
[31m-      g.lineTo(x, y - 29);[m
[31m-      g.moveTo(x, y - 29);[m
[31m-      g.lineTo(x + 6, y - 24);[m
[31m-      g.moveTo(x, y - 29);[m
[31m-      g.lineTo(x - 6, y - 24);[m
[31m-      g.stroke();[m
[31m-    }[m
[31m-[m
[31m-    function drawBox(boxLoc) { // draws a box aroud one of the items (indicated by boxLoc)[m
[31m-      var x, y;[m
[31m-      if (boxLoc == 0) {[m
[31m-        x = leftOffset + ((barWidth + barGap) * 15) / 2;[m
[31m-        y = secondRow_y;[m
[31m-      } else if (boxLoc < 17) {[m
[31m-        x = leftOffset + (boxLoc - 1) * (barWidth + barGap);[m
[31m-        y = firstRow_y;[m
[31m-      } else {[m
[31m-        x = leftOffset + (boxLoc - 17) * (barWidth + barGap);[m
[31m-        y = secondRow_y;[m
[31m-      }[m
[31m-      g.strokeStyle = boxColor;[m
[31m-      g.strokeRect(x - 2, y - barHeight - 2, barWidth + 4, barHeight + 4);[m
[31m-    }[m
[31m-[m
[31m-    function drawMultiBox() { // draws a box around items number multiBoxLoc.x through multiBoxLoc.y[m
[31m-      var x, y, wd;[m
[31m-      if (multiBoxLoc.x < 17) {[m
[31m-        y = firstRow_y;[m
[31m-        x = leftOffset + (multiBoxLoc.x - 1) * (barWidth + barGap);[m
[31m-      } else {[m
[31m-        y = secondRow_y;[m
[31m-        x = leftOffset + (multiBoxLoc.x - 17) * (barWidth + barGap);[m
[31m-      }[m
[31m-      wd = (multiBoxLoc.y - multiBoxLoc.x) * (barGap + barWidth) + barWidth;[m
[31m-      g.strokeStyle = multiBoxColor;[m
[31m-      g.strokeRect(x - 4, y - barHeight - 4, wd + 8, barHeight + 8);[m
[31m-    }[m
[31m-[m
[31m-    function drawMergeListBoxes() { // Draws a pair of boxes around lists that are being merged in MergeSort[m
[31m-      var x, y, wd1, wd2;[m
[31m-      y = firstRow_y;[m
[31m-      x = leftOffset + (mergeBox[0] - 1) * (barWidth + barGap);[m
[31m-      wd1 = (mergeBox[1] - mergeBox[0]) * (barGap + barWidth) + barWidth;[m
[31m-      wd2 = (mergeBox[2] - mergeBox[0]) * (barGap + barWidth) + barWidth;[m
[31m-      g.strokeStyle = multiBoxColor;[m
[31m-      g.strokeRect(x - 4, y - barHeight - 4, wd1 + 8, barHeight + 8);[m
[31m-      g.strokeRect(x - 4, y - barHeight - 4, wd2 + 8, barHeight + 8);[m
[31m-    }[m
[31m-[m
[31m-    function draw() { // Completely redraws the canvas to show the current state.[m
[31m-      g.clearRect(0, 0, width, height);[m
[31m-      g.strokeStyle = borderColor;[m
[31m-      g.strokeRect(0, 0, width, height);[m
[31m-      g.strokeRect(1, 1, width - 2, height - 2);[m
[31m-      for (var i = 1; i <= 16; i++)[m
[31m-        putItem(i);[m
[31m-      g.fillStyle = borderColor;[m
[31m-      for (var i = 1; i <= 16; i++) {[m
[31m-        var sw = (i < 10) ? 6 : 12;[m
[31m-        g.fillText("" + i, leftOffset + (i - 1) * (barWidth + barGap) + (barWidth - sw) / 2, firstRow_y + 6 +[m
[31m-          textAscent);[m
[31m-      }[m
[31m-      for (var i = 17; i <= 32; i++)[m
[31m-        putItem(i);[m
[31m-      if (tempOn) {[m
[31m-        g.fillStyle = borderColor;[m
[31m-        var sw = 40;[m
[31m-        g.fillText("Temp", leftOffset + (16 * barWidth + 15 * barGap - sw) / 2, secondRow_y + 5 + textAscent);[m
[31m-        putItem(0);[m
[31m-      }[m
[31m-      if (maxLoc >= 0)[m
[31m-        drawMax();[m
[31m-      if (box1Loc >= 0)[m
[31m-        drawBox(box1Loc);[m
[31m-      if (box2Loc >= 0)[m
[31m-        drawBox(box2Loc);[m
[31m-      if (multiBoxLoc.x > 0)[m
[31m-        drawMultiBox();[m
[31m-      if (mergeBox[0] > 0)[m
[31m-        drawMergeListBoxes();[m
[31m-      if (movingItem >= 0)[m
[31m-        drawMovingItem();[m
[31m-    }[m
[31m-[m
[31m-    // ---------------------------- Stepping through the sorts ------------------------------[m
[31m-[m
[31m-    var actionQueue = new Array(); // A queue of pending actions for implmenting some aspects of the animation.[m
[31m-[m
[31m-    var done = false; // state variables for scripting the various sorting algorithms.[m
[31m-    var i, j, k;[m
[31m-    var hi, lo;[m
[31m-    var stack = new Array();[m
[31m-    var stackCt;[m
[31m-    var sortLength, end_i, end_j;[m
[31m-    var valid = false; // false when a sort is just ready to start; set to true when the first step is taken.[m
[31m-[m
[31m-    function copyItem(toItem,[m
[31m-      fromItem) { // copy an item from one place to another (actually just enqueue actions to do so)[m
[31m-      if (fast) { // enqueue a single copy action when the "fast" checkbox is seledted.[m
[31m-        actionQueue.push({[m
[31m-          action: "copy",[m
[31m-          from: fromItem,[m
[31m-          to: toItem,[m
[31m-          delay: 200[m
[31m-        });[m
[31m-      } else { // enqueue a series of actions that move the item gradually from old position to new.[m
[31m-        var x1, y1, x2, y2;[m
[31m-        if (toItem == 0) {[m
[31m-          x2 = leftOffset + ((barWidth + barGap) * 15) / 2;[m
[31m-          y2 = secondRow_y;[m
[31m-        } else if (toItem < 17) {[m
[31m-          x2 = leftOffset + (toItem - 1) * (barWidth + barGap);[m
[31m-          y2 = firstRow_y;[m
[31m-        } else {[m
[31m-          x2 = leftOffset + (toItem - 17) * (barWidth + barGap);[m
[31m-          y2 = secondRow_y;[m
[31m-        }[m
[31m-        if (fromItem == 0) {[m
[31m-          x1 = leftOffset + ((barWidth + barGap) * 15) / 2;[m
[31m-          y1 = secondRow_y;[m
[31m-        } else if (fromItem < 17) {[m
[31m-          x1 = leftOffset + (fromItem - 1) * (barWidth + barGap);[m
[31m-          y1 = firstRow_y;[m
[31m-        } else {[m
[31m-          x1 = leftOffset + (fromItem - 17) * (barWidth + barGap);[m
[31m-          y1 = secondRow_y;[m
[31m-        }[m
[31m-        var dist = Math.round(Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)));[m
[31m-        var ct = Math.round(dist / 3);[m
[31m-        if (ct > 25)[m
[31m-          ct = 25;[m
[31m-        else if (ct < 6)[m
[31m-          ct = 6;[m
[31m-        actionQueue.push({[m
[31m-          action: "startmove",[m
[31m-          from: fromItem,[m
[31m-          x: x1,[m
[31m-          y: y1,[m
[31m-          delay: 100[m
[31m-        });[m
[31m-        for (var i = 0; i <= ct; i++) {[m
[31m-          actionQueue.push({[m
[31m-            action: "move",[m
[31m-            x: x1 + Math.round(((x2 - x1) * i) / ct),[m
[31m-            y: y1 + Math.round(((y2 - y1) * i) / ct),[m
[31m-            delay: 25[m
[31m-          });[m
[31m-        }[m
[31m-        actionQueue.push({[m
[31m-          action: "donemove",[m
[31m-          to: toItem,[m
[31m-          delay: 200[m
[31m-        });[m
[31m-      }[m
[31m-    }[m
[31m-[m
[31m-    function swapItems(a, b) { // swaps two items; actually just enqueues actions to do that[m
[31m-      copyItem(0, a);[m
[31m-      copyItem(a, b);[m
[31m-      copyItem(b, 0);[m
[31m-    }[m
[31m-[m
[31m-    function greaterThan(itemA,[m
[31m-      itemB) { // test if one item is greater than another; boxes are shown around the two items.[m
[31m-      compCt++;[m
[31m-      $("#compCt").html("" + compCt);[m
[31m-      putBoxes(itemA, itemB);[m
[31m-      return (item[itemA] > item[itemB]);[m
[31m-    }[m
[31m-[m
[31m-    function putBoxes(itemA, itemB) { // show boxes around two items[m
[31m-      box1Loc = itemA;[m
[31m-      box2Loc = itemB;[m
[31m-    }[m
[31m-[m
[31m-    function scriptSetup() { // The first step i