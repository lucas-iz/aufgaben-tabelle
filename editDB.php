<?php
require("connection-details.php");

$db_link = mysqli_connect (HOST, USER, PASS, DB);

$todo = $_GET['todo'];
$doing = $_GET['doing'];
$done = $_GET['done'];
$id = $_GET['id'];

if($todo == "") $todo = 0;
if($doing == "") $doing = 0;
if($done == "") $done = 0;

$sqlToExecute = "UPDATE aufgaben 
   SET 
      todo = $todo, 
      doing = $doing,
      done = $done
   WHERE 
      id = $id
";

$result = mysqli_query($db_link, $sqlToExecute) 
            OR die("'".$sql."':".mysqli_error());

echo $result;
?>