import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagerDashboard.css'; 

const ManagerDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 5;

  const [formData, setFormData] = useState({
    departmentName: '',
    categoryName: '',
    location: '',
    salary: '',
    managerId: '',
  });

  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8081/get-departments');
      setDepartments(response.data.departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = departments.slice(indexOfFirstDepartment, indexOfLastDepartment);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCreateDepartment = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8081/create-department', formData);
      fetchDepartments();
      setFormData({
        departmentName: '',
        categoryName: '',
        location: '',
        salary: '',
        managerId: '',
      });
    } catch (error) {
      console.error('Error creating department:', error);
    }
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setFormData({
      departmentName: department.departmentName,
      categoryName: department.categoryName,
      location: department.location,
      salary: department.salary,
      managerId: department.managerId,
    });
  };

  const handleUpdateDepartment = async (event) => {
    event.preventDefault();
    try {
      const departmentId = selectedDepartment.id;
      await axios.put(`http://localhost:8081/update-department/${departmentId}`, formData);
      fetchDepartments();
      setSelectedDepartment(null);
      setFormData({
        departmentName: '',
        categoryName: '',
        location: '',
        salary: '',
        managerId: '',
      });
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await axios.delete(`http://localhost:8081/delete-department/${departmentId}`);
      fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div className="manager-dashboard-container">
      <h2>Manager Dashboard</h2>

      <form onSubmit={handleCreateDepartment}>
        <input
          type="text"
          value={formData.departmentName}
          onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
          placeholder="Department Name"
        />
        <input
          type="text"
          value={formData.categoryName}
          onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          placeholder="Category Name"
        />
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Location"
        />
        <input
          type="text"
          value={formData.salary}
          onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
          placeholder="Salary"
        />
        <input
          type="text"
          value={formData.managerId}
          onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
          placeholder="Manager ID"
        />
        <button type="submit">Create Department</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Department Name</th>
            <th>Category Name</th>
            <th>Location</th>
            <th>Salary</th>
            <th>Manager ID</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentDepartments.map((department) => (
            <tr key={department.id}>
              <td>{department.id}</td>
              <td>{department.departmentName}</td>
              <td>{department.categoryName}</td>
              <td>{department.location}</td>
              <td>{department.salary}</td>
              <td>{department.managerId}</td>
              <td>
                <button onClick={() => handleEditDepartment(department)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteDepartment(department.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDepartment && (
        <form onSubmit={handleUpdateDepartment}>
          <input
            type="text"
            value={formData.departmentName}
            onChange={(e) => setFormData({ ...formData, departmentName: e.target.value })}
            placeholder="Department Name"
          />
          <input
            type="text"
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
            placeholder="Category Name"
          />
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Location"
          />
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="Salary"
          />
          <input
            type="text"
            value={formData.managerId}
            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
            placeholder="Manager ID"
          />
          <button type="submit">Update Department</button>
        </form>
      )}

      <div className="pagination">
        {Array.from({ length: Math.ceil(departments.length / departmentsPerPage) }).map((_, index) => (
          <button key={index} onClick={() => paginate(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManagerDashboard;


