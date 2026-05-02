const dotenv = require('dotenv');
const mongoose = require('mongoose');
const db = require('../models');

const { User, Consultation, Engagement, Vote } = db;

dotenv.config();
const DB_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/civicvoice_api';

async function createCollectionIfNeeded(model) {
    const collectionName = model.collection.name;
    const exists = await mongoose.connection.db
        .listCollections({ name: collectionName })
        .hasNext();

    if (!exists) {
        await model.createCollection();
        console.log(`Created collection: ${collectionName}`);
    }

    await model.init();
}

exports.dbConnect = async () => {
    try {
        await mongoose.connect(DB_URL);
        console.log('Database connection successful');

        await createCollectionIfNeeded(User);
        await createCollectionIfNeeded(Consultation);
        await createCollectionIfNeeded(Engagement);
        await createCollectionIfNeeded(Vote);

        console.log('Database initialization complete');
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};