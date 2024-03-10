// App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header'
import { Home } from './page/Home'
import { Login } from './page/Login'
import { Register } from './page/Register'
import { Dashboard } from './page/Dashboard'
import { Footer } from './components/Footer'

import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';




function App() {

  return (

    <BrowserRouter>

      <div className='container mx-auto'>

        <Routes>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/dashboard' element={<Dashboard />} />

        </Routes>

        <Footer />
      </div>
    </BrowserRouter>



  )

};

export default App
