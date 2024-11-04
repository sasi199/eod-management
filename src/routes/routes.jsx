import { Login } from "../components/login";

const pages = [
  {
    title: "login",
    path: "/",
    element: <Login />,
    access: ["open"],
    layout: true,
  },
];

export default pages;
