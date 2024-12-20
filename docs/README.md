# Development Setup

## Prerequisites

- Node.js: v22.7.0
- Docker: 27.1.2
- Postgres: 16.3
- Node Package Manager: 10.8.2

## Setup
1. Clone the repository

### Starting the services

1. Navigate to the root directory.
2. Run `docker compose up` to start the services.

### Frontend
1. Navigate to the frontend directory.
2. Run `npm install` to install the dependencies.

### Backend

1. Navigate to the backend directory.
2. Run `npm install` to install the dependencies.

## Seeding the Database

1. Navigate to `http://localhost:8080` to check if database is connected.
2. Navigate to the backend directory.
3. Run `npm run seed:superAdmin` to seed the database.
4. Run `npm run seed:permissions` to seed the database.

## Running the Application

1. Navigate to the frontend directory.
2. Run `npm run dev` to start the development server.
3. Navigate to `http://localhost:5173` to access the application.
4. Navigate to the backend directory.
5. Run `npm start` to start the development server.
6. Navigate to `http://localhost:3000` to access the application.

## Stopping the Services

1. Navigate to the root directory.
2. Run `docker compose down` to stop the services.


## Documents
1. All documents related the project are uploaded here. [Link](https://drive.google.com/drive/folders/1NxweaeHjOx7FJeDylsU6bIU6QX7mAz3V?usp=sharing)