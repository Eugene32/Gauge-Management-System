import React, { useEffect, useState } from 'react';
//import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { ADD_USER, DELETE_USER } from '../../utils/mutations';

import Auth from '../../utils/auth';

const UserForm = ({ users }) => {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    password: '',
    isAdmin: ''
  });

  const [addUser, { error, data }] = useMutation(ADD_USER);
  const [deleteUser, { delete_user_error, delete_user_data }] = useMutation(DELETE_USER);

  //useEffect{};

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();


    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  const delUser = async (index, user_id) => {
    
    console.log("delUser function is executed", index, {user_id});
    //return

    try {
      const { delete_user_data } = await deleteUser({
        variables:  {id: user_id} ,
      });
      //console.log('The formstate values are', delete_user_data);
      //Auth.login(delete_user_data.addUser.token);

      //UserForm();
    } catch (e) {
      console.error(e);
    }
    return
  };


  const [checked, setChecked] = useState(false);

  const tickChange = () => {
    setChecked(!checked);
  };

  const Checkbox = ({ label, value, onChange }) => {

    formState.isAdmin = value;


    return (
      <label>
        <input type="checkbox" checked={value} onChange={onChange} />
        {label}
      </label>
    );
  };






  return (
    <div className="flex-row justify-center mb-4">
      <div className="col-12 col-lg-10">
        <div className="card">
          <h4 className="card-header bg-dark text-light p-2">Sign Up</h4>
          <div className="card-body">
            {data ? (
              <p>
                User {formState.username} had been added....

              </p>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <input
                  className="form-input"
                  placeholder="Username"
                  name="username"
                  type="text"
                  value={formState.name}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="Your email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={handleChange}
                />
                <input
                  className="form-input"
                  placeholder="******"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                />
                <Checkbox
                  label="Admin" name='isAdmin' value={checked} onChange={tickChange} />
                <button
                  className="btn btn-block btn-primary"
                  style={{ cursor: 'pointer' }}
                  type="submit"
                >
                  Submit
                </button>
              </form>
            )}

            {error && (
              <div className="my-3 p-3 bg-danger text-white">
                {error.message}
              </div>
            )}
          </div>
        </div>
        <div className='card'>
          {users && users.map((user, index) => (
            <div key={user._id} className="card mb-3">
              <h4 className="card-header bg-primary text-light p-2 m-0">
                {user.username}

              </h4>

              <button >Edit</button>
              <button value={user._id} className='btn' onClick={() => delUser(index, user._id)} >Delete</button>
              {delete_user_error && (
                <div className="my-3 p-3 bg-danger text-white">
                  {delete_user_error.message}
                </div>
              )}
            </div>

          ))
          }
        </div>
      </div>
    </div>
  );
};

export default UserForm;
