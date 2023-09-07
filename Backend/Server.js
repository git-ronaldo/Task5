import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';

const saltRounds = 10;

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'management',
});


app.post('/manager-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM managers WHERE email = ?';
    const [manager] = await db.promise().query(sql, [email]);

    if (!manager.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, manager[0].password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({ status: 'Success', managerId: manager[0].id });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});


app.post('/create-department', async (req, res) => {
  const { departmentName, categoryName, location, salary, managerId } = req.body;

  try {
    const sql = 'INSERT INTO departments (departmentName, categoryName, location, salary, managerId) VALUES (?, ?, ?, ?, ?)';
    await db.promise().query(sql, [departmentName, categoryName, location, salary, managerId]);
    return res.json({ status: 'Department created successfully' });
  } catch (error) {
    console.error('Error inserting department:', error);
    return res.status(500).json({ error: 'Error inserting department' });
  }
});

app.put('/update-department/:departmentId', async (req, res) => {
  const departmentId = req.params.departmentId;
  const { departmentName, categoryName, location, salary } = req.body;

  try {
    const sql = 'UPDATE departments SET departmentName=?, categoryName=?, location=?, salary=? WHERE id=?';
    await db.promise().query(sql, [departmentName, categoryName, location, salary, departmentId]);
    return res.json({ status: 'Department updated successfully' });
  } catch (error) {
    console.error('Error updating department:', error);
    return res.status(500).json({ error: 'Error updating department' });
  }
});


app.delete('/delete-department/:departmentId', async (req, res) => {
  const departmentId = req.params.departmentId;

  try {
    const sql = 'DELETE FROM departments WHERE id=?';
    await db.promise().query(sql, [departmentId]);
    return res.json({ status: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return res.status(500).json({ error: 'Error deleting department' });
  }
});

app.get('/get-departments', async (req, res) => {
  try {
    const sql = 'SELECT * FROM departments';
    const [departments] = await db.promise().query(sql);
    return res.json({ departments });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return res.status(500).json({ error: 'Error fetching departments' });
  }
});


app.post('/signup', async (req, res) => {
  const { first_name, last_name, email, password, hobbies, user_type, department } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    const tableName = user_type === 'employee' ? 'employees' : 'managers';

    const sql =
      `INSERT INTO ${tableName} (first_name, last_name, email, password, hobbies, user_type, department) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    await db.promise().query(sql, [first_name, last_name, email, hashedPassword, hobbies, user_type, department]);

    return res.json({ status: 'Success' });
  } catch (error) {
    console.error('Error inserting data into the Server:', error);
    return res.status(500).json({ error: 'Error inserting data into the Server' });
  }
});


app.post('/employee-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT * FROM employees WHERE email = ?';
    const [employees] = await db.promise().query(sql, [email]);

    if (!employees.length) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, employees[0].password);

    if (!match) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({ status: 'Success', employeeId: employees[0].id });
  } catch (error) {
    console.error('Error querying database:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

app.listen(8081, () => {
  console.log('Running on port 8081');
});
