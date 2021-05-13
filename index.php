<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">

  <title></title>
</head>

<body class="bg-dark">
  <div class="container">
    <div class="row justify-content-center align-items-center">
      <div class="col-sm-2">
        <input type="text" class="form-control" id="qtd" placeholder="Itens">
      </div>
      <div class="col-sm-1">
        <button class="btn btn-primary" onclick="genNumber()">Gerar</button>
      </div>
      <div class="col-auto my-1">
        <button class="btn btn-success">Ordernar</button>
      </div>
    </div>
  </div>
  <div class="container-fluid mt-3 container_graphics text-white">
    <div class="row">
      <div class="col">
        <!-- <div id="insertion" class="h-100 w-100 d-inline-block bg-white"> -->
        <div id="insertion" class="">
          <label for="">Insertion Sort</label>
          <table class="table" id="insertTable" style="height: 300px;  width: 550px !important;">
            <thead>
              <tr>
                <th scope="col"></th>
                <!-- <th scope="col" class="bg-danger"></th>
                <th scope="col" class="bg-primary"></th> -->
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="col">
        <label for="">Selection Sort</label>
        <div id="selection" class="">
          <table class="table" style="height: 300px;">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="col">
        <label for="">Bubble Sort</label>
        <div id="bubble" class="">
          <table class="table" style="height: 300px;">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
    <div class="row mt-5" style="height: 400px;">
      <div class="col">
        <label for="">Merge Sort</label>
        <div id="merge" class="">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
      <div class="col">
        <label for="">Quick Sort</label>
        <div id="quick" class="">
          <table class="table">
            <thead>
              <tr>
                <th scope="col"></th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </div>
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js" integrity="sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g==" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
  <script>
    function genNumber() {
      $.ajax({
        type: 'POST',
        url: './sorts/generator.php',
        dataType: 'JSON',
        data: ({
          qtd: $('#qtd').val()
        }),
        success: function(res) {
          console.log('input:' + $('#qtd').val());
          console.log(res[0].id);

          let tb = "<th scope='col' class='bg-info'></th>";

          $("#insertTable tr").append(tb);
        }
      }).done(data => {
        // console.log('ajax');
      }).fail(err => {
        console.log('deu pau');
        console.log(err);
      })
    }
  </script>
</body>

</html>