import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";
import axios from 'axios';

const AddUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
  
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

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [msg, setMsg] = useState("");

    const saveUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/user", {
                name: name,
                email: email,
                password: password,
                role: role
            });
            navigate("/user");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    const handleReset = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("");
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
                                    <h4 style={{ color: '#243561' }}>Tambah Data User</h4>
                                </div>
                            </div>
                        </div>
                        <section id="basic-horizontal-layouts">
                            <div className="row match-height justify-content-center">
                                <div className="col-md-10">
                                    <div className="card" style={{ backgroundColor: '#ffff' }}>
                                        <div className="card-content">
                                            <div className="card-body">
                                                <form onSubmit={saveUser} className="form form-horizontal">
                                                    <p style={styles.errorMessage}>{msg}</p>
                                                    <div className="form-body">
                                                        <div className="row">
                                                            <div className="col-md-4" style={{ display: 'flex', alignItems: 'center', color: '#000', marginTop: '20px', marginBottom: '30px' }}>
                                                                <label htmlFor="nama">Nama</label>
                                                            </div>
                                                            <div className="col-md-8 form-group" style={{ marginTop: '20px', marginBottom: '30px' }}>
                                                                <input
                                                                    type="text"
                                                                    id="nama"
                                                                    className="form-control"
                                                                    name="nama"
                                                                    placeholder="Nama"
                                                                    style={{ backgroundColor: '#fff', borderColor: '#777' }}
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-md-4" style={{ display: 'flex', alignItems: 'center', color: '#000', marginBottom: '30px' }}>
                                                                <label htmlFor="email">Email</label>
                                                            </div>
                                                            <div className="col-md-8 form-group" style={{ marginBottom: '30px' }}>
                                                                <input
                                                                    type="email"
                                                                    id="email"
                                                                    className="form-control"
                                                                    name="email"
                                                                    placeholder="Email"
                                                                    style={{ backgroundColor: '#fff', borderColor: '#777' }}
                                                                    value={email}
                                                                    onChange={(e) => setEmail(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-md-4" style={{ display: 'flex', alignItems: 'center', color: '#000', marginBottom: '30px' }}>
                                                                <label htmlFor="password">Password</label>
                                                            </div>
                                                            <div className="col-md-8 form-group" style={{ marginBottom: '30px' }}>
                                                                <input
                                                                    type="password"
                                                                    id="password"
                                                                    className="form-control"
                                                                    name="password"
                                                                    placeholder="Password"
                                                                    style={{ backgroundColor: '#fff', borderColor: '#777' }}
                                                                    value={password}
                                                                    onChange={(e) => setPassword(e.target.value)}
                                                                />
                                                            </div>
                                                            <div className="col-md-4" style={{ display: 'flex', alignItems: 'center', color: '#000', marginBottom: '30px' }}>
                                                                <label htmlFor="role">Role</label>
                                                            </div>
                                                            <div className="col-md-8 form-group" style={{ marginBottom: '30px' }}>
                                                                <select
                                                                    id="role"
                                                                    className="form-control"
                                                                    name="role"
                                                                    style={{ backgroundColor: '#fff', borderColor: '#777' }}
                                                                    value={role}
                                                                    onChange={(e) => setRole(e.target.value)}
                                                                >
                                                                    <option value="" disabled>Select Role</option>
                                                                    <option value="user">User</option>
                                                                    <option value="admin">Admin</option>
                                                                </select>
                                                            </div>
                                                            <div className="col-12 d-flex justify-content-end">
                                                                <button type="submit" className="btn btn-primary me-1 mb-1">
                                                                    <i className="fa-regular fa-floppy-disk" style={{ marginRight: '8px' }}></i>Simpan
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={handleReset}
                                                                    className="btn btn-danger me-1 mb-1"
                                                                    style={{ backgroundColor: '#d93942', color: 'white' }}
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

export default AddUser;