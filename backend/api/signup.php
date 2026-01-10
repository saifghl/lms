<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../core/env.php";
loadEnv(__DIR__ . "/../.env");


require_once __DIR__ . "/../vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$data = json_decode(file_get_contents("php://input"), true);

$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";
$role = strtolower(trim($data["role"] ?? ""));

$allowedRoles = ["admin","agent","driver"];
if (!$name || !$email || !$password || !in_array($role, $allowedRoles)) {
    echo json_encode(["status"=>"error","message"=>"All fields required and role must be admin|agent|driver"]);
    exit;
}

$usersFile = __DIR__ . "/../data/users.json";
$users = json_decode(file_get_contents($usersFile), true);

// prevent duplicate
foreach ($users as $u) {
    if (strtolower($u["email"]) === strtolower($email)) {
        echo json_encode(["status"=>"error","message"=>"Email already registered"]);
        exit;
    }
}


$newUser = [
 $newUser = [
    "name" => $name,
    "email" => $email,
    "password" => password_hash($password, PASSWORD_DEFAULT), 
    "role" => $role,
    "jwt" => ""
];

];

$users[] = $newUser;
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

$secret = $_ENV["SECRET_KEY"] ?? "";
$exp = time() + intval($_ENV["TOKEN_EXPIRY"] ?? 3600);

$payload = [
    "iss" => $_SERVER['HTTP_HOST'] ?? "localhost",
    "iat" => time(),
    "exp" => $exp,
    "data" => [
        "email" => $email,
        "name"  => $name,
        "role"  => $role
    ]
];

$jwt = JWT::encode($payload, $secret, 'HS256');


foreach ($users as &$u) {
    if (strtolower($u["email"]) === strtolower($email)) {
        $u["jwt"] = $jwt;
        break;
    }
}
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));

echo json_encode([
    "status" => "success",
    "message" => "Signup successful",
    "token" => $jwt,
    "role" => $role,
    "expires_in" => $exp
]);
