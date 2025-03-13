'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     // Asociaciones
     */
    static associate(models) {
      // Un Usuario tiene muchos pedidos
      Usuario.hasMany(models.Pedido, { foreignKey: 'usuario_id'});
    }
  }

  Usuario.init({
    nombre: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuario',
  });
  return Usuario;
}