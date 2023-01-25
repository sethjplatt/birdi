import { ObjectId } from 'mongoose';

export interface Sightings {
  _id: ObjectId;
  comName: String;
  sciName: String;
  userID: String;
  userEmail: String;
  obsDt: String;
  url: String;
  lat: Number;
  lng: Number;
  __v: Number;
}
