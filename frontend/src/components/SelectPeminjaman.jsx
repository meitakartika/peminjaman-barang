import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectPeminjaman({ isOpen, onClose, onSelectItem }) {
    const [barang, setBarang] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen) {
            getBarang();
        }
    }, [isOpen]);

    const getBarang = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('http://localhost:5000/barang');
            setBarang(response.data);
        } catch (error) {
            setError("Error fetching barang: " + (error.response?.data?.msg || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectItem = (item) => {
        onSelectItem(item);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Data Barang</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        {loading ? (
                            <p>Loading...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : barang.length === 0 ? (
                            <p>Tidak ada data barang tersedia.</p>
                        ) : (
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Kode</th>
                                        <th>Nama</th>
                                        <th>Stok</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {barang.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.kode}</td>
                                            <td>{item.name}</td>
                                            <td>{item.stok}</td>
                                            <td>
                                                <button className="btn btn-primary" onClick={() => handleSelectItem(item)}>
                                                    Pilih
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectPeminjaman;