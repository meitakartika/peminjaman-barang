import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SelectPengembalian from '../components/SelectPengembalian';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';
import { format, parse, isValid } from 'date-fns';

function AddPengembalian() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError } = useSelector(state => state.auth);

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
    const [kondisi, setKondisi] = useState("");
    const [msg, setMsg] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleSelectItem = (item) => {
        console.log('Selected item:', item);
        setSelectedItem(item);
        setQty(item.qty); 
        const pinjamDate = new Date(item.tglPinjam);
        const kembaliDate = new Date(item.tglKembali);
        setTglPinjam(isValid(pinjamDate) ? format(pinjamDate, 'MM/dd/yyyy') : '');
        setTglKembali(isValid(kembaliDate) ? format(kembaliDate, 'MM/dd/yyyy') : '');
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        const parsedDate = parse(value, 'MM/dd/yyyy', new Date());

        if (isValid(parsedDate)) {
            const formattedDate = format(parsedDate, 'yyyy-MM-dd');
            if (name === 'tgl-pinjam') {
                setTglPinjam(formattedDate);
            } else if (name === 'tgl-kembali') {
                setTglKembali(formattedDate);
            }
        }
    };

    const savePengembalian = async (e) => {
        e.preventDefault();
        
        if (!selectedItem || !kondisi) {
          setMsg("Please fill all the fields.");
          return;
        }
        
        try {
          await axios.post('http://localhost:5000/pengembalian', {
            barangId: selectedItem.barang.id,
            tgl_pinjam: tglPinjam,
            tgl_kembali: tglKembali,
            qty,
            kondisi,
            status: 'menunggu'
          });
          navigate("/pengembalian");
        } catch (error) {
          setMsg(error.response ? error.response.data.msg : "An error occurred");
        }
    };

    const resetForm = () => {
        setSelectedItem(null);
        setTglPinjam("");
        setTglKembali("");
        setQty("");
        setKondisi("");
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
                                    <h4 style={{ color: '#243561' }}>Tambah Data Pengembalian</h4>
                                </div>
                            </div>
                        </div>
                        <section id="basic-horizontal-layouts">
                            <div className="row match-height justify-content-center">
                                <div className="col-md-10">
                                    <div className="card" style={{ backgroundColor: '#ffff' }}>
                                        <div className="card-content">
                                            <div className="card-body">
                                                <form onSubmit={savePengembalian} className="form form-horizontal">
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
                                                                            <input type="text" id="nama-barang" className="form-control" name="nama-barang" value={selectedItem ? selectedItem.barang.name : ''} placeholder="Nama Barang" style={{ backgroundColor: '#fff', borderColor: '#777' }} readOnly />
                                                                            <button type="button" className="btn btn-primary" onClick={openModal}>
                                                                                <i className="fa-solid fa-search"></i> Search
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label htmlFor="kode-barang" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal', marginTop: '8px' }}>Kode Barang</label>
                                                                    <div className="col-sm-12">
                                                                        <input type="text" id="kode-barang" className="form-control" name="kode-barang" value={selectedItem ? selectedItem.barang.kode : ''} placeholder="Kode Barang" readOnly style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <div className="form-group row">
                                                                    <label htmlFor="deskripsi" className="col-sm-12 col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Deskripsi Kondisi Barang Setelah Dipinjam</label>
                                                                    <div className="col-sm-12">
                                                                        <textarea id="deskripsi" className="form-control" name="deskripsi" value={kondisi} placeholder="Deskripsikan Kondisi Barang Setelah Dipinjam" rows="5" style={{ backgroundColor: '#fff', borderColor: '#777' }} onChange={(e) => setKondisi(e.target.value)}></textarea>
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
                                                                        <input type="text" id="tgl-pinjam" className="form-control" name="tgl-pinjam" value={tglPinjam} onChange={handleDateChange} style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="tgl-kembali" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Tgl Kembali</label>
                                                                    <div className="input-group">
                                                                        <input type="text" id="tgl-kembali" className="form-control" name="tgl-kembali" value={tglKembali} onChange={handleDateChange} style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-4">
                                                                <div className="form-group">
                                                                    <label htmlFor="qty" className="col-form-label" style={{ color: '#000', fontWeight: 'normal' }}>Qty</label>
                                                                    <div className="input-group">
                                                                        <input type="number" id="qty" className="form-control" name="qty" value={qty} onChange={(e) => setQty(e.target.value)} style={{ backgroundColor: '#fff', borderColor: '#777' }} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="col-12 d-flex justify-content-end mt-4">
                                                            <button type="submit" className="btn btn-primary me-1 mb-1" disabled={!selectedItem}>
                                                                <i className="fa-regular fa-floppy-disk" style={{ marginRight: '8px' }}></i> Simpan
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger me-1 mb-1"
                                                                style={{ backgroundColor: '#d93942', color: 'white' }}
                                                                onClick={resetForm}
                                                            >
                                                                <i className="fa-solid fa-rotate-left" style={{ marginRight: '8px' }}></i> Reset
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                                {/* Modal SelectPengembalian */}
                                                <SelectPengembalian isOpen={isModalOpen} onClose={closeModal} onSelect={handleSelectItem} />
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

export default AddPengembalian;
