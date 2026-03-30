export default (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    message: { type: DataTypes.TEXT, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'sent'), allowNull: false, defaultValue: 'pending' },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  }, {
    tableName: 'notifications',
  })
  return Notification
}
