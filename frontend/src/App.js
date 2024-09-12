import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import User from "./pages/User";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import Barang from "./pages/Barang";
import AddBarang from "./pages/AddBarang";
import EditBarang from "./pages/EditBarang";
import DetailBarang from "./pages/DetailBarang";
import Peminjaman from "./pages/Peminjaman";
import AddPeminjaman from "./pages/AddPeminjaman";
import DetailPeminjaman from "./pages/DetailPeminjaman";
import Pengembalian from "./pages/Pengembalian";
import AddPengembalian from "./pages/AddPengembalian";
import DetailPengembalian from "./pages/DetailPengembalian";
import PeminjamanAdmin from "./pages/PeminjamanAdmin";
import PengembalianAdmin from "./pages/PengembalianAdmin";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/user" element={<User />} />
          <Route path="/user/add" element={<AddUser />} />
          <Route path="/user/edit/:id" element={<EditUser />} />
          <Route path="/barang" element={<Barang />} />
          <Route path="/barang/add" element={<AddBarang />} />
          <Route path="/barang/edit/:id" element={<EditBarang />} />
          <Route path="/barang/detail/:id" element={<DetailBarang />} />
          <Route path="/peminjaman" element={<Peminjaman />} />
          <Route path="/peminjaman/add" element={<AddPeminjaman />} />
          <Route path="/peminjaman/detail/:id" element={<DetailPeminjaman />} />
          <Route path="/pengembalian" element={<Pengembalian />} />
          <Route path="/pengembalian/add" element={<AddPengembalian />} />
          <Route path="/pengembalian/detail/:id" element={<DetailPengembalian />} />
          <Route path="/peminjamanAdmin" element={<PeminjamanAdmin />} />
          <Route path="/pengembalianAdmin" element={<PengembalianAdmin />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;