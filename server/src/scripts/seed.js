import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import FoodPost from '../models/FoodPost.js';
import bcrypt from 'bcryptjs';

dotenv.config();

// Da Nang center coordinates (approx)
const CENTER_LNG = 108.2208;
const CENTER_LAT = 16.0678;

// Function to generate random coordinates within ~15km of Da Nang center
const getRandomCoordinates = () => {
  // ~1km = 0.009 degrees
  const radius = 0.135; // ~15km
  
  const w = radius * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  const x = w * Math.cos(t);
  const y = w * Math.sin(t) / Math.cos(CENTER_LAT * Math.PI / 180);

  return [CENTER_LNG + x, CENTER_LAT + y];
};

const getFutureDate = (hours) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

const getPastDate = (hours) => {
  return new Date(Date.now() - hours * 60 * 60 * 1000);
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_sharing_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    // Clear existing data to avoid duplicates for testing
    console.log('Clearing existing FoodPosts for clean slate...');
    await FoodPost.deleteMany({});
    
    // Check if we need to create users
    let users = await User.find({}).limit(3);
    
    if (users.length < 3) {
      console.log('Not enough users found, creating some test users...');
      await User.deleteMany({});
      
      const pwdHashed = await bcrypt.hash('123456', 10);
      users = await User.create([
        { fullName: 'Minh Tuấn', email: 'tuan@example.com', passwordHash: pwdHashed, phone: '0901234567', avatar: 'https://i.pravatar.cc/150?img=11' },
        { fullName: 'Bích Phương', email: 'phuong@example.com', passwordHash: pwdHashed, phone: '0901234568', avatar: 'https://i.pravatar.cc/150?img=5' },
        { fullName: 'Hải Đăng', email: 'dang@example.com', passwordHash: pwdHashed, phone: '0901234569', avatar: 'https://i.pravatar.cc/150?img=12' },
      ]);
      console.log('Users created successfully');
    }

    const testPosts = [
      {
        donorId: users[0]._id,
        title: 'Cơm Gạo Lứt & Rau Củ',
        description: 'Phần cơm thập cẩm chay, tốt cho sức khỏe. Đồ ăn còn rất mới vừa lấy từ nhà hàng về.',
        category: 'cooked',
        quantity: 2,
        unit: 'portion',
        expirationDate: getFutureDate(5), // 5 hours in future
        location: {
          province: 'Da Nang',
          district: 'Hai Chau',
          detail: '254 Nguyen Van Linh',
          coordinates: {
            type: 'Point',
            coordinates: [CENTER_LNG + 0.002, CENTER_LAT + 0.002] // Very close
          }
        },
        images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'],
        createdAt: getPastDate(1), // created 1 hour ago
      },
      {
        donorId: users[1]._id,
        title: 'Salad Ức Gà Áp Chảo',
        description: 'Salad healthy cho bữa trưa. Sắp hết hạn nên mình tặng nhanh nhé!',
        category: 'cooked',
        quantity: 1,
        unit: 'box',
        expirationDate: getFutureDate(1), // Expiring SOON - 1 hour
        location: {
          province: 'Da Nang',
          district: 'Son Tra',
          detail: '12 Vo Nguyen Giap',
          coordinates: {
            type: 'Point',
            coordinates: [CENTER_LNG + 0.03, CENTER_LAT + 0.01] // Further away
          }
        },
        images: ['https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'],
        createdAt: getPastDate(2),
      },
      {
        donorId: users[2]._id,
        title: 'Bánh mì thịt siêu to khổng lồ',
        description: 'Vừa mua nhưng có việc bận không ăn đến.',
        category: 'cooked',
        quantity: 3,
        unit: 'item',
        expirationDate: getFutureDate(10), // 10 hours
        location: {
          province: 'Da Nang',
          district: 'Thanh Khe',
          detail: '78 Nguyen Tat Thanh',
          coordinates: {
            type: 'Point',
            coordinates: [CENTER_LNG - 0.02, CENTER_LAT + 0.03] // Far
          }
        },
        images: ['https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800'],
        createdAt: new Date(), // Just now (newest)
      },
      {
        donorId: users[0]._id,
        title: 'Thực phẩm hết hạn',
        description: 'Bài này không nên hiển thị trong feed',
        category: 'raw',
        quantity: 1,
        unit: 'kg',
        expirationDate: getPastDate(2), // Already expired
        status: 'expired',
        location: { coordinates: { type: 'Point', coordinates: [CENTER_LNG, CENTER_LAT] } }
      },
      {
        donorId: users[1]._id,
        title: '5kg Gạo ST25',
        description: 'Gạo mới thu hoạch',
        category: 'raw',
        quantity: 5,
        unit: 'kg',
        expirationDate: getFutureDate(24 * 30), // 30 days
        location: {
          coordinates: { type: 'Point', coordinates: getRandomCoordinates() }
        },
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=800'],
        createdAt: getPastDate(24) // 1 day ago
      },
      ...Array.from({ length: 12 }).map((_, i) => ({
        donorId: users[i % 3]._id,
        title: `Phần ăn chay #${i + 1}`,
        description: 'Thức ăn chay nhà làm dư dùng nên chia sẻ',
        category: 'cooked',
        quantity: 1,
        unit: 'portion',
        expirationDate: getFutureDate(3 + Math.random() * 20), 
        location: {
          coordinates: { type: 'Point', coordinates: getRandomCoordinates() }
        },
        images: ['https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=800'],
        createdAt: getPastDate(i + 3)
      }))
    ];

    await FoodPost.insertMany(testPosts);
    console.log(`Successfully created ${testPosts.length} food posts!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
