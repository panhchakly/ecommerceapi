const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('successfully connected to MongoDB!');
    } catch (error) {
        console.log(`result error: ${error}`)
    }
}

connection().catch(console.dir);
