"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ── Middleware ────────────────────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    // Relax CSP in development so the API is reachable from the local Vite dev server
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
}));
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,https://shamsh-trader-frontend.vercel.app')
    .split(',')
    .map((o) => o.trim());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. curl, Postman) or matching origins
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: origin '${origin}' not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
}));
// Handle all CORS preflight requests globally
app.options(/(.*)/, (0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)('dev'));
// Serve uploaded files statically
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
const errorHandler_1 = require("./middlewares/errorHandler");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const sponsorRoutes_1 = __importDefault(require("./routes/sponsorRoutes"));
const newsletterRoutes_1 = __importDefault(require("./routes/newsletterRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const featuredRoutes_1 = __importDefault(require("./routes/featuredRoutes"));
const botRoutes_1 = __importDefault(require("./routes/botRoutes"));
const communityRoutes_1 = __importDefault(require("./routes/communityRoutes"));
const testimonialRoutes_1 = __importDefault(require("./routes/testimonialRoutes"));
const settingsRoutes_1 = __importDefault(require("./routes/settingsRoutes"));
// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/admin', adminRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/courses', courseRoutes_1.default);
app.use('/api/v1/blogs', blogRoutes_1.default);
app.use('/api/v1/events', eventRoutes_1.default);
app.use('/api/v1/sponsors', sponsorRoutes_1.default);
app.use('/api/v1/newsletter', newsletterRoutes_1.default);
app.use('/api/v1/upload', uploadRoutes_1.default);
app.use('/api/v1/featured-posts', featuredRoutes_1.default);
app.use('/api/v1/bots', botRoutes_1.default);
app.use('/api/v1/community', communityRoutes_1.default);
app.use('/api/v1/testimonials', testimonialRoutes_1.default);
app.use('/api/v1/settings', settingsRoutes_1.default);
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'uploads')));
// ── Error Handling ────────────────────────────────────────────────────────────
app.use(errorHandler_1.notFound);
app.use(errorHandler_1.errorHandler);
// ── Database Connection & Server Start ────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shamsh_trader';
mongoose_1.default.connect(MONGODB_URI)
    .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
})
    .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});
