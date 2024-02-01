import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3100/api/login', { username, password });

      if (response.status === 200) {
        setToken(response.data.token);
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleFetchData_post = async () => {
    try {
      const response = await axios.post('http://localhost:3100/api/data', { 'Authorization': token });
      console.log(`res => ${JSON.stringify(response)}`);
      if (response.status === 200) {
        console.log('Protected data:', response.data);
      } else {
        console.error('Failed to fetch protected data');
      }
    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  };


  const handleFetchData_get = async () => {
    try {
      const response = await axios.get('http://localhost:3100/api/data', {
        headers: {
          'Authorization': token ? `${token}` : '',
          },
      });
      console.log(`res => ${response}`);
      if (response.status === 200) {
        console.log('Protected data:', response.data);
      } else {
        console.error('Failed to fetch protected data');
      }
    } catch (error) {
      console.error('Error during data fetch:', error);
    }
  };

  return (
    <div>
      <h1>React App with Express and JWT</h1>
      <div>
        <label>Username: </label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div>
        <label>Password: </label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button onClick={handleLogin}>Login</button>
      {token && (
        <div>
          <p>Token: {token}</p>
          <button onClick={handleFetchData_get}>Fetch(get) Protected Data</button>
          <button onClick={handleFetchData_post}>Fetch(post) Protected Data</button>
        </div>
      )}
    </div>
  );
};

export default App;
