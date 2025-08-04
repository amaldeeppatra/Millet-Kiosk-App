import './index.css'
import LandingPage from './pages/LandingPage'
// import LogInWithPhone from './pages/LogInWithPhone'
import { createBrowserRouter,Outlet,RouterProvider } from 'react-router-dom'
import ReactDOM from 'react-dom/client'
import LoginGoogle from './pages/LoginGoogle'
import HomePage from './pages/HomePage'
import SearchResultsPage from './pages/SearchResultsPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import ProtectedRoute from './utils/ProtectedRoute'
import ProductsByCat from './pages/ProductsByCat'
import OrderSuccess from './pages/OrderSuccess'
import MyProfile from './pages/MyProfile'
import ViewOrders from './pages/ViewOrders'
import OrderDetails from './pages/OrderDetails'
import ErrorPage from './pages/ErrorPage'


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
        // {
        //   path:"/login-phone",
        //   element:[<LogInWithPhone/>]
        // },
        {
          path:"/homepage",
          element:(
              <HomePage />
          )
        },
        {
          path:"/search",
          element:(
              <SearchResultsPage />
          )
        },
        {
          path: "/product/:prodId",
          element: (
              <ProductPage />
          )
        },
        {
          path: "/cart",
          element: (
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          )
        },
        {
          path: "/categories",
          element: (
            <ProductsByCat/>
          )
        },
        {
          path: "/order-success",
          element: (
            <OrderSuccess/>
          )
        },
        {
          path: "/profile",
          element: (
            <MyProfile/>
          )
        },
        {
          path: "/orders",
          element: (
            <ViewOrders/>
          )
        },
        {
          path: "/order/:orderId",
          element: (
            <OrderDetails/>
          )
        },
        {
          path: "*",
          element: <ErrorPage/>
        }
      ]
    }
  ]
)


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter} />);