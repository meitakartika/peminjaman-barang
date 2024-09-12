import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const User = () => {
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
    if (user && user.role !== "admin") {
      navigate("/dashboard");
    }
  }, [isError, user, navigate]);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error.response?.data?.msg || error.message);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/user/${id}`);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error.response?.data?.msg || error.message);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleEntriesChange = (event) => {
    setEntriesPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage);

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
                  <h4 style={{ color: '#243561' }}>Data User</h4>
                </div>
              </div>
            </div>
            <section className="section">
              <div className="card" style={styles.card}>
                <div className="card-header" style={styles.cardHeader}>
                  <Link to="/user/add" className='btn btn-sm btn-primary' style={styles.addButton}>
                    <i className='fa fa-plus'></i> Tambah Data
                  </Link>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <div className="d-flex justify-content-between mb-3" style={{ color: 'black' }}>
                      <div>
                        <label style={{ color: 'black' }}>
                          Search:
                          <input type="search" className="form-control d-inline mx-2" value={searchTerm} onChange={handleSearch} style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }} />
                        </label>
                      </div>
                      <div>
                        <label style={{ color: 'black' }}>
                          Show
                          <select className="form-select d-inline mx-2" value={entriesPerPage} onChange={handleEntriesChange} style={{ width: 'auto', backgroundColor: '#fff', color: 'black', borderColor: '#dee2e6' }}>
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
                          <th style={{ color: 'black' }}>Nama</th>
                          <th style={{ color: 'black' }}>Email</th>
                          <th style={{ color: 'black' }}>Role</th>
                          <th style={{ color: 'black' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedUsers.length > 0 ? (
                          paginatedUsers.map((user, index) => (
                            <tr key={user.id}>
                              <td style={{ color: 'black' }}>{(currentPage - 1) * entriesPerPage + index + 1}</td>
                              <td style={{ color: 'black' }}>{user.name}</td>
                              <td style={{ color: 'black' }}>{user.email}</td>
                              <td style={{ color: 'black' }}>{user.role}</td>
                              <td>
                                <Link to={`/user/edit/${user.id}`} className="btn btn-sm btn-primary">
                                  <i className="fa fa-edit"></i> Edit
                                </Link>
                                <button onClick={() => deleteUser(user.id)} className="btn btn-sm btn-danger ms-2">
                                  <i className="fa fa-trash"></i> Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', color: 'black' }}>No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-between" style={{ color: 'black' }}>
                      <div style={{ color: 'black' }}>Showing {paginatedUsers.length} of {filteredUsers.length} entries</div>
                      <div>
                        <button
                          className="btn btn-sm btn-outline-primary border-0"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Previous
                        </button>
                        <button
                          className="btn btn-sm btn-outline-primary border-0 ms-2"
                          onClick={() => setCurrentPage(currentPage + 1)}
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

export default User;