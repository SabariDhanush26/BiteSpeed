import { DataTypes } from "sequelize";
export default (sequelize)=>{
    const User = sequelize.define('User',{
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        phoneNumber:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false, 
        },
        email:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: false, 
        },
        linkedId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        linkPrecedence:{
            type: DataTypes.TEXT,
            defaultValue: "primary"
        }

    })
    return User;
}