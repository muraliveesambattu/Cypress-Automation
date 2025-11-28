import { useState } from 'react'
import './App.css';
import axios from "axios";
import { useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [post, setPost] = useState({
    name: "",
    description: "",
    id: ""
  })
  const [isEdit, setIsEdit] = useState(false)
  const handleChange = (e) => {
    const newPost = { ...post };
    newPost[e.target.name] = e.target.value;
    setPost(newPost)
  }

  const getDataFromServer = () => {
    axios.get("http://localhost:3000/api/items").then(res => {
      console.log(res)
      setUsers(res.data.data)
    })
  }

  useEffect(() => {
    getDataFromServer();
  }, [])

  const handleDelete = (id) => {
    axios.delete("http://localhost:3000/api/items/" + id).then(() => {
      getDataFromServer();
    })
  }

  const handleCreate = () => {
    axios.post("http://localhost:3000/api/items", post).then((res) => {
      getDataFromServer()
    })
  }

  const handleEdit = (pst) => {
    setPost(pst);
    setIsEdit(true)
  }

  const handleUpdate = () => {
    axios.put("http://localhost:3000/api/items/" + post.id, post).then((res) => {
      getDataFromServer()
      setIsEdit(false)
    })
  }

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="">Name :</label>
        <input type="text" name="name" value={post.name} onChange={handleChange} /> <br />
        <label htmlFor="">Description :</label>
        <input type="text" name="description" value={post.description} onChange={handleChange} /> <br />
        {isEdit ? <button type="button" onClick={handleUpdate}>Update User</button> : <button type="button" onClick={handleCreate}>Create User</button>}
      </form>
      <br /> <hr />
      <table border={1}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((usr, i) => <tr key={i}>
            <td>{usr.name}</td>
            <td>{usr.description}</td>
            <td>
              <button onClick={() => { handleEdit(usr) }}>Edit User</button>
            </td>
            <td>
              <button onClick={() => { handleDelete(usr.id) }}>Delete User</button>
            </td>
          </tr>)}
        </tbody>
      </table>
    </>
  )
}

export default App
