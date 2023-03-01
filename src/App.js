import React, { useContext } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './SignIn';
import Todo from './Todo';
import SignUp from './SignUp';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { currentUser } = useContext(AuthContext)


  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />
  }

  const RequireNoAuth = ({ children }) => {
    return currentUser ? <Navigate to="/Todo" /> : children
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RequireNoAuth><SignIn /></RequireNoAuth>} />
          <Route path="/signup" element={<RequireNoAuth><SignUp /></RequireNoAuth>} />
          <Route path="/todo" element={<RequireAuth><Todo /></RequireAuth>} />
        </Routes>
      </BrowserRouter>


    </div>
  )
}
