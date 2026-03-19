import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Home } from "./screens/home";
import { Map } from "./screens/map";
import { Earnings } from "./screens/earnings";
import { Alerts } from "./screens/alerts";
import { Profile } from "./screens/profile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "map", Component: Map },
      { path: "earnings", Component: Earnings },
      { path: "alerts", Component: Alerts },
      { path: "profile", Component: Profile },
    ],
  },
]);
