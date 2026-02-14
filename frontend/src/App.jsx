import React from 'react'
import { createBrowserRouter,RouterProvider } from "react-router-dom"
import Login from './pages/login'
import Home from './pages/Home'
import Register from './pages/Register'
import Requests from './pages/Requests'
import Friends from './pages/Friends'
import BlockedUsers from './pages/Blockuser'
import Notifications from './pages/Notification'
import Chat from './pages/Chat'
const App = () => {
  const router = createBrowserRouter([
    {
      path:"/",
      element:<Login/>
    },
    {
      path:"/register",
      element:<Register/>
    },
    {
      path:"/home",
      element:<Home/>
    },
    {
      path:"/requests",
      element:<Requests/>
    },
    {
      path:"/friend",
      element:<Friends/>
    },
    {
      path:"/block-user",
      element:<BlockedUsers/>
    },
    {
      path:"/notification",
      element:<Notifications/>
    },
    {
      path:"/chat/:friendId",
      element:<Chat/>
    },
  ])
  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}

export default App