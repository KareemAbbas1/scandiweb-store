import './productsList.scss'
import { Link } from 'react-router-dom'
import PageHeader from '../../components/page-header/PageHeader'
import ProductCard from '../../components/product-card/ProductCard';
import { useEffect, useState } from 'react';
import axios from 'axios';




const ProductList = () => {

  // Handle fetch products
  const [products, setProducts] = useState();
  const [reFetch, setReFetch] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/products.php`)
        setProducts(res.data.data);
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    }

    fetchProducts();
    if (reFetch) {
      fetchProducts();
    }
  }, [reFetch]);


  // Handle mark prodcuts for mass delete
  const [productsIds, setProductsIds] = useState([]);

  const markProduct = (e, productId, productType) => {

    let newEl, newArr, elIndex;

    const productToDelete = { id: productId, type: productType };

    if (e.target.checked) {
      newEl = productToDelete;
      newArr = [...productsIds, newEl];
      setProductsIds(newArr);
    } else {
      elIndex = productsIds.map(e => e.id).indexOf(productId);

      if (elIndex > -1) {
        productsIds.splice(elIndex, 1);
        newArr = [...productsIds];
        setProductsIds(newArr);
      }
    }
  };


  // Handle Delete products
  const deleteProducts = async () => {

    if (productsIds.length > 0) {
      try {
        await Promise.all(productsIds.map(product => {
          fetch(`${import.meta.env.VITE_API_URL}/delete_product.php`, {
            method: 'delete',
            body: JSON.stringify(product)
          })
        }))
        setProductsIds([]);
        // location.reload();
        setReFetch(!reFetch);
        setTimeout(() => {
          setReFetch(false);
        }, 1000);
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("Please Choose products to delete")
    }
  }


  return (
    <>
      <PageHeader
        title="Products List"
        buttons={(
          <div className='buttons-container'>
            <Link to="/add-product">
              ADD
            </Link>
            <button onClick={deleteProducts} id="delete-product-btn">
              MASS DELETE
            </button>
          </div>
        )}
      />

      <div className='products-list'>
        {
          products && products.length > 0 ? products.map(product => (
            <ProductCard
              key={product.sku}
              product={product}
              markProduct={markProduct}
            />
          ))
            : <p style={{ textAlign: 'center' }}>No Product Found.<br /> Try Adding some products</p>
        }
      </div>
    </>
  )
}

export default ProductList