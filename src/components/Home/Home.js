import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [scholarships, setScholarships] = useState([]);
  const [martyrs, setMartyrs] = useState([]);
  const [donors, setDonors] = useState([]);
  const [students, setStudents] = useState([]);
  const [disbursements, setDisbursements] = useState([]);

  // State variables for modals
  const [showScholarshipModal, setShowScholarshipModal] = useState(false);
  const [showMartyrModal, setShowMartyrModal] = useState(false);
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  // State variables for current details
  const [currentScholarship, setCurrentScholarship] = useState({});
  const [currentMartyr, setCurrentMartyr] = useState({});
  const [currentDonor, setCurrentDonor] = useState({});
  const [currentStudent, setCurrentStudent] = useState({});

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch all data from the APIs
    const fetchScholarships = fetch('https://jmms-server.vercel.app/scholarships').then(response => response.json());
    const fetchMartyrs = fetch('https://jmms-server.vercel.app/martyrs').then(response => response.json());
    const fetchDonors = fetch('https://jmms-server.vercel.app/donors').then(response => response.json());
    const fetchStudents = fetch('https://jmms-server.vercel.app/students').then(response => response.json());
    const fetchDisbursements = fetch('https://jmms-server.vercel.app/disbursements').then(response => response.json());

    Promise.all([fetchScholarships, fetchMartyrs, fetchDonors, fetchStudents, fetchDisbursements])
      .then(([scholarshipsData, martyrsData, donorsData, studentsData, disbursementsData]) => {
        setScholarships(scholarshipsData);
        setMartyrs(martyrsData);
        setDonors(donorsData);
        setStudents(studentsData);
        setDisbursements(disbursementsData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const getMartyrById = (id) => martyrs.find(martyr => martyr.id === id);
  const getDonorById = (id) => donors.find(donor => donor.id === id);
  const getStudentById = (id) => students.find(student => student.id === id);
  const getLastDisbursementForScholarship = (scholarshipId) => {
    const relevantDisbursements = disbursements.filter(disbursement => disbursement.scholarship_id === scholarshipId);
    const lastDisbursement = relevantDisbursements.reduce((max, disbursement) => disbursement.id > max.id ? disbursement : max, { id: -1 });
    return lastDisbursement;
  };

  const handleEditScl = (scholarship) => {
    setCurrentScholarship(scholarship);
    setShowScholarshipModal(true);
  };

  const handleEditMartyr = (martyr) => {
    setCurrentMartyr(martyr);
    setShowMartyrModal(true);
  };

  const handleEditDonor = (donor) => {
    setCurrentDonor(donor);
    setShowDonorModal(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setShowStudentModal(true);
  };

  const handleCloseScholarshipModal = () => setShowScholarshipModal(false);
  const handleCloseMartyrModal = () => setShowMartyrModal(false);
  const handleCloseDonorModal = () => setShowDonorModal(false);
  const handleCloseStudentModal = () => setShowStudentModal(false);

  const handleUpdateScholarship = () => {
    fetch(`https://jmms-server.vercel.app/scholarships/${currentScholarship.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentScholarship),
    })
      .then(response => response.json())
      .then(() => {
        setScholarships(prevScholarships => prevScholarships.map(scholarship => scholarship.id === currentScholarship.id ? currentScholarship : scholarship));
        handleCloseScholarshipModal();
      })
      .catch(error => console.error('Error updating scholarship:', error));
  };

  const handleUpdateMartyr = () => {
    // Update martyr logic
    fetch(`https://jmms-server.vercel.app/martyrs/${currentMartyr.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentMartyr),
    })
      .then(response => response.json())
      .then(() => {
        setMartyrs(prevMartyrs => prevMartyrs.map(martyr => martyr.id === currentMartyr.id ? currentMartyr : martyr));
        handleCloseMartyrModal();
      })
      .catch(error => console.error('Error updating martyr:', error));
  };

  const handleUpdateDonor = () => {
    // Update donor logic
    fetch(`https://jmms-server.vercel.app/donors/${currentDonor.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentDonor),
    })
      .then(response => response.json())
      .then(() => {
        setDonors(prevDonors => prevDonors.map(donor => donor.id === currentDonor.id ? currentDonor : donor));
        handleCloseDonorModal();
      })
      .catch(error => console.error('Error updating donor:', error));
  };

  const handleUpdateStudent = () => {
    // Update student logic
    fetch(`https://jmms-server.vercel.app/students/${currentStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentStudent),
    })
      .then(response => response.json())
      .then(() => {
        setStudents(prevStudents => prevStudents.map(student => student.id === currentStudent.id ? currentStudent : student));
        handleCloseStudentModal();
      })
      .catch(error => console.error('Error updating student:', error));
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="mb-0">Scholarships</h1>
        <span className="badge bg-secondary fs-5 ms-2">{scholarships.length} Total</span>
        <button onClick={() => navigate('/add-scholarship')} className="btn btn-primary ms-4">
          Add New
        </button>
      </div>
      <div className="row">
        {scholarships.map(scholarship => {
          const martyr = getMartyrById(scholarship.martyr_id);
          const donor = getDonorById(scholarship.donor_id);
          const student = getStudentById(scholarship.student_id);
          const lastDisbursement = getLastDisbursementForScholarship(scholarship.id);

          return (
            <div key={scholarship.id} className="col-md-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <strong>
                    <h5 className="card-title text-center">
                      {martyr ? `${martyr.martyr_name} Memorial Scholarship` : 'Scholarship'}
                    </h5>
                  </strong>
                  <hr />

                  {martyr && (
                    <>
                      <h6 className='text-center'>Martyr Info
                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleEditMartyr(martyr)}>Edit</button>
                      </h6>
                      <p className="card-text">
                        <strong>Name:</strong> {martyr.martyr_name}<br />
                        <strong>Place:</strong> {martyr.martyr_place}<br />
                        <strong>Date:</strong> {martyr.martyr_date}
                      </p>
                    </>
                  )}

                  {donor && (
                    <>
                      <h6 className='text-center'>Donor Info
                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleEditDonor(donor)}>Edit</button>
                      </h6>
                      <p className="card-text">
                        <strong>Name:</strong> {donor.donor_name}<br />
                        <strong>Email:</strong> <a href={`mailto:${donor.donor_email}`}>{donor.donor_email}</a><br />
                        <strong>Phone:</strong> <a href={`tel:${donor.donor_phone}`}>{donor.donor_phone}</a>
                      </p>
                    </>
                  )}

                  {student && (
                    <>
                      <h6 className='text-center'>Student Info
                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleEditStudent(student)}>Edit</button>
                      </h6>
                      <p className="card-text">
                        <strong>Name:</strong> {student.student_name}<br />
                        <strong>School:</strong> {student.student_school}<br />
                        <strong>Class:</strong> {student.student_class}<br />
                        <strong>District:</strong> {student.student_district}<br />
                        <strong>Phone:</strong> <a href={`tel:${student.student_phone}`}>{student.student_phone}</a>
                      </p>
                    </>
                  )}

                  <h6 className='text-center'>Scholarship Info
                    <button className="btn btn-secondary btn-sm ms-2" onClick={() => handleEditScl(scholarship)}>Edit</button>
                  </h6>
                  <p className="card-text">
                  <strong>Donor ID:</strong> {scholarship.donor_id}
                  </p>
                  <p className="card-text">
                  <strong>Amount:</strong> {scholarship.monthly_amount} BDT
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong> {scholarship.status}
                  </p>
                  <p className="card-text">
                      <strong>Last Disb:</strong> {lastDisbursement.date}
                  </p>

                  <button 
                    className="btn btn-primary"
                    onClick={() => navigate(`/disbursements?scl_id=${scholarship.id}`)}
                  >All Disbursements</button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scholarship Edit Modal */}
      {showScholarshipModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Scholarship Info</h5>
                <button type="button" className="btn-close" onClick={handleCloseScholarshipModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="donor-id" className="form-label">Donor ID</label>
                    <input
                      type="number"
                      className="form-control"
                      id="donor-id"
                      value={currentScholarship.donor_id}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, donor_id: parseInt(e.target.value, 10)})}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      value={currentScholarship.status || ''}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, status: e.target.value })}
                    >
                      <option value="Inactive">Inactive</option>
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="monthly-amount" className="form-label">Monthly Amount</label>
                    <input
                      type="number"
                      className="form-control"
                      id="monthly-amount"
                      value={currentScholarship.monthly_amount || ''}
                      onChange={(e) => setCurrentScholarship({ ...currentScholarship, monthly_amount: e.target.value })}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseScholarshipModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateScholarship}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Martyr Edit Modal */}
      {showMartyrModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Martyr Info</h5>
                <button type="button" className="btn-close" onClick={handleCloseMartyrModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="martyr-name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="martyr-name"
                      value={currentMartyr.martyr_name || ''}
                      onChange={(e) => setCurrentMartyr({ ...currentMartyr, martyr_name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="martyr-place" className="form-label">Place</label>
                    <input
                      type="text"
                      className="form-control"
                      id="martyr-place"
                      value={currentMartyr.martyr_place || ''}
                      onChange={(e) => setCurrentMartyr({ ...currentMartyr, martyr_place: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="martyr-date" className="form-label">Date</label>
                    <input
                      type="text"
                      className="form-control"
                      id="martyr-date"
                      placeholder='dd-mm-yyyy'
                      value={currentMartyr.martyr_date || ''}
                      onChange={(e) => setCurrentMartyr({ ...currentMartyr, martyr_date: e.target.value })}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseMartyrModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateMartyr}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Donor Edit Modal */}
      {showDonorModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Donor Info</h5>
                <button type="button" className="btn-close" onClick={handleCloseDonorModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="donor-name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="donor-name"
                      value={currentDonor.donor_name || ''}
                      onChange={(e) => setCurrentDonor({ ...currentDonor, donor_name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="donor-email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="donor-email"
                      value={currentDonor.donor_email || ''}
                      onChange={(e) => setCurrentDonor({ ...currentDonor, donor_email: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="donor-phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="donor-phone"
                      value={currentDonor.donor_phone || ''}
                      onChange={(e) => setCurrentDonor({ ...currentDonor, donor_phone: e.target.value })}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseDonorModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateDonor}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Edit Modal */}
      {showStudentModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Student Info</h5>
                <button type="button" className="btn-close" onClick={handleCloseStudentModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="student-name" className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="student-name"
                      value={currentStudent.student_name || ''}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, student_name: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="student-school" className="form-label">School</label>
                    <input
                      type="text"
                      className="form-control"
                      id="student-school"
                      value={currentStudent.student_school || ''}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, student_school: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="student-class" className="form-label">Class</label>
                    <input
                      type="text"
                      className="form-control"
                      id="student-class"
                      value={currentStudent.student_class || ''}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, student_class: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="student-district" className="form-label">District</label>
                    <input
                      type="text"
                      className="form-control"
                      id="student-district"
                      value={currentStudent.student_district || ''}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, student_district: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="student-phone" className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="student-phone"
                      value={currentStudent.student_phone || ''}
                      onChange={(e) => setCurrentStudent({ ...currentStudent, student_phone: e.target.value })}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseStudentModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateStudent}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;

