import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  role: 'warehouse' | 'factory';
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['warehouse', 'factory'],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  phone: {
    type: String,
  },
}, {
  timestamps: true,
});

export const User = mongoose.model<IUser>('User', userSchema);
