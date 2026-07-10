import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from './models/Event';
import { Blog } from './models/Blog';
import { User, Role } from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const UPCOMING_EVENTS = [
  {
    type: 'UPCOMING',
    title: 'Mumbai Trading Summit 2026',
    description: 'Live market breakdowns, prop-firm workshops and an evening of networking with 300+ traders.',
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
    title: 'Funded Trader Awards',
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
    excerpt: 'Entry criteria, invalidation logic and 40 annotated examples across FX and crypto.',
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
    title: 'Reading the DXY like a market maker',
    slug: 'reading-the-dxy-like-a-market-maker',
    excerpt: "The dollar index drives everything you trade. Here's the weekly framework.",
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
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/app');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    await Event.deleteMany();
    await Blog.deleteMany();

    console.log('Inserting events...');
    await Event.insertMany([...UPCOMING_EVENTS, ...ARCHIVE_EVENTS]);

    console.log('Getting/Creating Admin User...');
    let admin = await User.findOne({ role: Role.ADMIN });
    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash,
        role: Role.ADMIN,
      });
    }

    console.log('Inserting blogs...');
    const blogsWithAuthor = POSTS.map((post) => ({ ...post, authorId: admin?._id }));
    await Blog.insertMany(blogsWithAuthor);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
};

importData();
