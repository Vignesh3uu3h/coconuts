import dayjs from 'dayjs'

export default (sequelize, DataTypes) => {
  const Farmer = sequelize.define('Farmer', {
    name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    village: { type: DataTypes.STRING, allowNull: false },
    lastSupplyDate: { type: DataTypes.DATEONLY, allowNull: true },
    nextSupplyDate: { type: DataTypes.DATEONLY, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'farmers',
    hooks: {
      beforeSave: (farmer) => {
        if (farmer.lastSupplyDate) {
          farmer.nextSupplyDate = dayjs(farmer.lastSupplyDate).add(2, 'month').format('YYYY-MM-DD')
        }
      },
    },
  })

  return Farmer
}
