import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const saveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/user", {
        name: name,
        email: email,
        password: password,
        role: 'user'  // Tetapkan role sebagai 'user'
      });
      navigate("/");  // Navigate to login
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
    setMsg("");
  };

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#fff' }}>
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
              className="img-fluid"
              alt="Sample image"
            />
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <form onSubmit={saveUser}>
              {msg && <p style={styles.errorMessage}>{msg}</p>}
              <div className="mb-4 text-center">
                <h4 className="fw-bold" style={{ fontSize: '2rem', color: '#003366' }}>Register</h4>
              </div>
              {/* Name input */}
              <div data-mdb-input-init className="form-outline mb-4">
                <label style={{ color: '#000' }}>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-lg"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  style={{ backgroundColor: 'transparent', borderColor: '#000', color: '#000' }}
                />
              </div>
              {/* Email input */}
              <div data-mdb-input-init className="form-outline mb-4">
                <label style={{ color: '#000' }}>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                  style={{ backgroundColor: 'transparent', borderColor: '#000', color: '#000' }}
                />
              </div>
              {/* Password input */}
              <div data-mdb-input-init className="form-outline mb-3">
                <label style={{ color: '#000' }}>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control form-control-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  style={{ backgroundColor: 'transparent', borderColor: '#000', color: '#000' }}
                />
              </div>
              <div className="text-center text-lg-start mt-4 pt-2">
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary btn-lg"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                  Register
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-danger btn-lg"
                  style={{ marginLeft: '1rem' }}>
                  Reset
                </button>
              </div>
              <div className="text-center text-lg-start mt-3">
                <p className="text-muted">
                  Have an account? <a href="/" className="text-primary" >Login</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  errorMessage: {
    color: 'red',
    textAlign: 'center'
  }
};

export default Register;