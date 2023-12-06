
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Meetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [newDateTime, setNewDateTime] = useState('2020-01-15T08:30:00');
  const [form, setForm] = useState({
    userId: 1,
    mentorId: 2,
    startDate: '2023-05-01T09:00:00',
    interval: 1,
    durationInMonths: 3,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // https://lean-assignment-production.up.railway.app/api/meetings
    // axios.get('http://localhost:8080/api/meetings')
    axios.get('https://lean-assignment-production.up.railway.app/api/meetings')
      .then(response => setMeetings(response.data))
      .catch(error => {
        console.error('Error fetching meetings:', error);
        setError(error);
      });
  }, [], [meetings]);

  const handleForm = (e) => {
    setForm({
        ...form,
        [e.target.name]: e.target.value,
        
    })
    
}
  const handleDelete = async (meetingId) => {
    try {
      await axios.post(`http://localhost:8080/api/meetings/${meetingId}/cancel`);
      console.log('Meeting canceled successfully!');
    } catch (error) {
      console.error('Error deleting meeting:', error);
      setError(error);
    }
  };

  const handleReschedule = async (meetingId) => {
    try {
      const formData = new URLSearchParams();
      formData.append('newDateTime', newDateTime);

      await axios.post(
        // `http://localhost:8080/api/meetings/${meetingId}/reschedule`,
        `https://lean-assignment-production.up.railway.app/api/meetings/${meetingId}/reschedule`,
        formData,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );

      console.log('Meeting rescheduled successfully!');
    } catch (error) {
      console.error('Error rescheduling meeting:', error.message);
    }
  };
  const handleRecurringMeeting = async (form) => {
    try {
      const formData = new URLSearchParams();
      formData.append('userId', form.userId);
      formData.append('mentorId', form.mentorId);
      formData.append('startDate', form.startDate);
      formData.append('interval', form.interval);
      formData.append('durationInMonths', form.durationInMonths);
      console.log(formData)
      const response = await axios.post(
        // 'http://localhost:8080/api/meetings/book-recurring', 
        'https://lean-assignment-production.up.railway.app/api/meetings/book-recurring', 
      formData,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
      );

      // Handle the response as needed
      console.log('Meeting booked successfully:', response.data);
    } catch (error) {
      // Handle errors
      console.error('Error booking meeting:', error.message);
    }
  };


  return (
    <div className='py-10 px-20 grid grid-cols-5 gap-4'>
      <h1 className='col-span-5 text-center mb-4 text-4xl font-bold'>Meetings</h1>
      <div className='border bg-blue-100 p-4'>
        <div className='mb-4'>
          <h1 className='font-semibold pb-4'>Add Recurring meetings</h1>
          <label htmlFor='userid' className='mr-2'>User ID:</label>
          <input
            onChange={handleForm}
            name='userId'
            value={form.userId}
            type='number'
            className='border p-1'
            placeholder='User ID'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='mentorid' className='mr-2'>Mentor ID:</label>
          <input
            onChange={handleForm}
            name='mentorId'
            value={form.mentorId}
            type='number'
            className='border p-1'
            placeholder='Mentor ID'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='startDate' className='mr-2'>Start Date:</label>
          <input
            onChange={handleForm}
            name='startDate'
            value={form.startDate}
            type='text'
            className='border p-1'
            placeholder='Start Date'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='interval' className='mr-2'>Interval:</label>
          <input
            onChange={handleForm}
            name='interval'
            value={form.interval}
            type='text'
            className='border p-1'
            placeholder='Interval'
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='duration' className='mr-2'>Duration:</label>
          <input
            onChange={handleForm}
            name='durationInMonths'
            value={form.durationInMonths}
            type='number'
            className='border p-1'
            placeholder='Duration'
          />
        </div>
        <div>
          <button
            onClick={()=>handleRecurringMeeting(form)}
            className='text-red-800 mt-2 block'
          >
            Add Recurring Meeting
          </button>
        </div>
      </div>
      
      {error && <p className='col-span-5 text-red-500'>Error fetching meetings: {error.message}</p>}
      {meetings.map(meeting => (
        <div key={meeting.id} className='border p-4'>
          <div>ID: {meeting.id}</div>
          <div>Date: {meeting.date}</div>
          <div>User ID: {meeting.userId}</div>
          <div>Mentor ID: {meeting.mentorId}</div>
          <div>
            <input
              onChange={(e) => setNewDateTime(e.target.value)}
              type='text'
              className='border p-2 mt-2'
              placeholder='New Date and Time'
            />
            <button
              onClick={() => handleReschedule(meeting.id)}
              className='text-blue-800 mt-2 block'
            >
              Reschedule
            </button>
            <button
              onClick={() => handleDelete(meeting.id)}
              className='text-red-800 mt-2 block'
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Meetings;
