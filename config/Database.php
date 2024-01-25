<?php 
    class Database {
        // DB Params
        private $host = 'localhost';
        private $db_name = 'u689804512_scandiwebStore';// Prod name=u689804512_scandiwebStore
        private $username = 'u689804512_kareem'; // Prod user=u689804512_kareem
        private $password = 'KyNQTpw2D|';// Prod pass=KyNQTpw2D|
        private $conn;


        // DB Connect
        public function connect() {
            $this->conn = null;

            try{
                // Set DSN
                $dsn = "mysql:host=$this->host;dbname=$this->db_name";
                
                // Create a PDO instance
                $this->conn = new PDO($dsn, $this->username, $this->password);

                // Set the error mode
                $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                echo 'Database Connected';
            } catch(PDOException $e) {
                echo 'Connection Error: ' . $e->getMessage();
            }

            // Retrun the connection
            return $this->conn;
        }
    }