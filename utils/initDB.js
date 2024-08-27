import mongoose from "mongoose";

export const connectToDB = async () => {
  const MONGO_URI = process.env.MONGO_URI || "";
  const DB_NAME = process.env.DB_NAME || "";
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: DB_NAME,
    });
    console.log("DB connection successfull");
  } catch (error) {
    console.log("Error connecting db", error);
  }
};
