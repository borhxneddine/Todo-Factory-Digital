import React, { useState, useEffect, useContext } from 'react'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Card from '@mui/material/Card';
import Popover from '@mui/material/Popover';
import { Stack } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import { Checkbox } from '@material-ui/core';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';
import { AuthContext } from './context/AuthContext';

import { useNavigate } from "react-router-dom";






export default function Todo() {
  const [title, setTitle] = useState('');
  const [temp, setTemp] = useState(false);
  const [description, setDescription] = useState('');

  const [todos, setTodos] = useState([]);
  const [nestedTodos, setNestedTodos] = useState([]);

  const [idd, setId] = useState(0);

  const [error, setError] = useState('');

  const [expanded2, setExpanded2] = useState(false);

  const { currentUser, dispatch } = useContext(AuthContext)
  const navigate = useNavigate();



  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    if (temp) {
      // Execute your function here
      getNestedTodos();
    }
  }, [temp]);




  const getTodos = async () => {
    const id = currentUser.id
    const response = await fetch(`http://localhost:3001/todos?userId=${id}`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const records = await response.json();
    setTodos(records);
    setTemp(true);

  }

  const getNestedTodos = async () => {
    let nested_todos_array = [];
    for (let i = 0; i < todos.length; i++) {
      let response2 = await fetch(`http://localhost:3001/nestedTodos?todoId=${todos[i].id}`);
      // console.log(response)

      if (!response2.ok) {
        const message = `An error occurred: ${response2.statusText}`;
        window.alert(message);
        return;
      }
      let records = await response2.json();
      if (records === null || records === undefined || (Array.isArray(records) && records.length === 0) || (typeof records === 'object' && Object.keys(records).length === 0)) {
        //   console.log("empty");
      }
      else {
        //   console.log("not empty")

        //   console.log(records);
        for (let i = 0; i < records.length; i++) {
          nested_todos_array.push(records[i]);
        }

        // nested_todos_array.push(records);
      }


      // setNestedTodos(nestedTodos.push(records));
      // setNestedTodos([...nestedTodos, ...records]);
      // console.log(nestedTodos);

    }
    console.log(nested_todos_array);
    setNestedTodos(nested_todos_array)

  }






  const handleExpand = () => {
    setExpanded2(!expanded2);
  };

  const [checkedState, setCheckedState] = useState({});


  const handleChangeCheck = (event, id) => {
    const checked = event.target.checked;
    setCheckedState((prevState) => ({
      ...prevState,
      [id]: checked
    }));
  };

  const checkedSubmit = (e, t) => {
    const isChecked = e.target.checked;
    t.completed = isChecked;
    setTodos([...todos]);
    console.log(todos);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    {/*if(!e.target.title.value) {
          setError('this field is required');
          return;
        }*/}
    if (idd === 0) {
      let pos = todos.length + 1;

      const userid = currentUser.id

      const formData = {
        'userId': userid,
        'title': title,
        'description': description,
        'completed': false,
        'endDate': "05/01/2023",
        'pos': pos,
      };


      console.log(formData);

      axios.post("http://localhost:3001/todos", formData).then((res) => {
        console.log('there is a response');
      }).catch((err) => {
        console.log('there is an error')
      })
      // setTodos([...todos, { title, description, id: Math.random() * 10000, completed: false, pos }]);
      setTitle('');
      setDescription('');
      setError('');
    } else {
      let pos = todos.length + 1;

      const userid = currentUser.id

      const formData = {
        'todoId': idd,
        'title': title,
        'description': description,
        'completed': false,
        'endDate': "05/01/2023",
        'pos': pos,
      };


      console.log(formData);

      axios.post("http://localhost:3001/nestedTodos", formData).then((res) => {
        console.log('there is a response');
      }).catch((err) => {
        console.log('there is an error')
      })

      // setNestedTodos([...nestedTodos, { title, description, id: Math.random() * 10000, todoid: idd, completed: false }]);
      setTitle('');
      setDescription('');

    }
    navigate(0);

  }


  const deleteTodo = (id) => {
    console.log(id);
    axios.delete(`http://localhost:3001/todos/${id}`).then((res) => {
      console.log('there is a response');
    }).catch((err) => {
      console.log('there is an error')
    })
    navigate(0);


    // setTodos(todos.filter((todo) => todo.id !== id));
  }

  const deleteNestedTodo = (id) => {
    axios.delete(`http://localhost:3001/nestedTodos/${id}`).then((res) => {
      console.log('there is a response');
    }).catch((err) => {
      console.log('there is an error')
    })
    navigate(0);

    // setNestedTodos(nestedTodos.filter((todo) => todo.id !== id));
  }



  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

  };
  const handleClickNested = (event) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  // xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx


  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {

    setExpanded2(isExpanded ? panel : false);
  };

  // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



  const dragItem = React.useRef(null)
  const dragOverItem = React.useRef(null)

  const handleSort = () => {
    const items = [...todos];
    const index = items.findIndex(item => item.id === dragItem.current);
    const draggedItemContent = items.splice(index, 1)[0];
    let index2 = items.findIndex(item => item.id === dragOverItem.current);
    index2 = index <= index2 ? index2 + 1 : index2;
    items.splice(index2, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;


    for (let i = 0; i < items.length; i++) {
      items[i].pos = i + 1;
    }

    setTodos(items);
  };


  const todo = todos.map((parent) => (

    <div
      draggable
      onDragStart={(e) => { dragItem.current = parent.id }}
      onDragEnter={(e) => { dragOverItem.current = parent.id }}
      onDragEnd={handleSort}
      onDragOver={(e) => { e.preventDefault() }}
      key={parent.id}
    >
      <Accordion expanded={expanded2 === parent.id} onChange={handleChange(parent.id)}  >

        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="primary" />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >


          <Typography sx={{ width: '40%', flexShrink: 0 }}>
            {parent.title}
          </Typography>
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Checkbox checked={checkedState[parent.id]}
              onChange={(e) => { handleChangeCheck(e, parent.id); checkedSubmit(e, parent) }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography sx={{ color: 'text.secondary', width: 150 }}>{parent.description}</Typography>
            <DeleteIcon color="primary" onClick={() => deleteTodo(parent.id)} />
            <AddIcon color="primary" onClick={(e) => { setId(parent.id); handleClickNested(e) }} />
          </Stack>
        </AccordionSummary>
        {nestedTodos.map((child) => {
          if (child.todoId === parent.id) {
            return <AccordionDetails key={child.id}>
              <Stack direction="row" justifyContent="space-evenly" spacing={2}>
                <Typography>
                  {child.title}
                </Typography>
                <Typography>
                  {child.description}
                </Typography>
                <Checkbox
                  checked={checkedState[child.id]}
                  onChange={(e) => { handleChangeCheck(e, child.id); checkedSubmit(e, child) }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
                <DeleteIcon color="primary" onClick={() => deleteNestedTodo(child.id)} />
              </Stack>
            </AccordionDetails>;
          }
          return null;
        })}

      </Accordion>


    </div>


  ));

  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx




  //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



  return (


    <Card sx={{ minWidth: 400, maxWidth: 1000, margin: 'auto', padding: 'auto' }}>
      <Stack>
        <Typography sx={{ margin: 'auto', fontSize: '3rem' }} color='primary'>
          Todo app
        </Typography>

        {todo}




        <Button aria-describedby={id} variant="contained" color='primary' onClick={(e) => { setId(0); handleClick(e) }}>
          Add Task
        </Button>
      </Stack>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{ width: '100%', height: '100%', margin: 'auto', padding: 'auto' }}
      >
        <Stack onSubmit={handleSubmit}>
          <TextField
            error={error}
            helperText={error}
            id="outlined-basic"
            label="Title"
            variant="outlined"
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError('') }}

          />
          <TextField
            id="outlined-basic"
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {idd === 0 ? <Button variant="contained" color='primary' onClick={handleSubmit} >Add todo</Button> : <Button color='primary' variant="contained" onClick={handleSubmit} >Add nested</Button>}
        </Stack>
      </Popover>

      {/*<Button onClick={() => console.log(item,draggedItemContent )}>debug</Button>*/}



      <Button
        variant='outlined'
        onClick={() => { dispatch({ type: "LOGOUT" }) }}
      >
        LOGOUT
      </Button>

    </Card>
  )
}
