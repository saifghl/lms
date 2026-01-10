<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require_once __DIR__ . "/../core/env.php";
loadEnv(__DIR__ . "/../.env");

require_once __DIR__ . "/../vendor/autoload.php";
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$data = json_decode(file_get_contents("php://input"), true);

$email = trim($data["email"] ?? "");
$password = $data["password"] ?? "";

if (!$email || !$password) {
    echo json_encode(["status"=>"error","message"=>"Email and password required"]);
    exit;
}

$usersFile = __DIR__ . "/../data/users.json";
$users = json_decode(file_get_contents($usersFile), true);

$foundIndex = null;
foreach ($users as $i => $u) {
    if (strtolower($u["email"]) === strtolower($email) && password_verify($password, $u["password"])) {
        $foundIndex = $i;
        break;
    }
}


if ($foundIndex === null) {
    echo json_encode(["status"=>"error","message"=>"Invalid credentials"]);
    exit;
}

$user = $users[$foundIndex];


$secret = $_ENV["SECRET_KEY"] ?? "";
$exp = time() + intval($_ENV["TOKEN_EXPIRY"] ?? 3600);

$payload = [
    "iss" => $_SERVER['HTTP_HOST'] ?? "localhost",
    "iat" => time(),
    "exp" => $exp,
    "data" => [
        "id"    => $foundIndex,
        "email" => $user["email"],
        "name"  => $user["name"] ?? "",
        "role"  => $user["role"]
    ]
];

$jwt = JWT::encode($payload, $secret, 'HS256');


$users[$foundIndex]["jwt"] = $jwt;
file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT));


echo json_encode([
    "status" => "success",
    "message" => "Login successful",
    "token" => $jwt,
    "role" => $user["role"],
    "expires_in" => $exp
]);
