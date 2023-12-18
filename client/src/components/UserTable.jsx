import React from 'react';


const UserTable = ({ users }) => {
  return (
    <table className='table striped bordered hover responsive'>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Username</th>
          <th>Fullname</th>
          <th>Phone</th>
          <th>Permisions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(us => (
          <tr key={us.id}>
            <td>{us.id}</td>
            <td>{us.email}</td>
            <td>{us.username}</td>
            <td>{us.fullname}</td>
            <td>{us.phone}</td>
            <td>{us.permissions}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
