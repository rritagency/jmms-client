import React, { useState, useEffect } from 'react';

const Donors = () => {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    fetch('https://jmms-server.vercel.app/donors')
      .then(response => response.json())
      .then(data => setDonors(data))
      .catch(error => console.error('Error fetching donors:', error));
  }, []);

  const handleDelete = (id) => {
    // Optional: Make a DELETE request to the server
    fetch(`https://jmms-server.vercel.app/donors/${id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Remove donor from the local state
        setDonors(donors.filter(donor => donor.id !== id));
      } else {
        console.error('Failed to delete donor');
      }
    })
    .catch(error => console.error('Error deleting donor:', error));
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-center align-items-center mb-4'>
        <h1 className='mb-0'>Donors</h1>
        <span className='badge bg-primary fs-5 ms-4'>{donors.length} Total</span>
      </div>

      <table className='table table-striped table-bordered'>
        <thead className='thead-dark'>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th> {/* Add Action column */}
          </tr>
        </thead>
        <tbody>
          {donors.map(donor => (
            <tr key={donor.id}>
              <td>{donor.id}</td>
              <td>{donor.donor_name}</td>
              <td><a href={`mailto:${donor.donor_email}`}>{donor.donor_email}</a></td>
              <td><a href={`tel:${donor.donor_phone}`}>{donor.donor_phone}</a></td>
              <td>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => handleDelete(donor.id)}
                >
                  Delete
                </button>
              </td> {/* Delete button */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donors;
