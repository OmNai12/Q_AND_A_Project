export const logError = (error) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${error.message}`);
    console.error(error.stack);
  };
  