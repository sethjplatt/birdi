// Remove unused variables
import {
  Box,
  Card,
  CardBody,
  Stack,
  Skeleton,
  Heading,
  Image,
  Text,
  CircularProgress,
  Divider,
  WrapItem,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { collectInfoFromWiki } from '../API/wikiApiFunctions.ts';
import { TfiMore } from 'react-icons/tfi';

export default function ActiveCard({ bird, profile }) {
  const [cardState, setCardState] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const imgSizing = profile ? '190px' : '150px';

  useEffect(() => {
    setLoading(true);
    async function birdInfoCollection() {
      const { imgUrl, info } = await collectInfoFromWiki(bird.sciName);
      setCardState({
        info,
        imgUrl: bird.url || imgUrl, //||'https://upload.wikimedia.org/wikipedia/commons/b/bc/Valk_Segelzeichen.svg'
      });
      setLoading(false);
    }
    birdInfoCollection();
  }, [bird]);

  return (
    <>
      {loading ? (
        <Card
          minH='180px'
          maxH='180px'
          pb='10px'
          h='100%'
          bg='brand.whiteish.def'
          direction='row'
          overflow='hidden'
          variant='outline'
        >
          <Box
            maxW={imgSizing}
            minW={imgSizing}
            maxH={imgSizing}
            minH={imgSizing}
          >
            <CircularProgress
              size={imgSizing}
              isIndeterminate
              color='brand.darkish'
            />
          </Box>
          <CardBody p='0' px='10px' py='5px'>
            <Stack>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </CardBody>
        </Card>
      ) : (
        <>
          <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent bg='brand.whiteish.def'>
              <ModalHeader textAlign='center'>
                {bird.comName} &bull;{' '}
                <span style={{ color: 'gray' }}>{bird.sciName}</span>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody display='flex' flexDir='column'>
                <Box margin='auto' px='20px' pb='20px'>
                  <Image
                    objectFit='cover'
                    w='200px'
                    h='200px'
                    src={cardState.imgUrl}
                    alt={bird.comName}
                  />
                </Box>
                <Divider />
                {cardState.info}
              </ModalBody>
            </ModalContent>
          </Modal>
          <Card
            bg='brand.whiteish.def'
            direction='row'
            overflow='hidden'
            variant='outline'
            data-testid='active-card'
          >
            <Box maxW={imgSizing}>
              <Image
                objectFit='cover'
                maxW={imgSizing}
                minW={imgSizing}
                maxH={imgSizing}
                minH={imgSizing}
                src={cardState.imgUrl}
                alt={bird.comName}
              />
              <Divider />
              <Text data-testid='active-seen-at' as='sub' size='xs'>
                Seen at {bird.obsDt}
              </Text>
            </Box>
            <CardBody p='0' pl='5px' pt='5px'>
              <Heading data-testid='active-com-name' size='sm'>
                {bird.comName} &bull;{' '}
                <span data-testid='active-sci-name' style={{ color: 'gray' }}>
                  {bird.sciName}
                </span>{' '}
              </Heading>
              <Text
                data-testid='active-short-info'
                py='1'
                noOfLines={profile ? 7 : 4}
              >
                {cardState.info}
              </Text>
              <Divider color='black' />
              <Box display='flex' alignItems='center' pr='5px'>
                {bird.userEmail && (
                  <Text display='inline'>
                    Seen by: <b>{bird.userEmail}</b>
                  </Text>
                )}
                {/* User can press the icon below to see more information in the modal*/}
                <Box
                  onClick={onOpen}
                  ml='auto'
                  justifySelf='end'
                  cursor='pointer'
                >
                  <TfiMore />
                </Box>
              </Box>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
}
