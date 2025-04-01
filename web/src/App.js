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

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<EmptyLayout />} >
          <Route path="auth" element={<Auth />} />
          <Route path="reg" element={<Reg />} />
        </Route>

        <Route path="/" element={<RoleDependentLayout />} >
          <Route index element={<Presentation />}/>
          <Route path=":id" element={<MenuView />} />
          <Route path=":id/favor" element={<Favorite />} />
        </Route>

        <Route path="/o" element={<OwnerLayout />} >
          <Route index element={<Navigate to="menu" replace />}/>
          <Route path="menu" element={<MenuList />} />
          <Route path="menu/new" element={<MenuCreate />} />
          <Route path="menu/:id/edit" element={<MenuEdit />} />
        </Route>

        <Route path="*" element={<E404 />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
