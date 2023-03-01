import React, { useContext, useState } from 'react'
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import Box from '@material-ui/core/Box';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import swal from 'sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';



const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(email) {
  // let string = `http://localhost:3001/authentification?email=${email}`;
  // console.log(string);
  return fetch(`http://localhost:3001/authentification?email=${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(data => data.json())
}


export default function SignIn() {
  const classes = useStyles();
  // const navigate = useNavigate();

  const [email, setemail] = useState();

  const {dispatch} = useContext(AuthContext)
    

  const handleSubmit = async e => {
    e.preventDefault();
    console.log("in handling submit function ")
    const response = await loginUser(
      email,
    );
    console.log(response)
    try {
      const hasId = response.every(obj => obj.hasOwnProperty("id"));
      console.log(hasId);
      if (hasId) {
      
            // localStorage.setItem('email', JSON.stringify(response[0]['email']));
            // localStorage.setItem('id', JSON.stringify(response[0]['id']));
            // window.location.href = "/app";
            // console.log("something ");
            // navigate('/app');
            dispatch({type: 'LOGIN', payload : {id: JSON.stringify(response[0]['id']),email}})
  
            
      }
    } catch (err) {
      alert("incorrect email")
    }
  }



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <EmojiPeopleIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit} >
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={e => setemail(e.target.value)}

          />


          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>

        </form>
      </div>
      <Box mt={8}>

      </Box>
      <p>dont have an account ? <Link to="/signup">register</Link></p>
    </Container>
  );
}