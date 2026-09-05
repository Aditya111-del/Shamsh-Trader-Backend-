"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Event_1 = require("./models/Event");
const Blog_1 = require("./models/Blog");
const User_1 = require("./models/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
dotenv_1.default.config();
const UPCOMING_EVENTS = [
    {
        type: 'UPCOMING',
        title: 'Mumbai Trading Summit 2026',
        description: 'Live market breakdowns, Indian market F&O and Crypto workshops, and an evening of networking with 300+ traders.',
        location: 'Grand Hyatt, Mumbai',
        date: new Date('2026-08-24T10:00:00Z'),
        time: '10:00 — 19:00 IST',
        images: ['/images/capability-1.jpg'],
        seatsFilled: 246,
        totalSeats: 300,
    },
    {
        type: 'UPCOMING',
        title: 'Backtesting Masterclass',
        description: 'A 3-hour deep dive: build, validate and stress-test a strategy live — then take the template home.',
        location: 'Zoom · link on signup',
        date: new Date('2026-09-12T18:00:00Z'),
        time: '18:00 — 21:00 IST',
        images: ['/images/capability-4.jpg'],
        seatsFilled: 38,
        totalSeats: 0, // unlimited
    },
];
const ARCHIVE_EVENTS = [
    {
        type: 'ARCHIVE',
        title: 'Dubai Traders Meetup',
        section: '2025 · 180 attendees · Keynote night',
        images: ['/images/research-1.jpg'],
    },
    {
        type: 'ARCHIVE',
        title: 'Risk Workshop',
        section: '2025 · Delhi',
        images: ['/images/capability-2.jpg'],
    },
    {
        type: 'ARCHIVE',
        title: 'Psychology Bootcamp',
        section: '2025 · Online · 2.4K live',
        images: ['/images/capability-3.jpg'],
    },
    {
        type: 'ARCHIVE',
        title: 'Indian Market Traders Summit',
        section: '2024 · Bangalore',
        images: ['/images/research-3.jpg'],
    },
    {
        type: 'ARCHIVE',
        title: 'Scalping Night',
        section: '2024 · Mumbai',
        images: ['/images/research-2.jpg'],
    },
    {
        type: 'ARCHIVE',
        title: 'Live Trading Arena',
        section: '2024 · Goa retreat',
        images: ['/images/capability-4.jpg'],
    },
];
const POSTS = [
    {
        title: 'The 3-touch range model, fully mapped',
        slug: 'the-3-touch-range-model-fully-mapped',
        excerpt: 'Entry criteria, invalidation logic and 40 annotated examples across Crypto and Indian Markets.',
        content: 'Full content goes here...',
        image: '/images/capability-4.jpg',
        category: 'Playbooks · Jul 2026',
        categoryColor: '#22c55e',
        readTime: '8 min read',
    },
    {
        title: "You don't have a discipline problem. You have a sizing problem.",
        slug: 'discipline-problem-sizing-problem',
        excerpt: 'Why every tilt episode traces back to one number — and how to fix it structurally.',
        content: 'Full content goes here...',
        image: '/images/capability-3.jpg',
        category: 'Psychology · Jun 2026',
        categoryColor: '#c084fc',
        readTime: '6 min read',
    },
    {
        title: 'BTC halving cycles: what actually repeats',
        slug: 'btc-halving-cycles-what-actually-repeats',
        excerpt: 'Separating the statistically real patterns from the Twitter mythology, with data.',
        content: 'Full content goes here...',
        image: '/images/research-2.jpg',
        category: 'Markets · Jun 2026',
        categoryColor: '#22c55e',
        readTime: '14 min read',
    },
    {
        title: 'Post-mortem: the gold short that paid for the quarter',
        slug: 'post-mortem-the-gold-short-that-paid-for-the-quarter',
        excerpt: 'Full annotated journal entry — thesis, execution, management, and the one mistake.',
        content: 'Full content goes here...',
        image: '/images/research-4.jpg',
        category: 'Trade Review · May 2026',
        categoryColor: '#22c55e',
        readTime: '9 min read',
    },
    {
        title: 'Reading India VIX & Nifty like a market maker',
        slug: 'reading-india-vix-nifty-like-a-market-maker',
        excerpt: "Volatility and index momentum drive Indian market swings. Here's the weekly framework.",
        content: 'Full content goes here...',
        image: '/images/capability-2.jpg',
        category: 'Markets · May 2026',
        categoryColor: '#22c55e',
        readTime: '7 min read',
    },
    {
        title: 'The 90-day journal protocol',
        slug: 'the-90-day-journal-protocol',
        excerpt: 'The exact review template our funded traders use — download inside.',
        content: 'Full content goes here...',
        image: '/images/research-1.jpg',
        category: 'Psychology · Apr 2026',
        categoryColor: '#c084fc',
        readTime: '5 min read',
    },
];
const importData = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/app');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await Event_1.Event.deleteMany();
        await Blog_1.Blog.deleteMany();
        console.log('Inserting events...');
        await Event_1.Event.insertMany([...UPCOMING_EVENTS, ...ARCHIVE_EVENTS]);
        console.log('Getting/Creating Admin User...');
        let admin = await User_1.User.findOne({ role: User_1.Role.ADMIN });
        if (!admin) {
            const salt = await bcryptjs_1.default.genSalt(10);
            const passwordHash = await bcryptjs_1.default.hash('admin123', salt);
            admin = await User_1.User.create({
                name: 'Admin User',
                email: 'admin@example.com',
                passwordHash,
                role: User_1.Role.ADMIN,
            });
        }
        console.log('Inserting blogs...');
        const blogsWithAuthor = POSTS.map((post) => ({ ...post, authorId: admin?._id }));
        await Blog_1.Blog.insertMany(blogsWithAuthor);
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};
importData();
