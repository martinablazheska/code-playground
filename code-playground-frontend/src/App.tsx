import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoomContextProvider from "./contexts/roomContext";
import { NextUIProvider } from "@nextui-org/react";
import { AuthProvider } from "./contexts/authContext";
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import Home from "./pages/home/Home";
import Room from "./pages/room/Room";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/room/:id",
    element: <Room />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

function App() {
  return (
    <NextUIProvider>
      <AuthProvider>
        <RoomContextProvider>
          <RouterProvider router={router} />
        </RoomContextProvider>
      </AuthProvider>
    </NextUIProvider>
  );
}

export default App;
