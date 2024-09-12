import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const EditBarang = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isError, user } = useSelector(state => state.auth);
  
  const [kode, setKode] = useState("");
  const [name, setName] = useState("");
  const [stok, setStok] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [msg, setMsg] = useState("");

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
    const getBarangById = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/barang/${id}`);
            setKode(response.data.kode)
            setName(response.data.name);
            setStok(response.data.stok);
            setDeskripsi(response.data.deskripsi);
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };
    getBarangById();
}, [id]);

const updateBarang = async (e) => {
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/barang/${id}`, {
            kode: kode,
            name: name,
            stok: stok,
            deskripsi: deskripsi
        });
        navigate("/barang");
    } catch (error) {
        if (error.response) {
            setMsg(error.response.data.msg);
        }
    }
};

  const handleReset = () => {
    setKode("");
    setName("");
    setStok("");
    setDeskripsi("");
    setMsg("");
  };

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
                  <h4 style={{ color: '#243561' }}>Edit Data Barang</h4>
                </div>
              </div>
            </div>
            <section id="basic-horizontal-layouts">
              <div className="row match-height justify-content-center">
                <div className="col-md-10">
                  <div className="card" style={{ backgroundColor: '#ffff' }}>
                    <div className="card-content">
                      <div className="card-body">
                        <form className="form form-horizontal" onSubmit={updateBarang}>
                        <p style={styles.errorMessage}>{msg}</p>
                          <div className="form-body">
                            <div className="row">
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label htmlFor="kode-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Kode Barang</label>
                                  <div className="col-sm-12">
                                    <input type="number" id="kode-barang" className="form-control" name="kode" value={kode} onChange={(e) => setKode(e.target.value)} placeholder="Kode Barang" style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label htmlFor="nama-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Nama Barang</label>
                                  <div className="col-sm-12">
                                    <textarea id="nama-barang" className="form-control" name="nama" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Barang" style={{ backgroundColor: '#fff', borderColor: '#777', resize: 'none' }}></textarea>
                                  </div>
                                </div>
                                <div className="form-group row">
                                  <label htmlFor="stok" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Stok</label>
                                  <div className="col-sm-12">
                                    <input type="number" id="stok" className="form-control" name="stok" value={stok} onChange={(e) => setStok(e.target.value)} placeholder="Stok" style={{ backgroundColor: '#fff', borderColor: '#777' }} min='0'/>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="form-group row">
                                  <label htmlFor="deskripsi" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Deskripsi Kondisi Barang</label>
                                  <div className="col-sm-12">
                                    <textarea id="deskripsi" className="form-control" name="deskripsi" value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Deskripsi Kondisi Barang" rows="9" style={{ backgroundColor: '#fff', borderColor: '#777' }}></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 d-flex justify-content-end">
                                <button type="submit" className="btn btn-primary me-1 mb-1" style={{ marginTop: '15px' }}>
                                  <i className="fa-regular fa-floppy-disk" style={{ marginRight: '8px' }}></i>Update
                                </button>
                                <button type="button" className="btn btn-danger me-1 mb-1" style={{ backgroundColor: '#d93942', color: 'white', marginTop: '15px' }} onClick={handleReset}>
                                  <i className="fa-solid fa-rotate-left" style={{ marginRight: '8px' }}></i>Reset
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
  errorMessage: {
    color: 'red',
    textAlign: 'center'
},
};

export default EditBarang;