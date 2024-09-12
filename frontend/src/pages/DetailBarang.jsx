import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const DetailBarang = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); 
  const { isError, user } = useSelector(state => state.auth);
  
  const [barang, setBarang] = useState(null);

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
    const fetchBarang = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/barang/${id}`);
        setBarang(response.data);
      } catch (error) {
        console.error("Error fetching barang:", error.response?.data?.msg || error.message);
      }
    };

    fetchBarang();
  }, [id]);

  if (!barang) return <p>Loading...</p>;

  return (
    <div id="app" style={styles.appContainer}>
      <Navbar />
      <Sidebar />
      <div id="main" className="layout-navbar navbar-fixed" style={styles.mainContent}>
        <div id="main-content">
          <div className="page-heading" style={{ paddingTop: '60px' }}>
            <div className="page-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
              <div className="row">
                <div className="col-12">
                  <h4 style={{ color: '#243561' }}>Detail Data Barang</h4>
                </div>
              </div>
            </div>
            <section id="basic-horizontal-layouts">
              <div className="row match-height justify-content-center">
                <div className="col-md-10">
                  <div className="card" style={{ backgroundColor: '#ffff' }}>
                    <div className="card-content">
                      <div className="card-body">
                        <form className="form form-horizontal">
                          <div className="form-body">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label htmlFor="kode-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Kode Barang</label>
                                  <div className="col-sm-12">
                                    <input type="text" id="kode-barang" className="form-control" name="kode-barang" value={barang.kode} readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label htmlFor="nama-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Nama Barang</label>
                                  <div className="col-sm-12">
                                    <textarea id="nama-barang" className="form-control" name="nama-barang" value={barang.name} readOnly style={{ backgroundColor: '#fff', borderColor: '#777', resize: 'none' }}></textarea>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label htmlFor="stok" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Stok</label>
                                  <div className="col-sm-12">
                                    <input type="text" id="stok" className="form-control" name="stok" value={barang.stok} readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label htmlFor="deskripsi" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Deskripsi Kondisi Barang</label>
                                  <div className="col-sm-12">
                                    <textarea id="deskripsi" className="form-control" name="deskripsi" value={barang.deskripsi} readOnly rows="9" style={{ backgroundColor: '#fff', borderColor: '#777' }}></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 d-flex justify-content-start">
                                <button type="button" className="btn btn-primary me-1 mb-1" style={{ marginTop: '20px' }} onClick={() => navigate('/barang')}>
                                  <i className="fa-solid fa-angle-left" style={{ marginRight: '8px' }}></i>Kembali
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
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
};

export default DetailBarang;