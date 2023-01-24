export interface CollectSightingsDBResponse {
  data: [BirdiUserSighting] | null;
  error: null | String;
}

export interface BirdiUserSighting {
  _id: String;
  comName: String;
  sciName: String;
  userID: String;
  userEmail: String;
  url: String;
  obsDt: String;
  lat: Number;
  lng: Number;
  __v: Number;
  [key: string]: any;
}

export interface UserData {
  email: String;
  __v: Number;
  _id: String;
  birdSightingsIds: Number[];
}

export interface SendBirdSightingsToDBResult {
  result: BirdiUserSighting;
  userResult: UserData;
}
