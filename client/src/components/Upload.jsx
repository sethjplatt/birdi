import {
  Box,
  Container,
  Text,
  Input,
  SimpleGrid,
  Button,
  Card,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { sendBirdSightingToDB } from '../API/dbFunctions.ts';

import Map from './Map';
import Navbar from './Navbar';

export default function Upload() {
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const nav = useNavigate();

  const userInfo = useSelector((state) => state.userInfo);
  const SelectedBirdOnExplore = useSelector(
    (state) => state.SelectedBirdOnExplore
  );
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();
    setBtnLoading(true);
    let formData = new FormData(e.target);
    formData.set('comName', formData.get('comName'));
    formData.set('sciName', formData.get('sciName'));
    formData.set('obsDt', formData.get('obsDt').replace('T', ' ')); //formatting the date
    formData.set('lat', lat);
    formData.set('lng', lng);
    formData.set('userID', userInfo._id);
    formData.set('userEmail', userInfo.email);
    formData.append('file', formData.get('file')[0]);
    console.log('bird data sent');
    const res = await sendBirdSightingToDB(formData);
    console.log('db response', res);
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
            onSubmit={(e) => handleSubmit(e)}
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
