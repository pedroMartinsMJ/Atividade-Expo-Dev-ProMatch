import { createBrowserRouter } from "react-router";
import { Discovery } from "./components/Discovery";
import { Search } from "./components/Search";
import { Profile } from "./components/Profile";
import { MatchHub } from "./components/MatchHub";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Discovery },
      { path: "search", Component: Search },
      { path: "profile/:id", Component: Profile },
      { path: "matches", Component: MatchHub },
    ],
  },
]);
