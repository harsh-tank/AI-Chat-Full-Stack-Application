import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import HomePage from "./routes/homePage/HomePage.tsx";
import "./index.css";
import DashboardPage from "./routes/dashboardPage/DashboardPage.tsx";
import ChatPage from "./routes/chatPage/ChatPage.tsx";
import RootLayout from "./layouts/rootLayout/RootLayout.tsx";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout.tsx";
import SignInPage from "./routes/signInPage/SignInPage.tsx";
import SignUpPage from "./routes/signUpPage/SignUpPage.tsx";




const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/sign-in/*",
        element: <SignInPage />,
      },
      {
        path: "/sign-up/*",
        element: <SignUpPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    
      <RouterProvider router={router} />
    
  </StrictMode>
);
