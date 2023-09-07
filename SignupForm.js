import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignupForm.css';

const SignupForm = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    hobbies: '',
    department: '', 
  });
  const [signupStatus, setSignupStatus] = useState(null);

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleDepartmentChange = (event) => {
    const departmentValue = event.target.value;
    setFormData((prevData) => ({
      ...prevData,
      department: departmentValue,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userData = {
      ...formData,
      user_type: userType,
    };

    try {
      const response = await fetch('http://localhost:8081/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        setSignupStatus(data.status);

        if (userType === 'employee') {
          if (formData.department === 'hr') {
            navigate('/employee-hr-login');
          } else if (formData.department === 'tech') {
            navigate('/employee-tech-login');
          }
        } else if (userType === 'manager') {
          navigate('/manager-login');
        }
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
       <select name="hobbies" value={formData.hobbies} onChange={handleInputChange}>
         <option value="">Select Hobbies</option>
         <option value="reading">Reading</option>
           <option value="gaming">Gaming</option>
           <option value="cooking">Cooking</option>
           <option value="cooking">Drawing/Painting</option>
           <option value="cooking">Dancing</option>
          <option value="cooking">Photography</option>
          <option value="cooking">Outing</option>
           <option value="cooking">LongDrive</option>
           <option value="cooking">Music</option>
           <option value="cooking">Studying</option>
           <option value="cooking">Helping</option>
         </select>
        <select name="department" value={formData.department} onChange={handleDepartmentChange}>
          <option value="">Select Department</option>
          <option value="hr">Human Resources</option>
          <option value="tech">Technology</option>
          <option value="sales">Sales</option>
          <option value="marketing">Software</option>
          <option value="marketing">Devops</option>
          <option value="marketing">Testing</option>
          <option value="marketing">Management</option>
          <option value="marketing">Development</option>
          
        </select>
        <select value={userType} onChange={handleUserTypeChange}>
          <option value="">Select User Type</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Sign Up</button>
      </form>

      {signupStatus === 'Success' && userType === 'employee' && (
        <Link to={`/employee-${formData.department.toLowerCase()}-login`}>
          Go to Employee Login
        </Link>
      )}
      {signupStatus === 'Success' && userType === 'manager' && (
        <Link to="/manager-login">Go to Manager Login</Link>
      )}
    </div>
  );
};

export default SignupForm;

