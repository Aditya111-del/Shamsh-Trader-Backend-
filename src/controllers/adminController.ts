import { Request, Response, NextFunction } from 'express';
import { User, Role } from '../models/User';
import { Course } from '../models/Course';
import { Blog } from '../models/Blog';
import { Session } from '../models/Session';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ role: Role.PREMIUM });
    const totalCourses = await Course.countDocuments();
    const activeSessions = await Session.countDocuments();

    // Mock revenue data for the chart (in a real app, query a payment table)
    const revenueData = [
      { name: 'Mon', revenue: 4000, users: 240 },
      { name: 'Tue', revenue: 3000, users: 139 },
      { name: 'Wed', revenue: 2000, users: 980 },
      { name: 'Thu', revenue: 2780, users: 390 },
      { name: 'Fri', revenue: 1890, users: 480 },
      { name: 'Sat', revenue: 2390, users: 380 },
      { name: 'Sun', revenue: 3490, users: 430 },
    ];

    res.json({
      stats: {
        totalUsers,
        premiumUsers,
        totalCourses,
        activeSessions,
        totalRevenue: 45231.89, // Mocked total
      },
      chartData: revenueData,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['USER', 'PREMIUM', 'MODERATOR', 'ADMIN'].includes(role)) {
       res.status(400).json({ message: 'Invalid role' });
       return;
    }

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Prevent admin deletion
    if (user.role === 'ADMIN') {
      res.status(403).json({ message: 'Cannot delete admin users' });
      return;
    }

    await user.deleteOne();
    await Session.deleteMany({ userId: id });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
