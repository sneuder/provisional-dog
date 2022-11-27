const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    sequelize.define("temps", {
        temperament: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
    });
};
