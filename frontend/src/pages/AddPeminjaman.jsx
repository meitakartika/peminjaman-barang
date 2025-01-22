import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SelectPeminjaman from '../components/SelectPeminjaman';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

function AddPeminjaman() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate("/");
        }
    }, [isError, navigate]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [tglPinjam, setTglPinjam] = useState("");
    const [tglKembali, setTglKembali] = useState("");
    const [qty, setQty] = useState("");
    const [msg, setMsg] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSelectItem = (item) => {
        setSelectedItem(item);
        closeModal(); 
    };

    const resetForm = () => {
        setTglPinjam("");
        setTglKembali("");
        setQty("");
        setMsg("");
        setSelectedItem(null);
    };

    const savePeminjaman = async (e) => {
        e.preventDefault(); 
    
        if (!selectedItem || !selectedItem.id) {
            setMsg("Please select a valid item.");
            return;
        }
    
        if (!tglPinjam || !tglKembali || !qty) {
            setMsg("Please fill all the fields.");
            return;
        }
    
        const data = {
            barangId: selectedItem.id,
            tglPinjam,
            tglKembali,
            qty
        };
    
        console.log("Saving peminjaman with data:", data);
        try {
            const response = await axios.post('http://localhost:5000/peminjaman', data);
            console.log("Peminjaman saved:", response.data);
            resetForm(); 
            navigate('/peminjaman');
        } catch (error) {
            console.error("Error saving peminjaman:", error.response?.data?.msg || error.message);
            setMsg("Error saving peminjaman.");
        }
    };

    const handleQtyChange = (e) => {
        const value = e.target.value;
        if (selectedItem && value > selectedItem.stok) {
            setMsg(`Qty cannot be greater than the available stock (${selectedItem.stok}).`);
        } else if (value <= 0) {
            setMsg("Qty must be greater than or equal to 1.");
        } else {
            setMsg("");
        }
        setQty(value);
    };

    return (
        <div id="app" style={styles.appContainer}>
            <Navbar />
            <Sidebar />
            <div id="main" className="layout-navbar navbar-fixed" style={styles.mainContent}>
                <div id="main-content">
                    <div className="page-heading" style={{ paddingTop: '40px' }}>
                        <div className="page-title" style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <div className="row">
                                <div className="col-12">
                                    <h4 style={{ color: '#243561' }}>Tambah Data Peminjaman</h4>
                                </div>
                            </div>
                        </div>
                        <section id="basic-horizontal-layouts">
                            <div className="row match-height justify-content-center">
                                <div className="col-md-10">
                                    <div className="card" style={{ backgroundColor: '#ffff' }}>
                                        <div className="card-content">
                                            <div className="card-body">
                                                <form onSubmit={savePeminjaman} className="form form-horizontal">
                                                    <p className="has-text-centered text-danger">{msg}</p>
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
                                                                        <div className="input-group">
                                                                            <input type="text" id="nama-barang" className="form-control" value={selectedItem ? selectedItem.name : ''} placeholder="Nama Barang" readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                            <button type="button" className="btn btn-primary" onClick={openModal}>
                                                                                <i className="fa-solid fa-search"></i> Search
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="kode-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Kode Barang</label>
                                                                    <div className="col-sm-12">
                                                                        <input type="text" id="kode-barang" className="form-control" value={selectedItem ? selectedItem.kode : ''} placeholder="Kode Barang" readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="stok" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Stok</label>
                                                                    <div className="col-sm-12">
                                                                        <input type="text" id="stok" className="form-control" value={selectedItem ? selectedItem.stok : ''} placeholder="Stok" readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group row">
                                                                    <label htmlFor="deskripsi" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Deskripsi Kondisi Barang</label>
                                                                    <div className="col-sm-12">
                                                                        <textarea id="deskripsi" className="form-control" placeholder="Deskripsi Kondisi Barang" rows="9" readOnly value={selectedItem ? selectedItem.deskripsi : ''} style={{ backgroundColor: '#fff', borderColor: '#777' }}></textarea>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Data Peminjaman Section */}
                                                            <div className="col-12 d-flex align-items-center mt-4">
                                                                <hr className="flex-grow-1" />
                                                                <h6 style={{ color: '#243561', margin: '0 15px' }}>Data Peminjaman</h6>
                                                                <hr className="flex-grow-1" />
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="tgl-pinjam" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Tgl Pinjam</label>
                                                                    <div className="input-group">
                                                                        <input type="date" id="tgl-pinjam" className="form-control" value={tglPinjam} onChange={(e) => setTglPinjam(e.target.value)} style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="tgl-kembali" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Tgl Kembali</label>
                                                                    <div className="input-group">
                                                                        <input type="date" id="tgl-kembali" className="form-control" value={tglKembali} onChange={(e) => setTglKembali(e.target.value)} style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="qty" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Qty</label>
                                                                    <input
                                                                        type="number"
                                                                        id="qty"
                                                                        className="form-control"
                                                                        value={qty}
                                                                        onChange={handleQtyChange}
                                                                        placeholder="Qty"
                                                                        min="1"
                                                                        style={{ backgroundColor: '#fff', borderColor: '#777' }}
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="col-12 d-flex justify-content-end mt-4">
                                                                <button type="submit" className="btn btn-primary me-1 mb-1" disabled={!selectedItem}>
                                                                    <i className="fa-regular fa-floppy-disk" style={{ marginRight: '8px' }}></i>Simpan
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger me-1 mb-1"
                                                                    style={{ backgroundColor: '#d93942', color: 'white' }}
                                                                    onClick={resetForm}
                                                                >
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
            {/* Modal SelectPeminjaman */}
            {isModalOpen && <SelectPeminjaman isOpen={isModalOpen} onClose={closeModal} onSelectItem={handleSelectItem} />}
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

export default AddPeminjaman;