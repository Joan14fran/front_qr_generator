// App.tsx

import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Header } from './components/Header'
import { Home } from './page/Home'
import { Login } from './page/Login'
import { Register } from './page/Register'


function App() {

  return (

    <BrowserRouter>
      <Header />

      <Routes>
        <Route path='/' element={<Navigate to= '/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

      </Routes>
    </BrowserRouter>

  )

};

export default App
