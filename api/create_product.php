<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include necessary files
include_once '../config/Database.php';
include_once '../models/Product.php';

try {
    // Instantiate DB & connect to it
    $database = new Database();
    $db = $database->connect();

    // Validate and sanitize input
    $requestData = json_decode(file_get_contents('php://input'));

    if (
        !isset($requestData->type)
        || !isset($requestData->name)
        || !isset($requestData->sku)
        || !isset($requestData->price)
        || !isset($requestData->type_specific_data)
    ) {
        throw new Exception("Invalid request format");
    }

    if(strlen($requestData->name) > 255 || strlen($requestData->name) < 4) {
        throw new Exception("nameErr:Name must be more than 3 and less than 255 characters.");
    }

    if(strlen($requestData->sku) > 11 || strlen($requestData->sku) < 5) {
        throw new Exception("skuErr:SKU must be more than 4 and less than 11 characters.");
    }

    if($requestData->price == 0 || strlen($requestData->price) > 6) {
        throw new Exception("priceErr:Please enter a valid price.");
    }

    // Extract data from the request
    $sku = $requestData->sku;
    $type = $requestData->type;
    $name = $requestData->name;
    $price = $requestData->price;

    // Validate product type
    if (!in_array($type, ['DVD', 'Book', 'Furniture'])) {
        throw new Exception("Unsupported product type");
    }

    // Dynamically create the product instance based on the provided type
    $className = 'Product' . ucfirst($type); // ucfirst() makes the first letter uppercase

    if (!class_exists($className)) {
        throw new Exception("Unsupported product type");
    }

    // Convert type-specific data to an associative array
    $typeSpecificDataArray = json_decode(json_encode($requestData->type_specific_data), true);

    // Create an instance of the specified product type
    $product = new $className($db, $sku, $name, $price, $type, ...array_values($typeSpecificDataArray));

    // Call the createProduct method to insert the product into the database
    $product->createProduct();

    // Return success response
    http_response_code(201);
    echo json_encode(["message" => "Product created successfully"]);
} catch (Exception $e) {
    // Return error response
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
    return;
}
