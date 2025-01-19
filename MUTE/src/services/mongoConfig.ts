import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Micaela:Moviles.1234@clustermute.cydgm.mongodb.net/';
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    const db = client.db('MuteApp');
    console.log('Conexión exitosa a MongoDB Atlas');
    return db;
  } catch (error) {
    console.error('Error conectando a MongoDB Atlas:', error);
    throw error;
  }
};
