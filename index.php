<!DOCTYPE html>
<html lang="pt-br">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  <script src="https://code.jquery.com/jquery-1.6.1.js" integrity="sha256-Du92qVg6bHoet2TTP+N2v+GGHfefq4LCw/XRYYPoIBY=" crossorigin="anonymous"></script>
  <script src="sorts.js"></script>
</head>

<body class="bg-dark">
  <div class="container">
    <form class="form-inline justify-content-center mt-2">
      <div class="form-group mx-2">
        <select class="custom-select">
          <option selected value="32">32</option>
          <option value="64">64</option>
          <option value="128">128</option>
          <option value="256">256</option>
          <option value="512">512</option>
          <option value="1024">1024</option>
        </select>
      </div>
      <button type="button" id="newBtn" class="btn btn-primary mx-2">Gerar</button>
      <input type="checkbox" id="fastCheckbox" checked><label class="text-white" for="fastCheckbox">Fast</label>
    </form>
  </div>
  <div class="container-fluid mt-5">
    <div class="row">
      <div class="col">
        <div class="row">
          <div class="col text-white">
            <b> Bubble Sort - </b>
            <label>Comparações:</label> <span id="bubbleCompCt">0</span>
            <b>/</b>
            <label>Cópias: </label> <span id="bubbleMoveCt">0</span>
            <canvas id="bubbleCanvas" width=780 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>
          </div>
          <div class="col mt-4">
            <p><button id="runBtn1" class="btn btn-success mt-2">Iniciar</button></p>
            <p><button id="pauseBtn1" class="btn btn-warning">Pause</button></p>
            <p><button id="stepBtn1" class="btn btn-primary">Step</button></p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col text-white">
            <b> Selection Sort - </b>
            <label>Comparações:</label> <span id="selectionCompCt">0</span>
            <b>/</b>
            <label>Cópias: </label> <span id="selectionMoveCt">0</span>
            <canvas id="selectionCanvas" width=780 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>
          </div>
          <div class="col mt-4">
            <p><button id="runBtn2" class="btn btn-success mt-2">Iniciar</button></p>
            <p><button id="pauseBtn2" class="btn btn-warning">Pause</button></p>
            <p><button id="stepBtn2" class="btn btn-primary">Step</button></p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col">
        <div class="row">
          <div class="col text-white">
            <b> Quick Sort - </b>
            <label>Comparações:</label> <span id="quickCompCt">0</span>
            <b>/</b>
            <label>Cópias: </label> <span id="quickMoveCt">0</span>
            <canvas id="quickCanvas" width=780 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>
          </div>
          <div class="col mt-4">
            <p><button id="runBtn3" class="btn btn-success mt-2">Iniciar</button></p>
            <p><button id="pauseBtn3" class="btn btn-warning">Pause</button></p>
            <p><button id="stepBtn3" class="btn btn-primary">Step</button></p>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="row">
          <div class="col">
            <canvas id="sortcanvas1" width=700 height=350 style="background-color:rgb(230,230,255);border-radius: 10px;"></canvas>
          </div>
          <div class="col">
            <p><select id="sortSelect">
                <option value="1">Bubble Sort</option>
                <option value="2">Selection Sort</option>
                <option value="3">Insertion Sort</option>
                <option value="4">Merge Sort</option>
                <option value="5">Quick Sort</option>
              </select></p>
            <!-- <p><button id="newBtn">New Sort</button></p>
            <p><input type=checkbox id="fastCheckbox"><label for="fastCheckbox">Fast</label></p>
            <p><button id="runBtn">Run</button></p>
            <p><button id="pauseBtn">Pause</button></p>
            <p><button id="stepBtn">Step</button></p> -->
            <p style="margin-top:30px;">
              <b>Comparações:</b> <span id="compCt">0</span>
            </p>
            <p style="margin-top:30px;">
              <b>Cópias: </b> <span id="moveCt">0</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>

</html>