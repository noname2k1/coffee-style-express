import mongoose from 'mongoose';

const connectToMongodb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('connected to mongodb');
    } catch (error) {
        throw new Error('error: ' + error);
    }
};

export default connectToMongodb;
