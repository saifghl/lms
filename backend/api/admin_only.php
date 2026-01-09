<?php
require_once __DIR__ . "/verify_token.php";
$decoded = verifyJwtFromHeader("admin"); 


echo json_encode(["status"=>"success","message"=>"Welcome admin: ".$decoded->data->email]);
?>