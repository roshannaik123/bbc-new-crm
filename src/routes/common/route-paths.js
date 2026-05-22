export const isAuthRoute = (path) => {
    return ["/", "/login", "/forgot-password", "/signup","/maintenance"].includes(path);
  };