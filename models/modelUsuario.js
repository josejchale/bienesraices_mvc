import { DataTypes, Sequelize } from 'sequelize';
import db from '../config/db.js';

const modelUsuario = db.define('usuarios',{
    nombre:{
        type : DataTypes.STRING(100),
        allowNull: false
    },
    email:{
        type : DataTypes.STRING,
        allowNull: false
    },
    password:{
    type : DataTypes.STRING,
    allowNull: false
    },
    token: DataTypes.STRING,
    confirmado:DataTypes.BOOLEAN
})

export default modelUsuario;