'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetallePedido extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Un detalle de pedido pertenece a un pedido
      DetallePedido.belongsTo(models.Pedido, {
        foreignKey: 'pedido_id'
      });

      // Un detalle de pedido pertenece a un producto
      DetallePedido.belongsTo(models.Producto, {
        foreignKey: 'producto_id'
      });
    }
  }
  DetallePedido.init({
    pedido_id: DataTypes.INTEGER,
    producto_id: DataTypes.INTEGER,
    cantidad_producto: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DetallePedido',
    tableName: 'detallepedido'
  });
  return DetallePedido;
};