<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type, Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Include necessary files
include_once '../config/Database.php';
include_once '../models/Product.php';



try {

    // Instantiate DB & connect to it
    $database = new Database();
    $db = $database->connect();

    // Extract data from request
    $requestData = json_decode(file_get_contents('php://input'));

    // Assuming you have information about the product type and id in the request
    $productType = $requestData->type;  // Replace with the actual key in your request
    $productId = $requestData->id;      // Replace with the actual key in your request
    
    // Dynamically create the product instance based on the provided type
    $className = 'Product' . ucfirst($productType);

    if (!class_exists($className)) {
        throw new Exception("Unsupported product type");
    }

    // Create an instance of the product class
    // You can use placeholder values for sku, name, price, and type
    // Contitionaly creating new instance of the product class because the productFurniture expects 8 params while the other two expects two only
    $product = $productType === "Furniture" ? new $className($db, '', '', 0, '', '', '', '') : new $className($db, '', '', 0, '', '');
    
    // Set the id property
    $product->id = $productId;
    // var_dump($product->deleteProduct());

    // Delete the product
    if ($product->deleteProduct($productId)) {
        echo json_encode(['message' => 'Product deleted successfully']);
    } else {
        echo json_encode(['message' => 'Product deletion failure']);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
