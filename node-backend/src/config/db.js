import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const engine = process.env.DB_ENGINE || "sqlite";

let sequelize;

if (engine === "mysql") {
  sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      dialect: "mysql",
      logging: false,
    }
  );
}

else if (engine === "postgres") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    logging: false,

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    // ⭐ THIS LINE FIXES SUPABASE POOLER
    native: false,
  });
}

else {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.SQLITE_STORAGE || "database.sqlite",
    logging: false,
  });
}

export { sequelize };
