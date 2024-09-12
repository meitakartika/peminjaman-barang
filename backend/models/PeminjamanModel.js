import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";
import Barang from "./BarangModel.js";

const { DataTypes } = Sequelize;

const Peminjaman = db.define('peminjaman', {
    tglPinjam: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tglKembali: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    barangId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true
});

User.hasMany(Peminjaman);
Peminjaman.belongsTo(User, { foreignKey: 'userId' });

Barang.hasMany(Peminjaman);
Peminjaman.belongsTo(Barang, { foreignKey: 'barangId' });

export default Peminjaman;