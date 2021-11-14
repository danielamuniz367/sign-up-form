import './App.css';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button'

const url = "https://5r2cql08l4.execute-api.us-east-1.amazonaws.com/register";

function SignupForm(){
  const [userState, setUserState] = useState({});
  const [errorObj, setErrorObj] = useState({});
  const [message, setMessage] = useState({success: false, message: ''});

  useEffect(()=>{
    setTimeout(()=> {
      setMessage({success: false, message: ''});
    }, 10000)
  }, [message])

  const handleUserChange = (e) => {
    setUserState({...userState, 
      [e.target.name]: e.target.value
  });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': "application/json"
      },
      body: JSON.stringify(userState)
  })
  .then(res => {
    if(res.ok) {
      setMessage({success: true, message: "Successful Sign-up to Ollie!"});
      setUserState({
        email: "",
        password: "",
        confirmPassword: "",
        petName: "",
        petWeight: "",
        idealPetWeight: ""
      }); 
    }
    if(res.status === 400){
      res.json().then(data => {
        setMessage({success: false, message: data.message});
      })
    }
    if(res.status === 500){
      setMessage({success: false, message: "Something went wrong. Please try again."});
    }
  })
  }

  const validate = (e) => {
    switch (e.target.name) {
      case "email":
        return checkEmail(e.target.value);
      case "password":
        return checkPassword(e.target.value);
      case "confirmPassword":
        return confirmPassword(e.target.value);
      case "petName":
        return checkPetName(e.target.value);
      case "petWeight":
        return checkPetWeight('pw', e.target.value);
      case "idealPetWeight":
        return checkPetWeight('ipw', e.target.value);
      default:
        return errorObj;
    }
  }

  function checkEmail(str) {
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!re.test(str)){
        setErrorObj({...errorObj, email: "Invalid email"});
      }
      else setErrorObj({...errorObj, email: ""});
  }

  function checkPassword(str){
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if(!re.test(str)){
      setErrorObj({...errorObj, password: "Password does not meet requirement of min 8 characters, 1 number, 1 letter, 1 special characters"});
    }
    else setErrorObj({...errorObj, password: ""})
  }

  function confirmPassword(str){
    if(userState.confirmPassword !== userState.password) {
      setErrorObj({...errorObj, confirmPassword: "Passwords do not match"})
    }
    else setErrorObj({...errorObj, confirmPassword: ""})
  }

  function checkPetName(str){
    if(str.length < 2)
      setErrorObj({...errorObj, petName: "There should at least be 2 characters in your pet's name"});
    else setErrorObj({...errorObj, petName: ""})
  }

  function checkPetWeight(pw, str){
    let weight = parseInt(str);
    if(pw === 'pw') {
      if(!str || weight < 3 || weight > 180){
        setErrorObj({...errorObj, petWeight: "Pet weight should be minimum 3 lbs and maximum 180 lbs"});
      }
      else setErrorObj({...errorObj, petWeight: ""});
    } 
    if(pw === 'ipw') {
      if(weight < 3 || weight > 180)
        setErrorObj({...errorObj, idealPetWeight: "Pet weight should be minimum 3 lbs and maximum 180 lbs"});
      else setErrorObj({...errorObj, idealPetWeight: ""});
    }
  }

  return (
    <div className="wrapper">
      <div className="float-container">
        <img className="float-child" src="https://via.placeholder.com/600" aria-label="image"></img>
        <form className="float-child" aria-label="Signup Form" onSubmit={handleSubmit}>
          <label for="e-mail">Email</label>
          <br />
          <input name="email" type="text" value={userState.email} onChange={handleUserChange} onBlur={validate}
            aria-label="email" aria-describedby="email_err" required/>
          <span className="error" id="email_err">{errorObj.email}</span>
          <br />
          <label for="password">Password</label>
          <br />
          <input name="password" type="password" value={userState.password} onChange={handleUserChange} onBlur={validate} 
            aria-label="password" aria-describedby="password_err" required/>
          <span className="error" id="password_err" aria-live="polite">{errorObj.password}</span>
          <br />
          <label for="confirm password">Confirm Password</label>
          <br />
          <input name="confirmPassword" type="password" value={userState.confirmPassword} onChange={handleUserChange} onBlur={validate} 
            aria-label="confirm password" aria-describedby="confirmPassword_err" required/>
          <span className="error" id="confirmPassword_err" aria-live="polite">{errorObj.confirmPassword}</span>
          <br />
          <label for="pet name">Pet Name</label>
          <br />
          <input name="petName" type="text" value={userState.petName} onChange={handleUserChange} onBlur={validate}
            aria-label="pet name" aria-describedby="petName_err" required/>
          <span className="error" id="petName_err">{errorObj.petName}</span>
          <br />
          <label for="pet weight">Pet Weight</label>
          <br />
          <input name="petWeight" type="number" min="3" max="180" value={userState.petWeight} onChange={handleUserChange} onBlur={validate}
            aria-label="pet weight" aria-describedby="petWeight_err" required/>
          <span className="error" id="petWeight_err" aria-live="polite">{errorObj.petWeight}</span>
          <br />
          <label for="ideal pet weight">Ideal Pet Weight</label>
          <br />
          <input name="idealPetWeight" type="number" min="3" max="180" value={userState.idealPetWeight} onBlur={validate} onChange={handleUserChange}
            aria-label="ideal pet weight" aria-describedby="idealPetWeight_err" />
          <span className="error" id="idealPetWeight_err" aria-live="polite">{errorObj.idealPetWeight}</span>
          <br />
          <Button variant="primary" size="md" className="submitButton" aria-label="submit" type="submit">Submit</Button>
        </form>
      </div>
      <MessageBanner message={message} />
    </div>
  )
}

function MessageBanner({message}){
  const isSuccess = message.success;
  console.log(isSuccess);
  return (
    <div className="msg-banner" tabIndex="0" role="message banner" style={{color: isSuccess ? "green" : "red"}} aria-label={message.message}>{message.message}</div>
  )
}

function App() {
  return (
    <SignupForm />
  );
}

export default App;
