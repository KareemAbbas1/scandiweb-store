<?php

/**
 * Abstract class representing a product with common properties and methods.
 */
abstract class Product
{
    /** @var PDO Database connection. */
    private $conn;

    /** @var string Name of the database table. */
    private $table = 'products';

    /** @var string id. */
    private $id;

    /** @var string Stock Keeping Unit. */
    protected $sku;

    /** @var string Name of the product. */
    protected $name;

    /** @var float Price of the product. */
    protected $price;

    /** @var string Type of the product (enum: book, dvd, furniture). */
    protected $type;

    /**
     * Constructor to initialize common properties.
     *
     * @param PDO    $db   Database connection.
     * @param string $sku  Stock Keeping Unit.
     * @param string $name Name of the product.
     * @param float  $price Price of the product.
     * @param string $type Type of the product.
     */
    public function __construct($db, $sku, $name, $price, $type)
    {
        $this->conn = $db;
        $this->sku = $sku;
        $this->name = $name;
        $this->price = $price;
        $this->type = $type;
    }


    /**
     * Get all products of a specific type.
     *
     * @param string $type Type of the products to retrieve.
     *
     * @return PDOStatement Executed statement.
     */
    public function getAllProducts($type)
    {
        $query = "SELECT * FROM $this->table WHERE type = '$type'";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }


    /**
     * Create a product record in the database.
     *
     * @return PDOStatement Executed statement.
     */
    public function createProduct()
    {
        $query = 'INSERT INTO products SET sku = :sku, name = :name, price = :price, type = :type, details = :details';

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name)); // htmlspecialchars: a sanitization method to ensure that only palin text will be inserted in these fields in order to avoid SQL injection to the database
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->sku = htmlspecialchars(strip_tags($this->sku));

        $details = $this->getDetails(); // Call the abstract method to get details

        // Bind params(Binds Binds variables to a prepared statement as parameters)
        $stmt->bindParam(':sku', $this->sku);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':type', $this->type);
        $stmt->bindParam(':details', $details, PDO::PARAM_STR);

        $stmt->execute();

        return $stmt;
    }


    /**
     * Delete product
     */
    public function deleteProduct($id) {
        $query = "DELETE FROM products WHERE id = $id"; // Here we're using PDO named params(:id)

        // Prepare statement
        $stmt = $this->conn->prepare($query);

        // Sanitize id
        $id = htmlspecialchars(strip_tags($id));

        // Excute
        if($stmt->execute()) {
            return $id;
        }

        // Error handling
        printf("Error: %s.\n", $stmt->errorInfo());

        return false;
    }


    /**
     * Abstract method to be implemented by child classes to provide product details.
     *
     * @return string JSON-encoded product details.
     */
    abstract protected function getDetails();
}

/**
 * Class representing a product of type DVD, extending the abstract Product class.
 */
class ProductDVD extends Product
{
    /** @var string Size of the DVD in MB. */
    private $size;

    /**
     * Constructor to initialize common properties and set the DVD-specific property.
     *
     * @param PDO    $db   Database connection.
     * @param string $sku  Stock Keeping Unit.
     * @param string $name Name of the DVD.
     * @param float  $price Price of the DVD.
     * @param string $type Type of the DVD.
     * @param string $size Size of the DVD.
     */
    public function __construct($db, $sku, $name, $price, $type, $size)
    {
        parent::__construct($db, $sku, $name, $price, $type);
        $this->size = $size;
    }

    /**
     * Get DVD-specific details as a JSON-encoded string.
     *
     * @return string JSON-encoded details.
     */
    protected function getDetails()
    {
        $detailsArray = ['size' => $this->size];
        return json_encode($detailsArray);
    }
}

/**
 * Class representing a product of type Book, extending the abstract Product class.
 */
class ProductBook extends Product
{
    /** @var string Weight of the book in Kg. */
    private $weight;

    /**
     * Constructor to initialize common properties and set the Book-specific property.
     *
     * @param PDO    $db     Database connection.
     * @param string $sku    Stock Keeping Unit.
     * @param string $name   Name of the book.
     * @param float  $price  Price of the book.
     * @param string $type   Type of the book.
     * @param string $weight Weight of the book.
     */
    public function __construct($db, $sku, $name, $price, $type, $weight)
    {
        parent::__construct($db, $sku, $name, $price, $type);
        $this->weight = $weight;
    }

    /**
     * Get Book-specific details as a JSON-encoded string.
     *
     * @return string JSON-encoded details.
     */
    protected function getDetails()
    {
        $detailsArray = ['weight' => $this->weight];
        return json_encode($detailsArray);
    }
}

/**
 * Class representing a product of type Furniture, extending the abstract Product class.
 */
class ProductFurniture extends Product
{
    /** @var string Dimensions of the furniture (height, width, length). */
    private $height;
    private $width;
    private $length;

    /**
     * Constructor to initialize common properties and set the Furniture-specific property.
     *
     * @param PDO    $db     Database connection.
     * @param string $sku    Stock Keeping Unit.
     * @param string $name   Name of the furniture.
     * @param float  $price  Price of the furniture.
     * @param string $type   Type of the furniture.
     * @param string $height Height of the furniture.
     * @param string $width  Width of the furniture.
     * @param string $length Length of the furniture.
     */
    public function __construct($db, $sku, $name, $price, $type, $height, $width, $length)
    {
        parent::__construct($db, $sku, $name, $price, $type);
        $this->height = $height;
        $this->width = $width;
        $this->length = $length;
    }

    /**
     * Get Furniture-specific details as a JSON-encoded string.
     *
     * @return string JSON-encoded details.
     */
    protected function getDetails()
    {
        $detailsArray = ['height' => $this->height, 'width' => $this->width, 'length' => $this->length];
        return json_encode($detailsArray);
    }
}
