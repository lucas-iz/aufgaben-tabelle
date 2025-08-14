<?php
require("connection-details.php");

$connection = mysqli_connect(HOST, USER, PASS, DB) or die("Error " . mysqli_error($connection));

$sql = "SELECT * FROM aufgaben";
$result = mysqli_query($connection, $sql) or die("Error in Selecting " . mysqli_error($connection));

$data = array();
while($row =mysqli_fetch_assoc($result))
{
    $data[] = $row;
}
echo json_encode($data);

mysqli_close($connection);

?>