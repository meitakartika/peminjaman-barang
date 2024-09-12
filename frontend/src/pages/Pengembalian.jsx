import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const Pengembalian = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
    if (user && user.role !== "user") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  const [pengembalian, setPengembalian] = useState([]);
  const [filteredPengembalian, setFilteredPengembalian] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getPengembalian();
  }, []);

  useEffect(() => {
    filterData();
  }, [searchTerm, pengembalian, currentPage, entriesPerPage]);

  const getPengembalian = async () => {
    try {
      const response = await axios.get('http://localhost:5000/pengembalian');
      console.log("Pengembalian Data:", response.data);
      setPengembalian(response.data);
    } catch (error) {
      console.error("Error fetching pengembalian:", error.response?.data?.msg || error.message);
    }
  };

  const filterData = () => {
    let filtered = pengembalian.filter(item => 
      item.barang?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredPengembalian(
      filtered.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
    );
  };

  const deletePengembalian = async (pengembalianId) => {
    try {
        await axios.delete(`http://localhost:5000/pengembalian/${pengembalianId}`);
        getPengembalian();
    } catch (error) {
        console.error("Error deleting pengembalian:", error.response?.data?.msg || error.message);
    }
  };

  const totalPages = Math.ceil(pengembalian.length / entriesPerPage);

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
                  <h4 style={{ color: '#243561' }}>Data Pengembalian</h4>
                </div>
              </div>
            </div>
            <section className="section">
              <div className="card" style={styles.card}>
                <div className="card-header" style={styles.cardHeader}>
                  <Link to="/pengembalian/add" className='btn btn-sm btn-primary' style={styles.addButton}>
                    <i className='fa fa-plus'></i> Tambah Data
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="d-flex justify-content-between mb-3" style={{ color: 'black' }}>
                      <div>
                        <label style={{ color: 'black' }}>
                          Search:
                          <input 
                            type="search" 
                            className="form-control d-inline mx-2" 
                            style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </label>
                      </div>
                      <div>
                        <label style={{ color: 'black' }}>
                          Show
                          <select 
                            className="form-select d-inline mx-2" 
                            style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }}
                            value={entriesPerPage}
                            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
                    <table className="table" id="table1" style={{ borderColor: '#dee2e6' }}>
                      <thead>
                        <tr style={{ color: 'black' }}>
                          <th style={{ color: 'black' }}>No</th>
                          <th style={{ color: 'black' }}>Barang</th>
                          <th style={{ color: 'black' }}>Tgl Pinjam</th>
                          <th style={{ color: 'black' }}>Tgl Kembali</th>
                          <th style={{ color: 'black' }}>Qty</th>
                          <th style={{ color: 'black' }}>Status</th>
                          <th style={{ color: 'black' }}>
                            {filteredPengembalian.some(item => item.status === 'disetujui') ? 'Action' : ''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Jika tidak ada data tampilkan pesan "No data available" */}
                        {filteredPengembalian.length === 0 ? (
                          <tr>
                            <td colSpan="7" style={{ textAlign: 'center', color: 'black' }}>No data available</td>
                          </tr>
                        ) : (
                          filteredPengembalian.map((item, index) => (
                            <tr key={item.id}>
                              <td style={{ color: 'black' }}>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                              <td style={{ color: 'black' }}>{item.barang?.name || 'Unknown'}</td>
                              <td style={{ color: 'black' }}>{item.tgl_pinjam.split('T')[0]}</td>
                              <td style={{ color: 'black' }}>{item.tgl_kembali.split('T')[0]}</td>
                              <td style={{ color: 'black' }}>{item.qty}</td>
                              <td>
                                {/* Tampilkan badge sesuai dengan status pengembalian */}
                                <span className={`badge ${item.status === 'disetujui' ? 'bg-success' : item.status === 'ditolak' ? 'bg-danger' : 'bg-warning'}`}>
                                  {item.status === 'disetujui' ? 'disetujui' : item.status === 'ditolak' ? 'ditolak' : 'menunggu'}
                                </span>
                              </td>
                              <td>
                                {/* Tampilkan button hapus hanya jika status adalah 'disetujui' */}
                                {item.status === 'disetujui' && (
                                  <button onClick={() => deletePengembalian(item.id)} className="btn btn-sm btn-danger ms-2">
                                    <i className="fa fa-trash"></i> Hapus
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                    {/* Kontrol pagination */}
                    <div className="d-flex justify-content-between" style={{ color: 'black' }}>
                      <div style={{ color: 'black' }}>Showing {filteredPengembalian.length} of {pengembalian.length} entries</div>
                      <div>
                        <button 
                          className="btn btn-sm btn-outline-primary border-0" 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-primary border-0 ms-2" 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
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
}

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
  card: {
    backgroundColor: '#fff',
    border: 'none',
  },
  cardHeader: {
    backgroundColor: '#fff',
    borderBottom: 'none',
    marginTop: '15px',
  },
  addButton: {
    padding: '8px 16px',
    fontSize: '16px',
  },
};

export default Pengembalian;