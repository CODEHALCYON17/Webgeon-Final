import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../utils/utils';

const Dashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isMarked, setIsMarked] = useState(false);
  const navigate = useNavigate();

  const user = localStorage.getItem('userDetails')
    ? JSON.parse(localStorage.getItem('userDetails'))
    : null;

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${serverUrl}attendance`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setAttendanceRecords(data);
        setIsMarked(
          data.some(
            (record) => record.date === new Date().toISOString().split('T')[0]
          )
        );
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      alert('You are not logged in!');
      navigate('/login');
      return;
    }

    if (user.isAdmin) {
      navigate('/admin');
      return;
    }

    fetchAttendance();
  }, []);

  const markAttendance = async () => {
    try {
      const response = await fetch(`${serverUrl}attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
        }),
      });
      if (response.ok) {
        setIsMarked(true);
        fetchAttendance();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('userDetails');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.username}!</h2>
      <button onClick={logout}>Logout</button>
      {!isMarked && (
        <button onClick={markAttendance}>Mark Attendance for Today</button>
      )}
      <h3>Your Attendance Records:</h3>
      <ul>
        {attendanceRecords.map((record, index) => (
          <li key={index}>
            {record.date}: {record.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
