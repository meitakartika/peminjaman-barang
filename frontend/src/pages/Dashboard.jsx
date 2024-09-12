import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const Dashboard = () => {
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
  }, [isError, navigate]);

  // Cek role
  const isAdmin = user && user.role === "admin";
  const isUser = user && user.role === "user";

  return (
    <div style={styles.appContainer}>
      <Sidebar />
      <div style={styles.mainContent}>
        <Navbar />
        <div style={styles.dashboardContent}>
          <h4 style={{ color: '#243561' }}>Dashboard</h4>
          <div className="row">
            {isAdmin && (
              <>
                <div className="col-lg-6 col-md-6 mb-3">
                  <Link to="/user" className="card" style={styles.card}>
                    <div style={styles.cardContent}>
                      <span style={styles.iconContainerRed}>
                        <i className="fa-solid fa-laptop" style={styles.icon}></i>
                      </span>
                      <div style={styles.textContainer}>
                        <h4 className="text-muted font-semibold">Data User</h4>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-lg-6 col-md-6 mb-3">
                  <Link to="/barang" className="card" style={styles.card}>
                    <div style={styles.cardContent}>
                      <span style={styles.iconContainerYellow}>
                        <i className="fa-solid fa-laptop" style={styles.icon}></i>
                      </span>
                      <div style={styles.textContainer}>
                        <h4 className="text-muted font-semibold">Data Barang</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              </>
            )}
            <div className="col-lg-6 col-md-6 mb-3">
              <Link to={isAdmin ? "/peminjamanAdmin" : "/peminjaman"} className="card" style={styles.card}>
                <div style={styles.cardContent}>
                  <span style={styles.iconContainerGreen}>
                    <i className="fa-solid fa-laptop" style={styles.icon}></i>
                  </span>
                  <div style={styles.textContainer}>
                    <h4 className="text-muted font-semibold">Data Peminjaman</h4>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-6 col-md-6 mb-3">
              <Link to={isAdmin ? "/pengembalianAdmin" : "/pengembalian"} className="card" style={styles.card}>
                <div style={styles.cardContent}>
                  <span style={styles.iconContainerBlue}>
                    <i className="fa-solid fa-laptop" style={styles.icon}></i>
                  </span>
                  <div style={styles.textContainer}>
                    <h4 className="text-muted font-semibold">Data Pengembalian</h4>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#eaf3fc",
  },
  mainContent: {
    marginLeft: "250px",
    marginTop: "80px",
    padding: "20px",
    width: "calc(100% - 250px)",
    minHeight: "calc(100vh - 80px)",
    backgroundColor: "#f1f8ff",
  },
  dashboardContent: {
    padding: "20px",
    width: "100%",
    backgroundColor: "#f1f8ff",
    borderRadius: "10px",
  },
  card: {
    width: "100%",
    padding: "30px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
    borderRadius: "15px",
    backgroundColor: "#fff",
    marginTop: "30px",
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
  },
  iconContainerYellow: {
    backgroundColor: "#FBC02D",
    padding: "15px",
    borderRadius: "12px",
    color: "#fff",
  },
  iconContainerGreen: {
    backgroundColor: "#66BB6A",
    padding: "15px",
    borderRadius: "12px",
    color: "#fff",
  },
  iconContainerRed: {
    backgroundColor: "#EF5350",
    padding: "15px",
    borderRadius: "12px",
    color: "#fff",
  },
  iconContainerBlue: {
    backgroundColor: "#42A5F5",
    padding: "15px",
    borderRadius: "12px",
    color: "#fff",
  },
  icon: {
    fontSize: "30px",
  },
  textContainer: {
    marginLeft: "25px",
  },
};

export default Dashboard;