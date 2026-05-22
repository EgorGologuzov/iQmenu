import { Route, Navigate, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router";
import EmptyLayout from './pages/layouts/EmptyLayout'
import RoleDependentLayout from './pages/layouts/RoleDependentLayout'
import OwnerLayout from './pages/layouts/OwnerLayout'
import MenuList from './pages/owner/MenuList'
import MenuCreate from './pages/owner/MenuCreate'
import MenuEdit from './pages/owner/MenuEdit'
import Presentation from './pages/general/Presentation'
import MenuView from './pages/general/MenuView'
import Auth from './pages/general/Auth'
import Reg from './pages/general/Reg'
import Account from "./pages/owner/Account";
import E404 from "./components/errors/E404";
import { ThemeProvider } from "@emotion/react";
import { APP_THEME } from "./values/theme";
import { Provider, useSelector } from "react-redux"
import { APP_STORE } from "./store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useUserRefresh } from "./hooks/useUserRefresh";
import { SnackbarProvider } from 'notistack';
import OrderList from "./pages/owner/OrderList";
import { ROLES } from "./values/roles";

// Инициализация React Query
const QUERY_CLIENT = new QueryClient();

function App() {
  return (
    <AppWrappers>
      <AppOnLoad>
        <AppRouting />
      </AppOnLoad>
    </AppWrappers>
  );
}

function AppOnLoad({ children }) {
  useUserRefresh();
  return children;
}

function AppWrappers({ children }) {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <Provider store={APP_STORE} >
        <ThemeProvider theme={APP_THEME}>
          <SnackbarProvider style={{ fontFamily: APP_THEME.typography.fontFamily, fontSize: APP_THEME.typography.body1.fontSize, }}>
            { children }
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

function AppRouting() {

  const user = useSelector(state => state.user);
  const isOwner = user?.role === ROLES.OWNER.NAME;

  return <RouterProvider router={createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/o" element={<OwnerLayout />} >
        <Route index element={<Navigate to="menu" replace />} />
        <Route path="menu" element={<MenuList />} />
        <Route path="menu/new" element={<MenuCreate />} />
        <Route path="menu/:menuId/edit" element={<MenuEdit />} />
        <Route path="me" element={<Account />} />
        <Route path="order" element={<OrderList />} />
      </Route>

      <Route path="/" element={<RoleDependentLayout />} >
        <Route index element={<Navigate to={isOwner ? "o/menu" : "presentation"} replace />} />
        <Route path="presentation" element={<Presentation />} />
        <Route path=":menuId" element={<MenuView />} />
      </Route>

      <Route path="/" element={<EmptyLayout />} >
        <Route path="auth" element={<Auth />} />
        <Route path="reg" element={<Reg />} />
      </Route>

      <Route path="*" element={<E404 />} />
    </>
  ))} />
}

export default App;
