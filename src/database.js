import mongoose from 'mongoose';

export async function databaseConnector(databaseURL){
    await mongoose.connect(databaseURL)
}

export async function databaseDisconnector(){
    await mongoose.connection.close()
}