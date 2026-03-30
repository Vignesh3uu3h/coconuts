import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import UserModel from './user.js'
import AgentModel from './agent.js'
import FarmerModel from './farmer.js'
import NotificationModel from './notification.js'
import PurchaseModel from './purchase.js'
import BuyerModel from './buyer.js'
import SaleModel from './sale.js'
import StockLedgerModel from './stockLedger.js'

const User = UserModel(sequelize, DataTypes)
const Agent = AgentModel(sequelize, DataTypes)
const Farmer = FarmerModel(sequelize, DataTypes)
const Notification = NotificationModel(sequelize, DataTypes)
const Purchase = PurchaseModel(sequelize, DataTypes)
const Buyer = BuyerModel(sequelize, DataTypes)
const Sale = SaleModel(sequelize, DataTypes)
const StockLedger = StockLedgerModel(sequelize, DataTypes)

// Relationships
User.hasOne(Agent, { foreignKey: 'userId', as: 'agentProfile' })
Agent.belongsTo(User, { foreignKey: 'userId', as: 'user' })

Agent.hasMany(Farmer, { foreignKey: 'assignedAgentId', as: 'farmers' })
Farmer.belongsTo(Agent, { foreignKey: 'assignedAgentId', as: 'assignedAgent' })

Agent.hasMany(Notification, { foreignKey: 'agentId', as: 'notifications' })
Farmer.hasMany(Notification, { foreignKey: 'farmerId', as: 'notifications' })
Notification.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' })
Notification.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' })

Agent.hasMany(Purchase, { foreignKey: 'agentId', as: 'purchases' })
Farmer.hasMany(Purchase, { foreignKey: 'farmerId', as: 'purchases' })
Purchase.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' })
Purchase.belongsTo(Farmer, { foreignKey: 'farmerId', as: 'farmer' })

Buyer.hasMany(Sale, { foreignKey: 'buyerId', as: 'sales' })
Sale.belongsTo(Buyer, { foreignKey: 'buyerId', as: 'buyer' })

Purchase.hasMany(StockLedger, { foreignKey: 'purchaseId', as: 'ledgerEntries' })
Sale.hasMany(StockLedger, { foreignKey: 'saleId', as: 'ledgerEntries' })
StockLedger.belongsTo(Purchase, { foreignKey: 'purchaseId', as: 'purchase' })
StockLedger.belongsTo(Sale, { foreignKey: 'saleId', as: 'sale' })

export {
  sequelize,
  User,
  Agent,
  Farmer,
  Notification,
  Purchase,
  Buyer,
  Sale,
  StockLedger,
}
