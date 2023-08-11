/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import SignUp from './components/SignUp';
import Map from './components/Map/Map';
import Feed from './components/Feed/Feed';
import WebcamDisplay from './components/CreateReel/WebcamDisplay';
import Navigation from './components/Navigation';
import './global.css';
import SignUp from './components/ProfileSetUp/SignUp';
import ProfileSetUp from './components/ProfileSetUp/ProfileSetUp';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AddFriend from './components/AddFriend';

type User = {
  id: number;
  username: string;
  displayName: string;
  type: string;
  geolocation: string; // i.e. "29.947126049254177, -90.18719199978266"
  mapIcon: string;
  birthday: string;
  privacy: string;
  accessibility: string;
  email: string;
  picture: string;
  googleId: string;
};



const App = () => {
  // get all users to pass down as props
  const [user, setUser] = useState<User>(null);

  const fetchAuthUser = async () => {
    try {
      const response = await axios.get(`/users/user`);
      if (response && response.data && user === null) {
        setUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAuthUser();
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<SignUp />}></Route>
        <Route path='/' element={<Navigation />}>
          <Route path='/ProfileSetUp' element={<ProfileSetUp />}></Route>
          <Route path='/Feed' element={<Feed user={user} AddFriend={<AddFriend />} />}></Route>
          <Route path='/Map' element={<Map loggedIn={user} />}></Route>
          <Route path='/WebcamDisplay' element={<WebcamDisplay />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
