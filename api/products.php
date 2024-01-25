<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/Database.php';
include_once '../models/Product.php';

try {
    // Instantiate DB & connect to it
    $database = new Database();
    $db = $database->connect();

    // Create instances of concrete product classes to use their methods
    $productDVD = new ProductDVD($db, '', '', 0, 0, '');
    $productBook = new ProductBook($db, '', '', 0, 0, '');
    $productFurniture = new ProductFurniture($db, '', '', 0, '', '', '', '');

    // Use the getAllProducts method from each concrete product class
    $productsDVD = $productDVD->getAllProducts('DVD');
    $productsBook = $productBook->getAllProducts('Book');
    $productsFurniture = $productFurniture->getAllProducts('Furniture');

    // Combine data from all product types
    $products = array_merge($productsDVD->fetchAll(PDO::FETCH_ASSOC), $productsBook->fetchAll(PDO::FETCH_ASSOC), $productsFurniture->fetchAll(PDO::FETCH_ASSOC));

    // Check if no products were found
    if (empty($products)) {
        echo json_encode(['success' => true, 'message' => 'No products found.']);
    } else {
        // Return JSON response with products
        echo json_encode(['success' => true, 'data' => $products]);
    }
} catch (Exception $e) {
    // Handle exceptions gracefully
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}









// Instanciate product object
// $product = new Product($db);


// // Product Query
// $result = $product->getAllProducts();

// // Get row count
// $num = $result->rowCount();

// // Check if any products
// if($num > 0) {
//     // Products arrya
//     $products_arr = array();
//     $products_arr['data'] = array();

//     while($row = $result->fetch(PDO::FETCH_ASSOC)) {
//         extract($row);

//         $product_item = array(
//             'sku' => $sku,
//             'name' => $name,
//             'price' => $price,
//             'type' => $type,
//         );


//         // Push to "data"
//         array_push($products_arr['data'], $product_item);
//     }


//     // Turn to json
//     echo json_encode($products_arr);

// }else {
//     // No products to display
//     echo json_encode(
//         array('message' => 'No Products Found')
//     );
// }