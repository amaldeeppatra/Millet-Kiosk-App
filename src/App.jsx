import './index.css'
import LandingPage from './pages/LandingPage'
import LogInWithPhone from './pages/LogInWithPhone'
import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import LoginGoogle from './pages/LoginGoogle'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProductPage from './pages/ProductPage'


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
        },
        {
          path:"/search",
          element:[<SearchResultsPage/>]
        },
        {
          path: "/product/:prodId",
          element: <ProductPage/>
        }
      ]
    }
  ]
)


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);