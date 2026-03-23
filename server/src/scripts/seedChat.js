import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import FoodPost from '../models/FoodPost.js';
import Request from '../models/Request.js';
import Transaction from '../models/Transaction.js';
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

dotenv.config();

const getPastDate = (minutes) => new Date(Date.now() - minutes * 60 * 1000);

const seedChat = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_sharing_db';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');

    // ─── 1. CLEAR OLD CHAT DATA ───────────────────────────────────────────────
    await Message.deleteMany({});
    await Conversation.deleteMany({});
    await Transaction.deleteMany({});
    await Request.deleteMany({});
    console.log('🗑️  Cleared old chat data');

    // ─── 2. ENSURE USERS EXIST ────────────────────────────────────────────────
    let users = await User.find({}).limit(3);
    if (users.length < 3) {
      await User.deleteMany({});
      const pwdHashed = await bcrypt.hash('123456', 10);
      users = await User.create([
        {
          fullName: 'Minh Tuấn',
          email: 'tuan@example.com',
          passwordHash: pwdHashed,
          phone: '0901234567',
          avatar: 'https://i.pravatar.cc/150?img=11',
        },
        {
          fullName: 'Bích Phương',
          email: 'phuong@example.com',
          passwordHash: pwdHashed,
          phone: '0901234568',
          avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
          fullName: 'Hải Đăng',
          email: 'dang@example.com',
          passwordHash: pwdHashed,
          phone: '0901234569',
          avatar: 'https://i.pravatar.cc/150?img=12',
        },
      ]);
      console.log('👤 Created 3 test users');
    } else {
      console.log(`👤 Using ${users.length} existing users`);
    }

    const [userA, userB, userC] = users;

    // ─── 3. ENSURE FOOD POSTS EXIST ──────────────────────────────────────────
    let posts = await FoodPost.find({}).limit(2);
    if (posts.length < 2) {
      posts = await FoodPost.create([
        {
          donorId: userA._id,
          title: 'Cơm Gạo Lứt & Rau Củ',
          description: 'Phần cơm chay còn mới, vừa lấy từ nhà hàng về.',
          category: 'cooked',
          quantity: 2,
          unit: 'portion',
          expirationDate: new Date(Date.now() + 5 * 3600 * 1000),
          location: {
            province: 'Da Nang',
            district: 'Hai Chau',
            detail: '254 Nguyen Van Linh',
            coordinates: { type: 'Point', coordinates: [108.222, 16.068] },
          },
          images: [
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
          ],
        },
        {
          donorId: userA._id,
          title: 'Bánh Mì Thịt Siêu To',
          description: 'Mua nhiều không ăn hết, chia sẻ nè.',
          category: 'cooked',
          quantity: 3,
          unit: 'item',
          expirationDate: new Date(Date.now() + 10 * 3600 * 1000),
          location: {
            province: 'Da Nang',
            district: 'Thanh Khe',
            detail: '78 Nguyen Tat Thanh',
            coordinates: { type: 'Point', coordinates: [108.21, 16.07] },
          },
          images: [
            'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&q=80&w=800',
          ],
        },
      ]);
      console.log('🍱 Created 2 food posts');
    } else {
      console.log(`🍱 Using ${posts.length} existing food posts`);
    }

    const [postA, postB] = posts;

    // ─── 4. CREATE REQUESTS ────────────────────────────────────────────────────
    // 2 active/accepted + 3 completed (for impact stats & chart)
    const now = new Date();
    const monthsAgo = (n) => new Date(now.getFullYear(), now.getMonth() - n, 15);

    const [reqA, reqB] = await Request.create([
      {
        postId: postA._id,
        donorId: userA._id,
        receiverId: userB._id,
        requestedQty: 1,
        message: 'Mình muốn nhận phần cơm này, cảm ơn bạn!',
        status: 'accepted',
      },
      {
        postId: postB._id,
        donorId: userA._id,
        receiverId: userC._id,
        requestedQty: 2,
        message: 'Cho mình xin 2 cái bánh mì nhé!',
        status: 'accepted',
      },
    ]);

    // Completed requests — spread across past 4 months for chart
    // insertMany with timestamps:false preserves backdated dates
    await Request.insertMany([
      {
        postId: postA._id,
        donorId: userA._id,
        receiverId: userB._id,
        requestedQty: 2,
        status: 'completed',
        createdAt: monthsAgo(3),
        updatedAt: monthsAgo(3),
      },
      {
        postId: postB._id,
        donorId: userA._id,
        receiverId: userC._id,
        requestedQty: 3,
        status: 'completed',
        createdAt: monthsAgo(2),
        updatedAt: monthsAgo(2),
      },
      {
        postId: postA._id,
        donorId: userA._id,
        receiverId: userB._id,
        requestedQty: 1,
        status: 'completed',
        createdAt: monthsAgo(1),
        updatedAt: monthsAgo(1),
      },
      {
        postId: postB._id,
        donorId: userA._id,
        receiverId: userC._id,
        requestedQty: 2,
        status: 'completed',
        createdAt: monthsAgo(0),
        updatedAt: monthsAgo(0),
      },
    ], { timestamps: false });

    // Award EXP to donor (4 completed × 50 EXP = 200 EXP → Level 2)
    await User.findByIdAndUpdate(userA._id, { $set: { exp: 200 } });

    console.log('📋 Created 2 active + 4 completed requests, awarded 200 EXP to donor');

    // ─── 5. CREATE TRANSACTIONS ───────────────────────────────────────────────
    const [txA, txB] = await Transaction.create([
      {
        requestId: reqA._id,
        postId: postA._id,
        donorId: userA._id,
        receiverId: userB._id,
        quantity: 1,
        unit: 'portion',
        status: 'active',
      },
      {
        requestId: reqB._id,
        postId: postB._id,
        donorId: userA._id,
        receiverId: userC._id,
        quantity: 2,
        unit: 'item',
        status: 'active',
      },
    ]);
    console.log('💳 Created 2 transactions');

    // ─── 6. CREATE CONVERSATIONS ──────────────────────────────────────────────
    const [convA, convB] = await Conversation.create([
      {
        transactionId: txA._id,
        donorId: userA._id,
        receiverId: userB._id,
        status: 'open',
        lastMessage: {
          content: 'Bạn có thể lấy lúc 12h trưa được không?',
          senderId: userA._id,
          sentAt: getPastDate(5),
        },
      },
      {
        transactionId: txB._id,
        donorId: userA._id,
        receiverId: userC._id,
        status: 'open',
        lastMessage: {
          content: 'Mình sẽ đến lúc 3h chiều nha!',
          senderId: userC._id,
          sentAt: getPastDate(2),
        },
      },
    ]);
    console.log('💬 Created 2 conversations');

    // ─── 7. CREATE MESSAGES ───────────────────────────────────────────────────
    // Conversation A: Tuấn (donor) ↔ Phương (receiver)
    await Message.create([
      {
        conversationId: convA._id,
        senderId: userB._id,
        content: 'Chào bạn! Mình muốn nhận phần cơm này ạ.',
        isRead: true,
        createdAt: getPastDate(60),
      },
      {
        conversationId: convA._id,
        senderId: userA._id,
        content: 'Chào Phương! Bạn có thể đến lấy tại 254 Nguyễn Văn Linh nhé.',
        isRead: true,
        createdAt: getPastDate(55),
      },
      {
        conversationId: convA._id,
        senderId: userB._id,
        content: 'Ok bạn ơi, khoảng mấy giờ thì tiện?',
        isRead: true,
        createdAt: getPastDate(40),
      },
      {
        conversationId: convA._id,
        senderId: userA._id,
        content: 'Bạn có thể lấy lúc 12h trưa được không?',
        isRead: false,
        createdAt: getPastDate(5),
      },
    ]);

    // Conversation B: Tuấn (donor) ↔ Đăng (receiver)
    await Message.create([
      {
        conversationId: convB._id,
        senderId: userC._id,
        content: 'Hi bạn! Bánh mì còn không? Cho mình xin 2 cái nha.',
        isRead: true,
        createdAt: getPastDate(90),
      },
      {
        conversationId: convB._id,
        senderId: userA._id,
        content: 'Còn nha Đăng! Bạn đến lấy ở 78 Nguyễn Tất Thành nhé.',
        isRead: true,
        createdAt: getPastDate(80),
      },
      {
        conversationId: convB._id,
        senderId: userC._id,
        content: 'Ok bạn. Địa chỉ đó ở quận mấy vậy?',
        isRead: true,
        createdAt: getPastDate(70),
      },
      {
        conversationId: convB._id,
        senderId: userA._id,
        content: 'Thanh Khê nha, gần đường lớn rất dễ tìm.',
        isRead: true,
        createdAt: getPastDate(60),
      },
      {
        conversationId: convB._id,
        senderId: userC._id,
        content: 'Mình sẽ đến lúc 3h chiều nha!',
        isRead: false,
        createdAt: getPastDate(2),
      },
    ]);

    console.log('✉️  Created messages for all conversations');

    // ─── SUMMARY ─────────────────────────────────────────────────────────────
    console.log('\n============================');
    console.log('✅ CHAT SEED COMPLETE!');
    console.log('============================');
    console.log('Test accounts (password: 123456):');
    console.log(`  👤 Donor   : tuan@example.com    (id: ${userA._id})`);
    console.log(`  👤 Receiver: phuong@example.com  (id: ${userB._id})`);
    console.log(`  👤 Receiver: dang@example.com    (id: ${userC._id})`);
    console.log('\nConversations:');
    console.log(`  💬 Conv A (Tuấn ↔ Phương): id=${convA._id}`);
    console.log(`  💬 Conv B (Tuấn ↔ Đăng):   id=${convB._id}`);
    console.log('============================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedChat();
