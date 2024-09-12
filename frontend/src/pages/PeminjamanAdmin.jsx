import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const PeminjamanAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  const [peminjaman, setPeminjaman] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/peminjaman');
        console.log("Peminjaman data:", response.data); 
        setPeminjaman(response.data);
      } catch (error) {
        console.error("Error fetching data:", error.response?.data?.msg || error.message);
      }
    };
  
    fetchData();
  }, []);  

  const updatePeminjamanStatus = async (peminjamanId, status) => {
    try {
      const response = await axios.patch(`http://localhost:5000/peminjaman/${peminjamanId}/status`, { status });
      if (response.status === 200) {
        const updatedPeminjaman = await axios.get('http://localhost:5000/peminjaman');
        setPeminjaman(updatedPeminjaman.data);
      }
    } catch (error) {
      console.error("Error updating peminjaman status:", error.response?.data?.msg || error.message);
    }
  };

  const filteredPeminjaman = peminjaman.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.status !== 'dikembalikan' && // Filter data dengan status 'dikembalikan'
      (item.user.name.toLowerCase().includes(searchLower) ||
       item.barang.name.toLowerCase().includes(searchLower))
    );
  });

  const paginatedPeminjaman = filteredPeminjaman.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredPeminjaman.length / itemsPerPage);

  return (
    <div id="app" style={styles.appContainer}>
      <Navbar />
      <Sidebar />
      <div id="main" className="layout-navbar navbar-fixed" style={styles.mainContent}>
        <div id="main-content">
          <div className="page-heading">
            <div className="page-title" style={{ marginBottom: '20px' }}>
              <div className="row">
                <div className="col-12 col-md-6 order-md-1 order-last">
                  <h4 style={{ color: '#243561' }}>Data Peminjaman</h4>
                </div>
              </div>
            </div>
            <section className="section">
              <div className="card" style={{ backgroundColor: '#fff' }}>
                <div className="card-body">
                <div className="d-flex justify-content-between mb-3" style={{ color: 'black' }}>
                    <div>
                      <label style={{ color: 'black' }}>
                        Search:
                        <input
                          type="search"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          className="form-control d-inline mx-2"
                          style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }}
                        />
                      </label>
                    </div>
                    <div>
                      <label style={{ color: 'black' }}>
                        Show
                        <select
                          className="form-select d-inline mx-2"
                          value={itemsPerPage}
                          onChange={handleItemsPerPageChange}
                          style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }}
                        >
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                        entries
                      </label>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table" id="table1" style={{ borderColor: '#dee2e6' }}>
                      <thead>
                        <tr style={{ color: 'black' }}>
                          <th>No</th>
                          <th>User</th>
                          <th>Barang</th>
                          <th>Tgl Pinjam</th>
                          <th>Tgl Kembali</th>
                          <th>Qty</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                      {paginatedPeminjaman.length > 0 ? (
                        paginatedPeminjaman.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td style={{ color: 'black' }}>{item.user.name}</td>
                            <td style={{ color: 'black' }}>{item.barang.name}</td>
                            <td>{item.tglPinjam.split('T')[0]}</td>
                            <td>{item.tglKembali.split('T')[0]}</td>
                            <td>{item.qty}</td>
                            <td>
                              <span className={`badge ${item.status === 'disetujui' ? 'bg-success' : item.status === 'ditolak' ? 'bg-danger' : item.status === 'dikembalikan' ? 'bg-primary' : 'bg-warning'}`}>
                                {item.status === 'disetujui' ? 'disetujui' : item.status === 'ditolak' ? 'ditolak' : item.status === 'dikembalikan' ? 'dikembalikan' :'menunggu'}
                              </span>
                            </td>
                            <td>
                              <div className="dropdown">
                                <button className="btn btn-primary dropdown-toggle" type="button" id={`dropdownMenuButton${item.id}`} data-bs-toggle="dropdown" aria-expanded="false">
                                  Action
                                </button>
                                <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton${item.id}`} style={{ backgroundColor: '#fff', color: '#000' }}>
                                  <Link className="dropdown-item" to={`/peminjaman/detail/${item.id}`} style={{ color: '#000', backgroundColor: 'transparent' }}>
                                    <i className="fa-solid fa-bars"></i> Detail Data
                                  </Link>
                                  <li>
                                    <a 
                                      className="dropdown-item" 
                                      href="#" 
                                      style={{ color: '#000', backgroundColor: 'transparent' }} 
                                      onClick={() => updatePeminjamanStatus(item.id, 'disetujui')}
                                    >
                                      <i className="fa-regular fa-thumbs-up"></i> Setujui Peminjaman
                                    </a>
                                  </li>
                                  <li>
                                    <a 
                                      className="dropdown-item" 
                                      href="#" 
                                      style={{ color: '#000', backgroundColor: 'transparent' }} 
                                      onClick={() => updatePeminjamanStatus(item.id, 'ditolak')}
                                    >
                                      <i className="fa-regular fa-thumbs-down"></i> Tolak Peminjaman
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', color: 'black' }}>No data available</td>
                        </tr>
                      )}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between" style={{ color: 'black' }}>
                    <div>Showing {paginatedPeminjaman.length} of {filteredPeminjaman.length} entries</div>
                      <div>
                        <button className="btn btn-sm btn-outline-primary border-0" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}>Previous</button>
                        <button className="btn btn-sm btn-outline-primary border-0 ms-2" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}>Next</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: 'flex',
    height: '100vh',
  },
  mainContent: {
    flex: 1,
    padding: '20px',
    backgroundColor: '#f1f8ff',
    marginLeft: '250px',
    marginTop: '80px',
  },
};

export default PeminjamanAdmin;