export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'agent'), allowNull: false, defaultValue: 'admin' },
    phone: { type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'users',
  })
  return User
}
