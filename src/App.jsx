import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import LandingPage from './pages/LandingPage'
import LogInWithPhone from './pages/LogInWithPhone'
import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import LoginGoogle from './pages/LoginGoogle'
import HomePage from './pages/HomePage'


const App=()=>{
  return(
      <>
      <Outlet />
      </>
     
  )
}

const appRouter = createBrowserRouter(
  [
    {
      path:"/",
      element:<App/>,
      children:[
        {
          path:"/",
          element:[<LandingPage/>]
        },
        {
          path:"/login",
          element:[<LoginGoogle/>]
        },
        {
          path:"/login-phone",
          element:[<LogInWithPhone/>]
        },
        {
          path:"/homepage",
          element:[<HomePage/>]
        }
      ]
    }
  ]
)


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);