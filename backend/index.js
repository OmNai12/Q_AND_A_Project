import { app } from './app.js';
import connectDB from './db/db-setup.js';
import createError from 'http-errors';


// env file configuration
import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
});

// Connect to the database
connectDB()
  .then(() => {
    // Start the server after successful database connection
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error.message);
    const dbError = createError(500, `Database Connection Failed: ${error.message}`);
    console.error(dbError); // Log the formatted error
    process.exit(1); // Exit the process after logging
  });