import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import EmptyLayout from './pages/layouts/EmptyLayout'
import RoleDependentLayout from './pages/layouts/RoleDependentLayout'
import OwnerLayout from './pages/layouts/OwnerLayout'
import MenuList from './pages/owner/MenuList'
import MenuCreate from './pages/owner/MenuCreate'
import MenuEdit from './pages/owner/MenuEdit'
import Presentation from './pages/general/Presentation'
import MenuView from './pages/general/MenuView'
import Favorite from './pages/general/Favorite'
import Auth from './pages/general/Auth'
import Reg from './pages/general/Reg'
import E404 from "./components/errors/E404";
import { ThemeProvider } from "@emotion/react";
import { APP_THEME } from "./values/theme";
import { Provider } from "react-redux"
import { APP_STORE } from "./store/store";
import { setUserData } from './store/slices/userSlice'
import { GUEST_USER_DATA_FOR_TEST, OWNER_USER_DATA_FOR_TEST } from './values/roles'

// Для тестирования ролей
const CURRENT_USER = GUEST_USER_DATA_FOR_TEST; // установить данные для тестирования пользователя определенной роли здесь
APP_STORE.dispatch(setUserData(CURRENT_USER));

function App() {
  return (
    <Provider store={APP_STORE} >
      <ThemeProvider theme={APP_THEME}>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<EmptyLayout />} >
              <Route path="auth" element={<Auth />} />
              <Route path="reg" element={<Reg />} />
            </Route>

            <Route path="/" element={<RoleDependentLayout />} >
              <Route index element={<Presentation />}/>
              <Route path=":menuId" element={<MenuView />} />
              <Route path=":menuId/favor" element={<Favorite />} />
            </Route>

            <Route path="/o" element={<OwnerLayout />} >
              <Route index element={<Navigate to="menu" replace />}/>
              <Route path="menu" element={<MenuList />} />
              <Route path="menu/new" element={<MenuCreate />} />
              <Route path="menu/:menuId/edit" element={<MenuEdit />} />
            </Route>

            <Route path="*" element={<E404 />} />

          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
