import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SelectPengembalian({ isOpen, onClose, onSelect }) {
  const [peminjaman, setPeminjaman] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      getPeminjaman();
    }
  }, [isOpen]);

  const getPeminjaman = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/peminjaman');
      console.log('Peminjaman Data:', response.data);
      // Filter peminjaman with status 'disetujui'
      const filteredPeminjaman = response.data.filter(item => item.status === 'disetujui');
      setPeminjaman(filteredPeminjaman);
    } catch (error) {
      setError("Error fetching peminjaman: " + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    if (onSelect) {
      onSelect(item);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Data Peminjaman</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : peminjaman.length === 0 ? (
              <p>Tidak ada data peminjaman tersedia.</p>
            ) : (
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Kode</th>
                    <th>Nama</th>
                    <th>Qty</th>
                    <th>Tgl Pinjam</th>
                    <th>Tgl Kembali</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {peminjaman.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.barang?.kode || 'N/A'}</td>
                      <td>{item.barang?.name || 'N/A'}</td>
                      <td>{item.qty || 0}</td>
                      <td>{item.tglPinjam.split('T')[0]}</td>
                      <td>{item.tglKembali.split('T')[0]}</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => handleSelect(item)}>
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
            <button type="button" className="btn btn-danger" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SelectPengembalian;