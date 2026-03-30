export default (sequelize, DataTypes) => {
  const Agent = sequelize.define('Agent', {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    commission: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  }, {
    tableName: 'agents',
  })
  return Agent
}
