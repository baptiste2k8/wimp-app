const mariadb = require('mariadb');
const bcrypt = require('bcrypt');

const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  connectionLimit: 10,
});

const users = [
  {
    userName: 'Administrator',
    userEmail: 'baptiste2k17@gmail.com',
    userPassword: 'password123',
    userAge: 22,
  },
  {
    userName: 'Jean Baptiste M',
    userEmail: 'baptiste2k8@gmail.com',
    userPassword: 'password456',
    userAge: 21,
  },
  {
    userName: 'Enos Mukiza',
    userEmail: 'mukizaenos@gmail.com',
    userPassword: 'password789',
    userAge: 22,
  },
];

const wimps = [
  {
    heartbeat: 170,
    receivedOn: '2024-04-04 18:30:25',
    buddyPayload: 'move/0.2/0.4',
    buddyPayloadExecutionStatus: null,
    notificationMessage: null,
    notificationDeliveryStatus: null,
  }, 
];
async function createDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('CREATE DATABASE IF NOT EXISTS buddy_db');
    console.log('Database created successfully.');
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function createUserTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        userUniqueId INT NOT NULL AUTO_INCREMENT,
        userName VARCHAR(255),
        userEmail VARCHAR(255),
        userPassword VARCHAR(255),
        userAge INT,
        CONSTRAINT user_pk PRIMARY KEY (userUniqueId)

      )
    `);
    console.log('Users table created successfully.');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function createWimpTable() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wimps (
        uniqueID INT NOT NULL AUTO_INCREMENT,
        heartbeat INT, 
        receivedOn DATETIME, 
        buddyPayload VARCHAR(255),
        buddyPayloadExecutionStatus VARCHAR(255),
        notificationMessage VARCHAR(255),
        notificationDeliveryStatus VARCHAR(255),
        CONSTRAINT wimps_pk PRIMARY KEY (uniqueID)
      )
    `);
    console.log('Wimps table created successfully.');
  } catch (error) {
    console.error('Error creating wimps table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedUsers() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query('DELETE FROM users');

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.userPassword, 10);
      await connection.query('INSERT INTO users (userName, userEmail, userPassword, userAge) VALUES (?, ?, ?, ?)', [
        user.userName,
        user.userEmail,
        hashedPassword,
        user.userAge,
      ]);
    }

    console.log('Users table seeded successfully.');
  } catch (error) {
    console.error('Error seeding users table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedwimps() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query('USE buddy_db');
    await connection.query('DELETE FROM wimps');

    for (const wimp of wimps) {
      await connection.query('INSERT INTO wimps (heartbeat, receivedOn,buddyPayload, buddyPayloadExecutionStatus, notificationMessage,notificationDeliveryStatus) VALUES (?, ?, ?, ?, ?,?)', [
        wimp.heartbeat,
        wimp.receivedOn,
        wimp.buddyPayload,
        wimp.buddyPayloadExecutionStatus,
        wimp.notificationMessage,
        wimp.notificationDeliveryStatus,
      ]);
    }

    console.log('wimps table seeded successfully.');
  } catch (error) {
    console.error('Error seeding wimps table:', error);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}
async function seedDatabase() {
  await createDatabase();
  await createUserTable();
  await createWimpTable();
  await seedUsers();
  await seedwimps();
  pool.end();
}

seedDatabase();