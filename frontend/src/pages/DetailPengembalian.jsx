import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';
import { format } from 'date-fns';

const DetailPengembalian = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { isError, user } = useSelector((state) => state.auth);

    const [barangList, setBarangList] = useState([]);
    const [pengembalianList, setPengembalianList] = useState([]);
    const [currentPengembalian, setCurrentPengembalian] = useState(null);

    useEffect(() => {
        getBarang();
        getPengembalian();
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
        if (pengembalianList.length > 0) {
            const pengembalian = pengembalianList.find(p => p.id === parseInt(id));
            setCurrentPengembalian(pengembalian);
            console.log("Current Pengembalian:", pengembalian);
        }
    }, [pengembalianList, id]);

    const getBarangById = (barangId) => {
        console.log("Searching for Barang ID:", barangId);
        const barang = barangList.find(b => b.id === barangId);
        console.log("Found Barang:", barang);
        return barang || {};
    };

    const formatDateForInput = (dateString) => {
        // Check if the dateString is valid and in format
        if (!dateString || isNaN(new Date(dateString).getTime())) {
            return '';
        }
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Format date as yyyy-MM-dd
    };

    const getNamaBarang = () => {
        if (currentPengembalian && currentPengembalian.barang) {
            return currentPengembalian.barang.name || 'Unknown';
        }
        return 'Unknown';
    };

    const getKodeBarang = () => {
        if (currentPengembalian && currentPengembalian.barang) {
            return currentPengembalian.barang.kode || 'Unknown';
        }
        return 'Unknown';
    };

    const getBarang = async () => {
        try {
            const response = await axios.get('http://localhost:5000/barang');
            setBarangList(response.data);
            console.log("Barang List:", response.data);
        } catch (error) {
            console.error("Error fetching barang:", error.response?.data?.msg || error.message);
        }
    };

    const getPengembalian = async () => {
        try {
            const response = await axios.get('http://localhost:5000/pengembalian');
            setPengembalianList(response.data);
            console.log("Pengembalian List:", response.data);
        } catch (error) {
            console.error("Error fetching pengembalian:", error.response?.data?.msg || error.message);
        }
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
                                    <h4 style={{ color: '#243561' }}>Detail Data Pengembalian</h4>
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
                                                            {/* Data Barang Section */}
                                                            <div className="col-12 d-flex align-items-center">
                                                                <hr className="flex-grow-1" />
                                                                <h6 style={{ color: '#243561', margin: '0 15px' }}>Data Barang</h6>
                                                                <hr className="flex-grow-1" />
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group row">
                                                                    <label htmlFor="nama-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Nama Barang</label>
                                                                    <div className="col-sm-12">
                                                                        <input type="text" id="nama-barang" className="form-control" name="nama-barang" value={getNamaBarang()} readOnly placeholder="Nama Barang" style={{ backgroundColor: '#fff', borderColor: '#777' }}/>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="kode-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Kode Barang</label>
                                                                    <div className="col-sm-12">
                                                                        <input type="text" id="kode-barang" className="form-control" name="kode-barang" value={getKodeBarang()} readOnly placeholder="Kode Barang" style={{ backgroundColor: '#fff', borderColor: '#777' }}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group row">
                                                                    <label htmlFor="deskripsi" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Deskripsi Kondisi Barang Setelah Dipinjam</label>
                                                                    <div className="col-sm-12">
                                                                        <textarea id="deskripsi" className="form-control" name="deskripsi" value={currentPengembalian?.kondisi || ''} readOnly placeholder="Deskripsikan Kondisi Barang Setelah Dipinjam" rows="5" style={{ backgroundColor: '#fff', borderColor: '#777' }}></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Data Pengembalian Section */}
                                                            <div className="col-12 d-flex align-items-center mt-4">
                                                                <hr className="flex-grow-1" />
                                                                <h6 style={{ color: '#243561', margin: '0 15px' }}>Data Pengembalian</h6>
                                                                <hr className="flex-grow-1" />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="tgl-pinjam" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Tgl Pinjam</label>
                                                                    <div className="input-group">
                                                                        <input type="date" id="tgl-pinjam" className="form-control" name="tgl-pinjam" value={formatDateForInput(currentPengembalian?.tgl_pinjam)} readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                        <button type="button" className="btn btn-outline-secondary">
                                                                            <i className="fa-solid fa-calendar-days"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="tgl-kembali" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Tgl Kembali</label>
                                                                    <div className="input-group">
                                                                        <input type="date" id="tgl-kembali" className="form-control" name="tgl-kembali" value={formatDateForInput(currentPengembalian?.tgl_kembali)} readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                        <button type="button" className="btn btn-outline-secondary">
                                                                            <i className="fa-solid fa-calendar-days"></i>
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="qty" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Qty</label>
                                                                    <input type="number" id="qty" className="form-control" name="qty" value={currentPengembalian?.qty || ''} readOnly placeholder="Qty" style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                </div>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-start">
                                                                <button type="button" className="btn btn-primary me-1 mb-1" style={{ marginTop: '20px' }} onClick={() => navigate('/pengembalianAdmin')}>
                                                                    <i className="fa-solid fa-angle-left" style={{ marginRight: '8px' }}></i>Kembali</button>
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

export default DetailPengembalian;