import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, getUsers} from '../slicer/UserSlice';
import UserTable from './UserTable';
const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector(fetchUsers);


  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);


  return (
    <div className='container mt-5'>
      <h1>Users</h1>
      <UserTable users={users} />
    </div>
  );
};

export default UserList;
