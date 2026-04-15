import User from '@/lib/models/User';
import { connectDB } from '@/lib/db/connection';
import { hashPassword, comparePassword } from '@/lib/utils/password';

export async function createUser(username, password, role = 'viewer') {
  await connectDB();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    username,
    password: hashedPassword,
    role,
  });

  return user.save();
}

export async function authenticateUser(username, password) {
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  return user;
}

export async function getUserById(userId) {
  await connectDB();
  return User.findById(userId).select('-password');
}

export async function getUsers() {
  await connectDB();
  return User.find().select('-password');
}
