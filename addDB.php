<?php
require("connection-details.php");

$db_link = mysqli_connect (HOST, USER, PASS, DB);

$time = $_GET['date'];
$modul = $_GET['modul'];
$aufgabe = $_GET['aufgabe'];
$state = $_GET['state'];

$todo = 0;
$doing = 0;
$done = 0;

if($state == "todo") {
   $todo = 1;
}
else if ($state == "doing") {
   $doing = 1;
}
else { // done
   $done = 1;
}

echo $time."<br>".$modul."<br>".$aufgabe."<br>".$todo."<br>".$doing."<br>".$done;

$sqlToExecute = "INSERT INTO aufgaben (time,modul,aufgabe,todo,doing,done)
   VALUES ('$time','$modul','$aufgabe',$todo,$doing,$done)";

$result = mysqli_query($db_link, $sqlToExecute)
            OR die("'".$sql."':".mysqli_error());

echo $result;

?>