const CORS_OPTIONS = {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Vite dev server
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [], // Optional: Remove or leave empty unless you need it
};

export default CORS_OPTIONS;
