import {
  SendBirdSightingsToDBResult,
  BirdiUserSighting,
  UserData,
} from '../Types/DbApiTypes';

// █▀ █ █▀▀ █░█ ▀█▀ █ █▄░█ █▀▀ █▀
// ▄█ █ █▄█ █▀█ ░█░ █ █░▀█ █▄█ ▄█

export async function collectBirdLocationsFromDB(): Promise<
  BirdiUserSighting[]
> {
  try {
    const dbRes = await fetch(`http://localhost:3001/sightings`);
    const data = await dbRes.json();
    return data.data;
  } catch (err: any) {
    console.log(err);
    return err;
  }
}

export async function sendBirdSightingToDB(
  docToBeAdded: FormData
): Promise<SendBirdSightingsToDBResult> {
  try {
    const dbRes = await fetch('http://localhost:3001/sightings', {
      method: 'POST',
      body: docToBeAdded,
    });
    const data = await dbRes.json();
    console.log('data in sightingsFromDb', data);
    return data.data;
  } catch (err: any) {
    console.log(err);
    return err;
  }
}

// █░█ █▀ █▀▀ █▀█ █▀
// █▄█ ▄█ ██▄ █▀▄ ▄█

export async function CollectUserInfoFromDB(email: String): Promise<UserData> {
  try {
    const userDataFromdb = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await userDataFromdb.json();
    return data.data;
  } catch (err: any) {
    console.log(err);
    return err;
  }
}
