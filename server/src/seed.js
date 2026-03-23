import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import FoodPost from './models/FoodPost.js';
import connectDB from './config/db.js';

dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();

    console.log('Clearing old data...');
    await FoodPost.deleteMany({});
    
    // Check for existing user, or create one
    let donor = await User.findOne({});
    if (!donor) {
      console.log('No user found, creating a dummy donor...');
      donor = await User.create({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        passwordHash: 'dummy_hash',
        role: 'donor',
      });
    }

    console.log('Generating realistic mock posts...');
    
    const mockPosts = [
      {
        donorId: donor._id,
        title: 'Cơm tấm sườn bì chả còn rất ngon',
        description: 'Mình mua dư hộp cơm tấm sườn bì chả lúc 11h, đồ ăn còn nóng nguyên chưa đụng đũa nhé!',
        category: 'cooked',
        quantity: 1,
        unit: 'box',
        availableQuantity: 1,
        expirationDate: new Date(Date.now() + 6 * 60 * 60 * 1000), // In 6 hours
        location: {
          detail: '123 Đường Điện Biên Phủ, Thanh Khê, Đà Nẵng',
          coordinates: {
            type: 'Point',
            coordinates: [108.2014, 16.0682] // Đà Nẵng approx
          }
        },
        locationText: '123 Đường Điện Biên Phủ, Thanh Khê, Đà Nẵng', // For frontend compatibility if needed
        images: ['https://images.unsplash.com/photo-1541580621-1b1574d32d3d?q=80&w=600&auto=format&fit=crop'],
        status: 'active',
        createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
      },
      {
        donorId: donor._id,
        title: 'Rau xanh dư dùng',
        description: 'Mua rau chuẩn bị nấu lẩu nhưng dư nhiều rau xà lách, ngò, rau thơm. Đã rửa sạch, đảm bảo vệ sinh.',
        category: 'raw',
        quantity: 3,
        unit: 'kg',
        availableQuantity: 3,
        expirationDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // In 48 hours
        location: {
          detail: 'Quận Hải Châu, Đà Nẵng',
          coordinates: {
            type: 'Point',
            coordinates: [108.2208, 16.0678]
          }
        },
        locationText: 'Quận Hải Châu, Đà Nẵng',
        images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?q=80&w=600&auto=format&fit=crop'],
        status: 'active',
        createdAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hr ago
      },
      {
        donorId: donor._id,
        title: 'Bánh mì nướng kẹp chả',
        description: 'Bánh mì nướng ăn sáng nhưng dư 2 ổ. Mình bảo quản hộp đàng hoàng chưa cắn hạt nào.',
        category: 'cooked',
        quantity: 2,
        unit: 'item',
        availableQuantity: 2,
        expirationDate: new Date(Date.now() + 10 * 60 * 60 * 1000),
        location: {
          detail: 'Sơn Trà, Đà Nẵng',
          coordinates: {
            type: 'Point',
            coordinates: [108.2435, 16.0825]
          }
        },
        locationText: 'Sơn Trà, Đà Nẵng',
        images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1550508139-f9c1db89d535?q=80&w=600&auto=format&fit=crop'],
        status: 'active',
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hr ago
      },
      {
        donorId: donor._id,
        title: 'Snack khoai tây Oishi',
        description: 'Bánh snack khoai tây chưa mở lốc, hạn sử dụng còn 6 tháng. Cho bạn nào thích ăn vặt.',
        category: 'packaged',
        quantity: 5,
        unit: 'item',
        availableQuantity: 5,
        expirationDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 months
        location: {
          detail: 'Ngũ Hành Sơn, Đà Nẵng',
          coordinates: {
            type: 'Point',
            coordinates: [108.2513, 16.0125]
          }
        },
        locationText: 'Ngũ Hành Sơn, Đà Nẵng',
        images: ['https://images.unsplash.com/photo-1599490659213-e2b9527bd087?q=80&w=600&auto=format&fit=crop'],
        status: 'active',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      }
    ];

    await FoodPost.insertMany(mockPosts);
    console.log('Seed successful! 4 food posts added.');
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
