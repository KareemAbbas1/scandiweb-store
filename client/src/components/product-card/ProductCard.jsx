import "./productCard.scss"


const ProductCard = ({ product, markProduct }) => {


    // Handel details object
    const productDetails = JSON.parse(product.details);

    return (
        <div className="card">
            <input
                type="checkbox"
                id={product.id}
                onChange={(e) => markProduct(e, product.id, product.type)}
                className="delete-checkbox"
            />

            <p>{product.sku}</p>

            <p>{product.name}</p>

            <p>${product.price}</p>

            <p>
                {
                    product.type === "Furniture"
                        ? `Dimensions = ${Object.values(productDetails).toString().split(",").join("x")}`
                        : `${Object.keys(productDetails)} = ${Object.values(productDetails)} ${product.type === "Book" ? "KG" : "MB"}`
                }
            </p>
        </div>
    )
}

export default ProductCard