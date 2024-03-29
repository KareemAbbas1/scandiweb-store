import PageHeader from '../../components/page-header/PageHeader'
import { Link, useNavigate } from 'react-router-dom'
import './addProduct.scss'
import { useState } from 'react'

const AddProduct = () => {



  const [newProduct, setNewProduct] = useState({
    sku: "",
    type: "",
    name: "",
    price: "",
    type_specific_data: {},
  });


  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, className } = e.target;

    if (className.startsWith("type_specific_data")) {
      const typeRelatedInput = document.getElementById(name);

      setNewProduct((prev) => ({
        ...prev,
        type_specific_data: {
          ...prev.type_specific_data,
          [typeRelatedInput.name]: typeRelatedInput.value
        }
      }));
    } else {
      setNewProduct((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  // Handle submit 
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    dbError: null,
    nameError: null,
    skuError: null,
    priceError: null,
    sizeError: null,
    weightError: null,
    heightError: null,
    widthError: null,
    lengthError: null,
    typeError: null,
    descriptionErr: null
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle client side validation
    if (newProduct.price < 1) {
      setErrors((prev) => ({ ...prev, priceError: "Please enter a valid price." }))
    }
    if (newProduct.type_specific_data.size && (newProduct.type_specific_data.size < 0.1 || newProduct.type_specific_data.size.length > 5)) {
      setErrors((prev) => ({ ...prev, sizeError: "Please enter a valid size." }));
      return;
    } else if (newProduct.type_specific_data.weight && (newProduct.type_specific_data.weight < 0.1 || newProduct.type_specific_data.weight.length > 5)) {
      setErrors((prev) => ({ ...prev, weightError: "Please enter a valid weight." }));
      return;
    } else if (newProduct.type_specific_data.height && (newProduct.type_specific_data.height < 0.1 || newProduct.type_specific_data.height.length > 4)) {
      setErrors((prev) => ({ ...prev, heightError: "Please enter a valid height." }));
      return;
    } else if (newProduct.type_specific_data.width && (newProduct.type_specific_data.width < 0.1 || newProduct.type_specific_data.width.length > 4)) {
      setErrors((prev) => ({ ...prev, widthError: "Please enter a valid width." }));
      return;
    } else if (newProduct.type_specific_data.length && (newProduct.type_specific_data.length < 0.1 || newProduct.type_specific_data.length.length > 4)) {
      setErrors((prev) => ({ ...prev, lengthError: "Please enter a valid length." }));
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create_product.php`, {
        method: 'post',
        body: JSON.stringify(newProduct)
      });

      if (response.status === 201) {
        navigate("/");
      } else {
        response.json()
          // Handle database/server-side validation errors
          .then((result) =>
            result.error.split(":")[2]// Duplicate SKU
              ? setErrors((prev) => ({ ...prev, dbError: result.error.split(":")[2].substring(6) }))
              : result.error.startsWith("skuErr")
                ? setErrors((prev) => ({ ...prev, skuError: result.error.split(":")[1] }))
                : result.error.startsWith("nameErr")
                  ? setErrors((prev) => ({ ...prev, nameError: result.error.split(":")[1] }))
                  : result.error.startsWith("priceErr")
                    ? setErrors((prev) => ({ ...prev, priceError: result.error.split(":")[1] }))
                    : result.error.startsWith("typeError")
                      ? setErrors((prev) => ({ ...prev, typeError: result.error.split(":")[1] }))
                      : result.error.startsWith("descriptionErr")
                        ? setErrors((prev) => ({ ...prev, descriptionErr: result.error.split(":")[1] }))
                        : ""
          )
      }

    } catch (err) {
      console.log(err)
    }
  };


  return (
    <>
      <PageHeader
        title="Add Product"
        buttons={(
          <div className='buttons-container'>
            <button onClick={(e) => handleSubmit(e)}>
              Save
            </button>

            <Link to="/">
              Cancel
            </Link>
          </div>
        )}
      />

      <form id="product_form">

        <div className='input-holder'>
          <label htmlFor='sku'>SKU: </label>
          <input
            className={`${errors.dbError || errors.skuError ? 'error' : ''}`}
            id="sku"
            type='text'
            name='sku'
            required
            onChange={(e) => {
              handleInputChange(e);
              setErrors((prev) => ({ ...prev, skuError: null }));
              setErrors((prev) => ({ ...prev, dbError: null }));
            }}
          />
          {
            errors.dbError &&
            <span className='error'>{errors.dbError}</span>
          }
          {
            errors.skuError &&
            <span className='error'>{errors.skuError}</span>
          }
        </div>

        <div className='input-holder'>
          <label htmlFor='name'>Name: </label>
          <input
            className={`${errors.nameError ? 'error' : ''}`}
            id="name"
            type='text'
            name='name'
            required
            onChange={(e) => {
              handleInputChange(e);
              setErrors((prev) => ({ ...prev, nameError: null }));
            }}
          />
          {
            errors.nameError &&
            <span className='error'>{errors.nameError}</span>
          }
        </div>

        <div className='input-holder'>
          <label htmlFor='price'>Price: </label>
          <input
            className={`${errors.priceError ? 'error' : ''}`}
            id="price"
            type="number"
            step=".01"
            name='price'
            required
            onChange={(e) => {
              handleInputChange(e);
              setErrors((prev) => ({ ...prev, priceError: null }))
            }}
          />
          {
            errors.priceError &&
            <span className='error'>{errors.priceError}</span>
          }
        </div>

        <div className='select-holder'>

          <div className='input-holder'>
            <label htmlFor='productType'><h4>Product Type: </h4></label>
            <select
              id="productType"
              name='type'
              value={newProduct.type}
              onChange={
                (e) => {
                  handleInputChange(e);
                  setNewProduct(prev => ({ ...prev, type_specific_data: {} })); // reset the type_specific_data to update the type specific details
                  setErrors((prev) => ({ ...prev, typeError: null }))
                }
              }
              required
            >
              <option value="">Choose product type</option>
              <option value="DVD" id='DVD'>DVD</option>
              <option value="Book" id='Book'>Book</option>
              <option value="Furniture" id='Furniture'>Furniture</option>
            </select>
            {
              errors.typeError &&
              <span className='error'>{errors.typeError}</span>
            }
            {
              newProduct.type &&
              <p style={{ width: '90%' }}>
                {
                  `
                  Please provide the ${newProduct.type === "Furniture"
                    ? "dimensions in HxWxL format."
                    : newProduct.type === "DVD"
                      ? "size of the DVD in MB"
                      : newProduct.type === "Book"
                        ? "weight of the book in KG"
                        : ''
                  }
                    `
                }
              </p>
            }
          </div>


          <div>
            <h4>Product Description:</h4>
            {
              !newProduct.type &&
              <p className='product-description-p'>Please choose a product type to show it's details.</p>
            }
            {
              errors.descriptionErr &&
              <span className='error'>{errors.descriptionErr}</span>
            }

            {
              newProduct.type === "DVD" && (
                // For DVD
                <div className='input-holder'>
                  <label htmlFor='size'>Size (MB): </label>
                  <input
                    className={`type_specific_data ${errors.sizeError ? 'error' : ''}`}
                    type="number"
                    step=".01"
                    name='size'
                    id='size'
                    onChange={(e) => {
                      handleInputChange(e);
                      setErrors((prev) => ({ ...prev, sizeError: null }));
                      setErrors((prev) => ({ ...prev, descriptionErr: null }));
                    }}
                    required
                  />
                  {
                    errors.sizeError &&
                    <span className='error'>{errors.sizeError}</span>
                  }
                </div>
              )
            }

            {
              newProduct.type === "Book" && (
                // For Book
                <div className='input-holder'>
                  <label htmlFor='weight'>Weight (KG): </label>
                  <input
                    className={`type_specific_data ${errors.weightError ? 'error' : ''}`}
                    type="number"
                    step=".01"
                    name='weight'
                    id='weight'
                    onChange={(e) => {
                      handleInputChange(e);
                      setErrors((prev) => ({ ...prev, weightError: null }));
                      setErrors((prev) => ({ ...prev, descriptionErr: null }));
                    }}
                    required
                  />
                  {
                    errors.weightError &&
                    <span className='error'>{errors.weightError}</span>
                  }
                </div>
              )
            }

            {
              newProduct.type === "Furniture" && (
                <div className='input-holder'>
                  <label htmlFor='height'>Height (CM): </label>
                  <input
                    className={`type_specific_data ${errors.heightError ? 'error' : ''}`}
                    type="number"
                    step=".01"
                    name='height'
                    id='height'
                    onChange={(e) => {
                      handleInputChange(e);
                      setErrors((prev) => ({ ...prev, heightError: null }));
                      setErrors((prev) => ({ ...prev, descriptionErr: null }));
                    }}
                    required
                  />
                  {
                    errors.heightError &&
                    <span className='error'>{errors.heightError}</span>
                  }

                  <label htmlFor='width'>Width (CM): </label>
                  <input
                    className={`type_specific_data ${errors.widthError ? 'error' : ''}`}
                    type="number"
                    step=".01"
                    name='width'
                    id='width'
                    onChange={(e) => {
                      handleInputChange(e);
                      setErrors((prev) => ({ ...prev, widthError: null }));
                      setErrors((prev) => ({ ...prev, descriptionErr: null }));
                    }}
                    required
                  />
                  {
                    errors.widthError &&
                    <span className='error'>{errors.widthError}</span>
                  }

                  <label htmlFor='length'>Length (CM): </label>
                  <input
                    className={`type_specific_data ${errors.lengthError ? 'error' : ''}`}
                    type="number"
                    step=".01"
                    name='length'
                    id='length'
                    onChange={(e) => {
                      handleInputChange(e);
                      setErrors((prev) => ({ ...prev, lengthError: null }));
                      setErrors((prev) => ({ ...prev, descriptionErr: null }));
                    }}
                    required
                  />
                  {
                    errors.lengthError &&
                    <span className='error'>{errors.lengthError}</span>
                  }
                </div>
              )
            }
          </div>

        </div>
      </form>
    </>
  )
}

export default AddProduct