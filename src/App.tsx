// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './page/home/Home'
import { Login } from './page/home/Login'
import { Register } from './page/home/Register'
import { Dashboard } from './page/panel/Dashboard'
import { ListUsers } from './page/users/ListUsers'
import { CreateQrs } from './page/qrs/CreateQrs'
import { ListQrs } from './page/qrs/ListQrs'
import { Perfil } from './page/qrs/Perfil'
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
          <Route path='/create_qrs' element={<CreateQrs />} />

          {/* <Footer /> */}
        </Routes>
      </div>
    </BrowserRouter>



  )

};

export default App
