import React, { useState, useEffect } from 'react';

const Analytics = () => {
  const [martyrsCount, setMartyrsCount] = useState(0);
  const [donorsCount, setDonorsCount] = useState(0);
  const [studentsCount, setStudentsCount] = useState(0);
  const [scholarshipsCount, setScholarshipsCount] = useState(0);
  const [activeScholarshipsCount, setActiveScholarshipsCount] = useState(0);
  const [inactiveScholarshipsCount, setInactiveScholarshipsCount] = useState(0);
  const [pausedScholarshipsCount, setPausedScholarshipsCount] = useState(0);
  const [completedScholarshipsCount, setCompletedScholarshipsCount] = useState(0);
  const [totalDisbursed, setTotalDisbursed] = useState(0);
  const [monthlyDisbursed, setMonthlyDisbursed] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Martyrs Count
        const martyrsResponse = await fetch('https://jmms-server.vercel.app/martyrs');
        const martyrsData = await martyrsResponse.json();
        setMartyrsCount(martyrsData.length);

        // Fetch Donors Count
        const donorsResponse = await fetch('https://jmms-server.vercel.app/donors');
        const donorsData = await donorsResponse.json();
        setDonorsCount(donorsData.length);

        // Fetch Students Count
        const studentsResponse = await fetch('https://jmms-server.vercel.app/students');
        const studentsData = await studentsResponse.json();
        setStudentsCount(studentsData.length);

        // Fetch Scholarships Data
        const scholarshipsResponse = await fetch('https://jmms-server.vercel.app/scholarships');
        const scholarshipsData = await scholarshipsResponse.json();
        setScholarshipsCount(scholarshipsData.length);

        // Calculate scholarship statuses
        let active = 0, inactive = 0, paused = 0, completed = 0;
        let monthlyDisbursedAmount = 0;
        scholarshipsData.forEach(scholarship => {
          switch (scholarship.status) {
            case 'Active':
              active++;
              monthlyDisbursedAmount += parseFloat(scholarship.monthly_amount);
              break;
            case 'Inactive':
              inactive++;
              break;
            case 'Paused':
              paused++;
              break;
            case 'Completed':
              completed++;
              break;
            default:
              break;
          }
        });

        setActiveScholarshipsCount(active);
        setInactiveScholarshipsCount(inactive);
        setPausedScholarshipsCount(paused);
        setCompletedScholarshipsCount(completed);
        setMonthlyDisbursed(monthlyDisbursedAmount);

        // Fetch Disbursements Data to calculate total disbursed amount
        const disbursementsResponse = await fetch('https://jmms-server.vercel.app/disbursements');
        const disbursementsData = await disbursementsResponse.json();

        let totalDisbursedAmount = 0;
        for (const disbursement of disbursementsData) {
          const scholarship = scholarshipsData.find(sch => sch.id === disbursement.scholarship_id);
          if (scholarship) {
            totalDisbursedAmount += parseFloat(scholarship.monthly_amount);
          }
        }

        setTotalDisbursed(totalDisbursedAmount);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4 mb-5">
      <h1 className='text-center'>Overall Analytics</h1>
      <div className="mb-3">
        <h4>Martyrs: {martyrsCount}</h4>
        <h4>Donors: {donorsCount}</h4>
        <h4>Students: {studentsCount}</h4>
        <h4>Scholarships: {scholarshipsCount}</h4>
        <h4>Active Scholarships: {activeScholarshipsCount}</h4>
        <h4>Inactive Scholarships: {inactiveScholarshipsCount}</h4>
        <h4>Paused Scholarships: {pausedScholarshipsCount}</h4>
        <h4>Completed Scholarships: {completedScholarshipsCount}</h4>
      </div>
      <div className="mb-3">
        <h4>Total Amount Being Disbursed Monthly: {monthlyDisbursed.toFixed(2)} BDT</h4>
        <h4>Total Amount Disbursed Till Now: {totalDisbursed.toFixed(2)} BDT</h4>
      </div>
      <hr></hr>
      <h6 className='text-center'>For detailed information about Martyrs, please visit <a href="https://shohid.info/" target="_blank" rel="noopener noreferrer">https://shohid.info/</a></h6>
    </div>
  );
}

export default Analytics;
