import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Container,
  SimpleGrid,
  GridItem,
  Card,
  CardBody,
  Avatar,
  Text,
} from '@chakra-ui/react';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useState } from 'react';
import { useEffect } from 'react';
import { CollectUserInfoFromDB } from '../API/dbFunctions.ts';
import ActiveCard from './ActiveCard';

export default function Profile() {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);

  const [pageLoading, setPageLoading] = useState(true);
  const [birdsByUser, setBirdsByUser] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      CollectUserInfoFromDB(user.email).then((user) => {
        // set data in redux
        dispatch({ type: 'UPDATE_USER_INFO', user });
        setBirdsByUser(user.birdSightingsIds || []);
      });
    }
    setPageLoading(false);
  }, []);

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to={'/'} replace />;
  }
  return (
    isAuthenticated && (
      <Box>
        <Container
          minW='85vw'
          p='20px'
          minH='85vh'
          display='flex'
          flexDir='column'
        >
          <Box display='flex' alignSelf='center' maxW='400px' minW='400px'>
            <Card bg='brand.whiteish.def' my='25px' w='100%' textAlign='center'>
              <CardBody pt='70px'>
                <Box>
                  <Avatar
                    pos='absolute'
                    top={-35}
                    left={'150px'}
                    justifySelf='center'
                    alignSelf={'center'}
                    size='xl'
                    src={user.picture}
                    alt={user.name}
                  />
                  <Text>
                    <b>{user.email}</b> has seen {birdsByUser.length} bird
                    {(birdsByUser.length > 1 || birdsByUser.length == 0) && (
                      <>s</>
                    )}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Box>
          <SimpleGrid columns={2} spacing={2}>
            {birdsByUser.length > 0 &&
              birdsByUser.map((bird) => (
                <GridItem>
                  <ActiveCard key={bird._id} bird={bird} profile />
                </GridItem>
              ))}
          </SimpleGrid>
        </Container>
      </Box>
    )
  );
}
