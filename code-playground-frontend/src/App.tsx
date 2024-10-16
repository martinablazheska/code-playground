import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RoomContextProvider from "./contexts/roomContext";
import { NextUIProvider } from "@nextui-org/react";
import Home from "./pages/Home";
import Room from "./pages/Room/Room";
import RoomFallback from "./pages/Room/RoomFallback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "room/:id",
    element: <Room />,
    errorElement: <RoomFallback />,
  },
]);

function App() {
  return (
    <NextUIProvider>
      <RoomContextProvider>
        <RouterProvider router={router} />
      </RoomContextProvider>
    </NextUIProvider>
  );
}

export default App;
