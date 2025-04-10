import { BrowserRouter, Routes, Route, Navigate } from "react-router";
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
import { Provider } from "react-redux"
import { APP_STORE } from "./store/store";
import { setUserData } from './store/slices/userSlice'
import { GUEST_USER_DATA_FOR_TEST, OWNER_USER_DATA_FOR_TEST } from './values/roles'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Для тестирования ролей
const CURRENT_USER = OWNER_USER_DATA_FOR_TEST; // установить данные для тестирования пользователя определенной роли здесь
APP_STORE.dispatch(setUserData(CURRENT_USER));

// Инициализация React Query
const QUERY_CLIENT = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={QUERY_CLIENT}>
      <Provider store={APP_STORE} >
        <ThemeProvider theme={APP_THEME}>
          <AppRouting />
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}

function AppRouting() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<EmptyLayout />} >
          <Route path="auth" element={<Auth />} />
          <Route path="reg" element={<Reg />} />
        </Route>

        <Route path="/" element={<RoleDependentLayout />} >
          <Route index element={<Presentation />} />
          <Route path=":menuId" element={<MenuView />} />
        </Route>

        <Route path="/o" element={<OwnerLayout />} >
          <Route index element={<Navigate to="menu" replace />} />
          <Route path="menu" element={<MenuList />} />
          <Route path="menu/new" element={<MenuCreate />} />
          <Route path="menu/:menuId/edit" element={<MenuEdit />} />
          <Route path="me" element={<Account />} />
        </Route>

        <Route path="*" element={<E404 />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
