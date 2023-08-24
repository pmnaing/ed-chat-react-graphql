// import logo from './logo.svg';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import {
  withAuthenticator,
  Button,
  // Heading,
  // Image,
  View,
  // Card
} from '@aws-amplify/ui-react';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Sidebar from './Sidebar';
import Profile from './Profile';
import Home from './Home';

function App({ signOut }) {

  return (
    <Router>
      <View className="App">
        <div className='sidebar'><Sidebar /></div>
        <Button onClick={signOut}>Sign Out</Button>
      </View>
      {/* Set up the routes */}
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Routes>
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default withAuthenticator(App);
