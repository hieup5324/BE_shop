import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

// const configService = new ConfigService();

// export default new DataSource({
//   type: 'mysql',
//   host: configService.get('DB_HOST'),
//   port: +configService.get('DB_PORT'),
//   username: configService.get('DB_USERNAME'),
//   password: configService.get('DB_PASSWORD'),
//   database: configService.get('DB_DATABASE_NAME'),
//   migrations: ['migrations/**'],
//   entities: ['dist/**/*.entity.js'],
// });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  migrations: ['migrations/**'],
  entities: ['dist/**/*.entity.js'],
  logging: false,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
dataSource.initialize();
export default dataSource;
