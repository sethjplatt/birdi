export interface CollectSightingsDBResponse {
  data: [BirdiUserSighting] | null;
  error: null | string;
}

export interface BirdiUserSighting {
  _id: string;
  comName: string;
  sciName: string;
  userID: string;
  userEmail: string;
  url: string;
  obsDt: string;
  lat: number;
  lng: number;
  __v: number;
  [key: string]: any;
}

export interface UserData {
  email: string;
  __v: number;
  _id: string;
  birdSightingsIds: string[];
}

export interface SendBirdSightingsToDBResult {
  result: BirdiUserSighting;
  userResult: UserData;
}
