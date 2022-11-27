const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("dog", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        height: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        life: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
};
