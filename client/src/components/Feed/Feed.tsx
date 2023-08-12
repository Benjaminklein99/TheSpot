import * as React from 'react';
import Reel from './Reel';
// import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';

type Props = {
  user: {
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
  AddFriend?: React.ReactNode | React.ReactNode[];
};

const Feed: React.FC<Props> = ({user}) => {
  const [reels, setReels] = useState([]);
  const [filter, setFilter] = useState('reel');
  const [friends, setFriends] = useState([]); // friend list for current user
  const [userLat, setUserLat] = useState(0);
  const [userLong, setUserLong] = useState(0);

  const filters = ['reel', 'recent', 'likes', 'friends', 'location']; // filter options
  const friendsReels: any = [];
  const geoReels: any = [];

  const filterChangeHandler = (event: any) => {
    setFilter(event.target.value);
    console.log('filter:', filter);
  };

  const getAllFriendReels = () => {
    axios
      .get('/feed/recent')
      .then((response) => {
        for (let i = 0; i < friends.length; i++) {
          for (let j = 0; j < response.data.length; j++) {
            if (friends[i].accepter_id === response.data[j].UserId) {
              friendsReels.push(response.data[j]);
            }
          }
        }
        setReels(friendsReels);
      })
      .catch((err) => {
        console.error('Could not GET all frens reels:', err);
      })
  };

  const getAllReels = () => {
    if (filter === 'location') {
      getReelsByLoc();
    } else if (filter === 'friends') {
      getAllFriendReels();
    } else {
      axios
        .get(`/feed/${filter}`)
        .then((response) => {
          console.log('reels response.data:', response.data);
          setReels(response.data);
        })
        .catch((err) => {
          console.error('Could not GET all reels:', err);
        });
    }
  };

  const getFriendList = () => {
    axios
      .get(`/feed/friendlist`)
      .then((response) => {
        console.log('friends response.data:', response.data);
        setFriends(response.data);
      })
      .catch((err) => {
        console.error('Could not GET friends:', err);
      })
  };


  const userCoord = (user: any) => {
    console.log('user:', user?.geolocation);
    if (user) {
      const arr = user.geolocation.split(',');
      const lat = Number(arr[0]);
      const long = Number(arr[1]);
      setUserLat(lat);
      setUserLong(long);
    }
  };

  // find distance with 2 points
  const distance = (lat1: number, lat2: number, lon1: number, lon2: number) => {

        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(lat1) * Math.cos(lat2)
                 * Math.pow(Math.sin(dlon / 2),2);

        let c = 2 * Math.asin(Math.sqrt(a));

        let r = 3956;

        return(c * r);
  };

  const getReelsByLoc = () => {
    axios
      .get('feed/recent')
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          let geo = response.data[i].User.geolocation.split(',');
          const otherLat = Number(geo[0]);
          const otherLong = Number(geo[1]);
          let dist = distance(userLat, otherLat, userLong, otherLong);
          console.log('distance:', dist);
          if (dist <= 5) {
            geoReels.push(response.data[i]);
          }
        }
        setReels(geoReels);
      })
      .catch((err) => {
        console.error('Could not GET all geo reels:', err);
      })
  };

  useEffect(() => {
    userCoord(user);
  }, [user]);

  useEffect(() => {
    getAllReels();
  }, [filter]);

  useEffect(() => {
    getFriendList();
  }, []);

  return (
    <>
      <label>
        Filter by:
        <select onChange={filterChangeHandler}>
          {filters.map((filter, i) => {
            return <option key={i}>{filter}</option>;
          })}
        </select>
      </label>
      <div className='container-full-w'>
        <Reel
          reels={reels}
          user={user}
          friends={friends}
        />
      </div>
    </>
  );
};

export default Feed;
