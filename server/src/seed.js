import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import FoodPost from './models/FoodPost.js';
import Request from './models/Request.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import Transaction from './models/Transaction.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_sharing_db';

const users = [
  {
    fullName: 'Khắc Anh',
    email: 'khacanh19803535@gmail.com',
    passwordHash: 'password123',
    phone: '0398765432',
    role: 'donor',
    avatar: 'https://i.pravatar.cc/150?img=11',
    address: { province: 'Đà Nẵng', district: 'Hải Châu', detail: '88 Quang Trung' },
    trustScore: { score: 100, totalCompleted: 20 }
  },
  {
    fullName: 'Lê Minh Anh',
    email: 'minhanh@gmail.com',
    passwordHash: 'password123',
    phone: '0901234567',
    role: 'donor',
    avatar: 'https://i.pravatar.cc/150?img=1',
    address: { province: 'Đà Nẵng', district: 'Hải Châu', detail: '123 Phan Châu Trinh' },
    trustScore: { score: 95, totalCompleted: 15 }
  },
  {
    fullName: 'Trần Thanh Sơn',
    email: 'thanhson@gmail.com',
    passwordHash: 'password123',
    phone: '0907654321',
    role: 'donor',
    avatar: 'https://i.pravatar.cc/150?img=2',
    address: { province: 'Hồ Chí Minh', district: 'Quận 1', detail: '456 Lê Lợi' },
    trustScore: { score: 88, totalCompleted: 8 }
  },
  {
    fullName: 'Nguyễn Thị Hương',
    email: 'huongnguyen@gmail.com',
    passwordHash: 'password123',
    phone: '0912345678',
    role: 'donor',
    avatar: 'https://i.pravatar.cc/150?img=3',
    address: { province: 'Hà Nội', district: 'Hoàn Kiếm', detail: '789 Tràng Tiền' },
    trustScore: { score: 92, totalCompleted: 12 }
  },
  {
    fullName: 'Phạm Hồng Quân',
    email: 'hongquan@gmail.com',
    passwordHash: 'password123',
    phone: '0987654321',
    role: 'receiver',
    avatar: 'https://i.pravatar.cc/150?img=4',
    address: { province: 'Đà Nẵng', district: 'Ngũ Hành Sơn', detail: '321 Lê Văn Hiến' },
    trustScore: { score: 75, totalCompleted: 3 }
  }
];

const posts = [
  {
    title: 'Cơm chiên Dương Châu - 5 phần',
    description: 'Cơm mới nấu sáng nay, dư do tiệc gia đình. Đảm bảo sạch sẽ, ngon miệng.',
    category: 'cooked',
    quantity: 5,
    unit: 'portion',
    expirationDate: new Date(Date.now() + 6 * 3600000), // +6h
    location: {
      province: 'Đà Nẵng',
      district: 'Hải Châu',
      detail: '123 Phan Châu Trinh',
      coordinates: { type: 'Point', coordinates: [108.2208, 16.0678] }
    },
    images: ['https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=800'],
    status: 'active'
  },
  {
    title: 'Rau cải xanh hữu cơ',
    description: 'Rau vườn nhà mới hái, số lượng nhiều ăn không hết. Tặng cho ai cần.',
    category: 'raw',
    quantity: 2,
    unit: 'kg',
    expirationDate: new Date(Date.now() + 48 * 3600000), // +2 days
    location: {
      province: 'Đà Nẵng',
      district: 'Thanh Khê',
      detail: '88 Nguyễn Tất Thành',
      coordinates: { type: 'Point', coordinates: [108.2114, 16.0741] }
    },
    images: ['https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800'],
    status: 'active'
  },
  {
    title: 'Bánh mì sandwich nguyên cám',
    description: 'Còn 3 bịch chưa khui, HSD đến cuối tuần này.',
    category: 'packaged',
    quantity: 3,
    unit: 'box',
    expirationDate: new Date(Date.now() + 72 * 3600000), // +3 days
    location: {
      province: 'Hồ Chí Minh',
      district: 'Quận 1',
      detail: 'Bùi Viện',
      coordinates: { type: 'Point', coordinates: [106.6948, 10.7674] }
    },
    images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800'],
    status: 'active'
  },
  {
    title: 'Trái cây mix (Táo, Cam)',
    description: 'Thanh lý sạp trái cây cuối ngày, vẫn còn rất tươi.',
    category: 'raw',
    quantity: 10,
    unit: 'item',
    expirationDate: new Date(Date.now() + 24 * 3600000), // +1 day
    location: {
      province: 'Hà Nội',
      district: 'Ba Đình',
      detail: 'Chợ Long Biên',
      coordinates: { type: 'Point', coordinates: [105.8493, 21.0396] }
    },
    images: ['https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=800'],
    status: 'active'
  },
  {
    title: 'Sữa tươi tiệt trùng',
    description: 'Nửa lốc sữa (6 hộp), do bé nhà không uống nữa.',
    category: 'packaged',
    quantity: 6,
    unit: 'item',
    expirationDate: new Date(Date.now() + 120 * 3600000), // +5 days
    location: {
      province: 'Đà Nẵng',
      district: 'Cẩm Lệ',
      detail: 'Cách mạng tháng 8',
      coordinates: { type: 'Point', coordinates: [108.2132, 16.0214] }
    },
    images: ['https://images.unsplash.com/photo-1550583724-b2641225c5e2?auto=format&fit=crop&q=80&w=800'],
    status: 'active'
  }
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    console.log('Cleaning existing data...');
    await User.deleteMany({});
    await FoodPost.deleteMany({});
    await Request.deleteMany({});
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Data cleaned.');

    console.log('Seeding users...');
    const savedUsers = [];
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
      savedUsers.push(newUser);
    }
    console.log(`${savedUsers.length} users created.`);

    console.log('Seeding posts...');
    for (let i = 0; i < posts.length; i++) {
      // Distribute posts among the created donors
      const donor = savedUsers[i % 4]; // Distribute among first 4 users (donors)
      const postData = { ...posts[i], donorId: donor._id };
      const newPost = new FoodPost(postData);
      await newPost.save();
    }
    console.log(`${posts.length} posts created.`);

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
