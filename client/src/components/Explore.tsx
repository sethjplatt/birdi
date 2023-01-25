import React, { useEffect, useState } from 'react';
import Map from './Map';
import List from './List';
import ActiveCard from './ActiveCard';
import { collectBirdLocationsFromAPI } from '../API/eBirdApiFunctions';
import { collectBirdLocationsFromDB } from '../API/dbFunctions';
import { RootState } from '../index';
import { BirdiUserSighting } from '../Types/DbApiTypes';
import { EBird } from '../Types/EBirdTypes';

import { Box, Container, Card, Heading, Spinner } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

export default function Explore() {
  const SelectedBirdOnExplore = useSelector(
    (state: RootState) => state.SelectedBirdOnExplore
  );
  console.log('SelectedBirdOnExplore', SelectedBirdOnExplore);

  const [data, setData] = useState<(EBird[] | BirdiUserSighting[])[]>([]); // list of lists : [apiData, dbData]

  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [loading, setLoading] = useState(true);

  // initial data collect
  useEffect(() => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        await handleRecollect(pos.coords.longitude, pos.coords.latitude);
      });
    } else {
      handleRecollect(0, 0);
    }
  }, []);

  async function handleRecollect(lng: Number, lat: Number) {
    try {
      const APIData: EBird[] = await collectBirdLocationsFromAPI(lng, lat);
      const dbData: BirdiUserSighting[] = await collectBirdLocationsFromDB();

      const newArr: EBird[] = [];
      // const newArr= [] as [EBird | BirdiUserSighting]

      if (!dbData || !APIData) return;
      // The following forloop runs through (up to) 100 sightings and collects
      // the first sighting with unique coordinates(lat,lng), and pushes it
      // to 'newArr'. This is done so that there isn't a bunch of marks ontop
      // of eachother on map render. Optimization that helps map be less slow/laggy
      for (let i = 0; i < APIData.length; i++) {
        if (
          newArr.find(
            (x) => x.lat === APIData[i].lat && x.lng === APIData[i].lng
          )
        ) {
        } else {
          newArr.push(APIData[i]);
        }
      }
      newArr.forEach((bird, i) => {
        bird.id = i;
      });
      dbData.forEach((bird, i) => {
        bird.id = i + newArr.length; // to make sure there are no duplicates
      });
      // Sort by observed at
      console.log('[newArr, dbData]', [newArr, dbData]);
      setData([newArr, dbData]);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Container
        display='flex'
        bg='brand.darkish2'
        minW='85vw'
        p='20px'
        maxH='87vh'
      >
        <Box
          className='left-side'
          w='35%'
          display='flex'
          flexDir='column'
          maxH='90vh'
          pb='2px'
          pr='3px'
        >
          <Box minH='180px' maxH='180px' pb='10px' pr='10px'>
            {SelectedBirdOnExplore ? (
              <ActiveCard bird={SelectedBirdOnExplore} profile={null} />
            ) : (
              <Card
                data-testid='active-card-placeholder'
                minH='180px'
                maxH='180px'
                pb='10px'
                bg='brand.whiteish.def'
                direction='row'
                variant='outline'
                display='flex'
                alignContent='center'
                justifyContent='center'
              >
                <Heading size='sm' alignSelf='center'>
                  Select a bird to view more information.
                </Heading>
              </Card>
            )}
          </Box>
          <Box maxH='10px' minH='75%' display='flex' flexDir='column' pt='4px'>
            <List data={data} />
          </Box>
        </Box>
        <Box className='right-side' w='65%' maxH='100%' display='flex'>
          {loading ? (
            <Spinner margin='auto' boxSize='250px' />
          ) : (
            <Map
              sightings={data}
              coords={{ setLat, setLng, handleRecollect }}
              dot={null}
            />
          )}
        </Box>
      </Container>
    </>
  );
}
