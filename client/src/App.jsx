import './styles/app.scss';
import { Routes, Route } from 'react-router-dom'
import Footer from './components/footer/Footer'
import ProductsList from './pages/products-list/ProductsList'
import AddProduct from './pages/add-product/AddProduct'

function App() {

  return (
    <div className='main'>
      <div className='container'>
        <Routes>
          <Route path='/' element={<ProductsList />} />
          <Route path='/add-product' element={<AddProduct />} />
        </Routes>
      </div>

      <Footer />
    </div>
  )
}

export default App
