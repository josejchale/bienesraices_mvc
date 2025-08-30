import { DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
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
},{
    hooks:{
        beforeCreate:async function(usuario){
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
        }
    }
})

//Metodo para comprobar el password
modelUsuario.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default modelUsuario;