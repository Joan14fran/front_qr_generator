// App.tsx

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './page/home/Home'
import { Login } from './page/home/Login'
import { Register } from './page/home/Register'
import { Dashboard } from './page/Dashboard'
import { ListUsers } from './page/ListUsers'
import { ListQrs } from './page/ListQrs'
import { Perfil } from './page/Perfil'

import { Footer } from './components/Footer'

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
          <Route path='/usuarios' element={<ListUsers />} />
          <Route path='/qrs' element={<ListQrs />} />
          <Route path='/perfil' element={<Perfil />} />

          {/* <Footer /> */}
        </Routes>
      </div>
    </BrowserRouter>



  )

};

export default App
