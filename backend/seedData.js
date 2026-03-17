const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Note = require('./models/Note');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();

    await Note.deleteMany();
    await User.deleteMany();

    const createdUser = await User.create({
      name: 'Admin User',
      email: 'admin@studyhub.com',
      password: 'password123',
      role: 'admin'
    });

    const adminId = createdUser._id;

    const allNotes = [
      { title: "Operating System Complete Notes", subject: "Computer Science", college: "GEC Surat", price: 49, rating: 4.8, downloads: 342, authorName: "Rahul S.", semester: 5, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Data Structures & Algorithms Handbook", subject: "Computer Science", college: "NIT Surat", price: 0, rating: 4.9, downloads: 567, authorName: "Priya M.", semester: 3, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Engineering Mathematics III", subject: "Mathematics", college: "SVNIT Surat", price: 29, rating: 4.6, downloads: 231, authorName: "Aman K.", semester: 3, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Digital Electronics Lab Manual", subject: "Electronics", college: "GEC Surat", price: 19, rating: 4.5, downloads: 178, authorName: "Sneha P.", semester: 4, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Thermodynamics Lecture Notes", subject: "Mechanical", college: "LDCE Ahmedabad", price: 39, rating: 4.3, downloads: 145, authorName: "Karan D.", semester: 4, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Organic Chemistry Complete Guide", subject: "Chemistry", college: "MSU Baroda", price: 0, rating: 4.7, downloads: 289, authorName: "Meera T.", semester: 2, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Computer Networks Notes", subject: "Computer Science", college: "GEC Surat", price: 59, rating: 4.4, downloads: 198, authorName: "Vivek R.", semester: 6, author: adminId, fileUrl: "/uploads/mock.pdf" },
      { title: "Linear Algebra Made Easy", subject: "Mathematics", college: "NIT Surat", price: 25, rating: 4.8, downloads: 312, authorName: "Anita B.", semester: 1, author: adminId, fileUrl: "/uploads/mock.pdf" },
    ];

    await Note.insertMany(allNotes);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
