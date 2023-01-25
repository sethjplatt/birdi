import {
  Box,
  Container,
  Text,
  Input,
  SimpleGrid,
  Button,
  Card,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendBirdSightingToDB } from '../API/dbFunctions';
import { RootState } from '../index';
import { latLng } from '../Types/MapTypes';


import Map from './Map';

export default function Upload() {
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const nav = useNavigate();

  const userInfo = useSelector((state: RootState) => state.userInfo);

  const dispatch = useDispatch();

  async function handleSubmit(event: Event) {
    event.preventDefault();
    setBtnLoading(true);
    const target: HTMLFormElement = event.target as HTMLFormElement
    let formData = new FormData(target);
    formData.set('comName', formData.get('comName') as string);
    formData.set('sciName', formData.get('sciName') as string);
    formData.set('obsDt', (formData.get('obsDt') as string).replace('T', ' '));
    formData.set('lat', lat);
    formData.set('lng', lng);
    formData.set('userID', userInfo._id as string);
    formData.set('userEmail', userInfo.email as string);
    formData.append('file', formData.get('file') as File);
    // formData.append('file', formData.get('file')[0] as File);
    const res = await sendBirdSightingToDB(formData);
    dispatch({ type: 'UPDATE_EXPLORE_BIRD', bird: res.result });
    return nav('/', { state: { uploaded: res.result } });
  }

  return (
    <Box>
      <Container
        minW='2xl'
        bg='brand.darkish2'
        overflow='hidden'
        display='flex'
        flexDir='column'
        justifyContent='center'
        my='auto'
        pt='50px'
      >
        <Card bg='brand.whiteish.def' px='10px' pt='10px'>
          <form
            onSubmit={(event) => handleSubmit(event as unknown as Event)}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            <SimpleGrid columns={2} spacing={2}>
              <label>Common Name</label>
              <Input
                required
                size='sm'
                type='text'
                name='comName'
                placeholder='Common Name'
                border='1px'
                _hover={{ bg: 'brand.whiteish.hover' }}
              />
              <label>Scientific Name</label>
              <Input
                required
                size='sm'
                type='text'
                name='sciName'
                placeholder='Scientific Name'
                border='1px'
                _hover={{ bg: 'brand.whiteish.hover' }}
              />
              <label>Observed At</label>
              <Input
                _hover={{ bg: 'brand.whiteish.hover' }}
                required
                size='sm'
                type='datetime-local'
                id='obsDt'
                name='obsDt'
                border='1px'
              />
              <label>File</label>
              <Input
                border='1px'
                _hover={{ bg: 'brand.whiteish.hover' }}
                required
                size='sm'
                type='file'
                name='file'
              />
            </SimpleGrid>
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Text as={'b'}>
                lat: {lat.toFixed(4)} &bull; lng: {lng.toFixed(4)}
              </Text>
              <Button
                disabled={btnLoading}
                type='submit'
                bg='brand.darkish'
                color='brand.whiteish.def'
                _hover={{ bg: 'brand.darkish2' }}
                mr='10px'
                my='10px'
              >
                Submit
              </Button>
            </Box>
          </form>
        </Card>
        <Box mt='20px'></Box>
        <Box maxH='80vh'>
          <Map coords={{ setLng, setLat }} dot />
        </Box>
      </Container>
    </Box>
  );
}
