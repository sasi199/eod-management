import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import routePages from "./routes";
import PageNotFound from "../common/PageNotFound";
import UnauthorizedAccess from "../common/UnauthorizedAccess";
import Navbar from "../common/Navbar";
import Topbar from "../common/Topbar";
import Footer from "../common/Footer";

const isAllowed = (access = []) => {
  const token = localStorage.getItem("userToken");
  return token || access.includes("open");
};

const createRoute = (key, path, element, nestedRouteElements, layout) => {
  return (
    <Route key={key} path={path} element={element}>
      {nestedRouteElements}
    </Route>
  );
};

const renderNestedRoutes = (nestedRoutesArray = []) => {
  return nestedRoutesArray.map((route) => {
    const { access, element, path, nestedRoutes, layout } = route;
    const nestedRouteElements = nestedRoutes
      ? renderNestedRoutes(nestedRoutes)
      : null;
    const key = path;

    return createRoute(
      key,
      path,
      isAllowed(access) ? element : <UnauthorizedAccess />,
      nestedRouteElements,
      layout
    );
  });
};

const renderRoutes = (routesArray = []) => {
  return routesArray.map((route) => {
    const { access, element, path, nestedRoutes, layout } = route;
    const nestedRouteElements = nestedRoutes
      ? renderNestedRoutes(nestedRoutes)
      : null;
    const key = path;

    return createRoute(
      key,
      path,
      isAllowed(access) ? element : <UnauthorizedAccess />,
      nestedRouteElements,
      layout
    );
  });
};

const Routers = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const currentRoute = routePages.find((route) => route.path === location.pathname);


  const showLayout = currentRoute?.layout !== false;

  return (
    <article>
      {/* {showLayout && <Topbar />} */}
      {showLayout && <Navbar />}
      <Routes>
        {renderRoutes(routePages)}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      {showLayout && <Footer />}
    </article>
  );
};

export default Routers;
