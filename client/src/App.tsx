import 'mapbox-gl/dist/mapbox-gl.css';

import Explore from './components/Explore';
import Upload from './components/Upload';
import Navbar from './components/Navbar';

import { BrowserRouter } from 'react-router-dom';
import Profile from './components/Profile';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { CollectUserInfoFromDB } from './API/dbFunctions';
import { Box } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      if (user && user.email) {
        CollectUserInfoFromDB(user.email).then((user?) => {
          // set data in redux
          dispatch({ type: 'UPDATE_USER_INFO', user });
        });
      }
    }
  }, [isAuthenticated]);

  return (
    <Box bg='brand.darkish2' className='App' minH='100vh' maxH='100vh'>
      {/* <RouterProvider router={router}/> */}
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Explore />} />
          <Route
            path='/upload'
            element={isAuthenticated ? <Upload /> : <Explore />}
          />
          <Route
            path='/profile'
            element={isAuthenticated ? <Profile /> : <Explore />}
          />
        </Routes>
      </BrowserRouter>
    </Box>
  );
}

export default App;
