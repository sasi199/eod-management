import React from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { pages } from "./routes";
import { PageNotFound } from "../components/notfound";
import { UnauthorizedAccess } from "../components/unauthorized";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";

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



export function Routers() {
  const pageRoutes = pages.map(({ title, path, element, children }) => {
    // Handle parent route with potential children
    if (children) {
      return (
        <Route key={title} path={path} element={element}>
          {children.map(({ path: childPath, element: childElement }) => (
            <Route key={childPath} path={childPath} element={childElement} />
          ))}
        </Route>
      );
    }

    // Handle route without children
    return <Route key={title} path={path} element={element} />;
  });

  return <Routes>{pageRoutes}</Routes>;
}
