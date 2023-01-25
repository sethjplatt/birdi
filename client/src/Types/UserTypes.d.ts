import { ObjectId } from 'mongoose';

export interface User {
  _id: ObjectId;
  email: String;
  birdSightingsIds: [ObjectId];
  __v: Number;
}

