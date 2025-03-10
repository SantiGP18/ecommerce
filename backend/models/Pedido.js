'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un pedido pertenece a un usuario
      Pedido.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id'
      });

      // Un pedido puede tener múltiples detalles de pedido
      Pedido.hasMany(models.DetallePedido, {
        foreignKey: 'pedido_id'
      });
    }
  }
  Pedido.init({
    usuario_id: DataTypes.INTEGER,
    total: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Pedido',
    tableName: 'pedido'
  });
  return Pedido;
};