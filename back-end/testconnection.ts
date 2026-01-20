/* eslint-disable prettier/prettier */
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: true, // Set to true for testing; will auto-create tables
});

async function testConnection() {
    try {
        await AppDataSource.initialize();
        console.log("Connection to PostgreSQL established successfully!");

        // Optional: Close the connection after testing
        await AppDataSource.destroy();
    } catch (error) {
        console.error("Error connecting to PostgreSQL:", error);
    }
}

testConnection();

