<?php

function numGenerator($qtd)
{
  $num_array = range(0, $qtd);
  shuffle($num_array);
  $random_num_array = array_slice($num_array, 0, $qtd);
  echo implode(', ', $random_num_array);
  // for ($i = 0; $i < $random_num_array; $i++) {
  //   echo "<th scope='col'></th>";
  // }

  // print_r($random_number_array);    

  $return_arr[] = ["id" => 1];
  echo json_encode($return_arr);
}

$qtd = $_POST['qtd'];
numGenerator($qtd);
