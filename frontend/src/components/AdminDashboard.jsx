import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../utils/utils';

const AdminDashboard = () => {
  const [allAttendance, setAllAttendance] = useState([]);
  const [specificAttendance, setSpecificAttendance] = useState([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const user = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : null;

  useEffect(() => {
    if (!user) {
      alert('You are not logged in!');
      navigate('/login');
      return;
    }

    if (!user.isAdmin) {
      navigate('/dashboard');
      return;
    }

    fetchAllAttendance();
  }, []);

  const fetchAllAttendance = async () => {
    try {
      const response = await fetch(`${serverUrl}attendance/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.status === 403) {
        alert('Forbidden: You do not have the necessary permissions to access this resource.');
        return;
      }

      if (!response.ok) {
        alert(`Failed to fetch attendance with status: ${response.status}`);
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();
      setAllAttendance(data);
    } catch (error) {
      setError('Failed to fetch attendance');
      console.error('Error fetching attendance:', error);
    }
  };

  const fetchSpecificAttendance = async () => {
    try {
      const response = await fetch(`${serverUrl}attendance/${searchUsername}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (response.status === 403) {
        alert('Forbidden: You do not have the necessary permissions to access this resource.');
        return;
      }

      if (response.status === 404) {
        alert('No attendance records found for this user.');
        setSpecificAttendance([]);
        return;
      }

      if (!response.ok) {
        alert(`Failed to fetch attendance with status: ${response.status}`);
        throw new Error('Failed to fetch attendance');
      }

      const data = await response.json();
      setSpecificAttendance(data);
    } catch (error) {
      setError('Failed to fetch specific attendance');
      console.error('Error fetching specific attendance:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
  };

  if (!user || !user.isAdmin) {
    return null; // Avoid rendering while redirecting
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={logout}>Logout</button>

      {error && <p className="error-message">{error}</p>}

      <h3>Attendance Records</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {allAttendance.length > 0 ? (
            allAttendance.map((record, index) => (
              <tr key={index}>
                <td>{record.username}</td>
                <td>{record.date}</td>
                <td>{record.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No attendance records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <h3>Search Specific User Attendance</h3>
      <input
        type="text"
        placeholder="Enter username"
        value={searchUsername}
        onChange={(e) => setSearchUsername(e.target.value)}
      />
      <button onClick={fetchSpecificAttendance}>Search</button>

      {specificAttendance.length > 0 && (
        <>
          <h3>Attendance Records for {searchUsername}</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {specificAttendance.map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
