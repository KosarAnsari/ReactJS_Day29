import {
  lazy,
  Suspense,
  useActionState,
  useReducer,
  useState,
  use,
} from 'react';
import './App.css';
//import User from './User';
const fetchdata = () =>
  fetch('https://dummyjson.com/users').then((response) => response.json());

const userRes = fetchdata();

const emptyData = {
  uname: '',
  upass: '',
  uemail: '',
  ucity: '',
  uaddress: '',
};

const reducer = (dta, actn) => {
  return { ...dta, [actn.type]: actn.val };
};

function App() {
  const [Load, setLoad] = useState(false);
  const User = lazy(() => import('./User'));

  const [state, dispatch] = useReducer(reducer, emptyData);
  console.log(state);

  const [name, setname] = useState('');
  const [nameErr, setNameErr] = useState('');

  const [password, setpassword] = useState('');
  const [passErr, setpassErr] = useState('');

  const handleName = (event) => {
    console.log(event.target.value);
    if (event.target.value.length > 5) {
      setNameErr(
        'Please enter valid user name , only 5 characters are allowed'
      );
    } else {
      setNameErr('');
    }
  };

  const handlePassword = (event) => {
    let regex = /^[A-Z0-9]+$/i;
    if (!regex.test(event.target.value)) {
      setpassErr('enter valid password,only number and alphabets are allowed.');
    } else {
      setpassErr('');
    }
  };

  const handleLogin = (prevdata, currdata) => {
    let Name = currdata.get('Name');
    let Password = currdata.get('Password');
    let regex1 = /^[A-Z0-9]+$/i;

    if (!Name || Name.length > 5) {
      return {
        error: 'Name can not be empty and should not contain more than 5 char.',
        Name,
        Password,
      };
    } else if (!regex1.test(Password)) {
      return {
        error: 'Password can contain only numbers and alphabets.',
        Name,
        Password,
      };
    } else {
      return { message: 'Successfully Logged In.', Name, Password };
    }
  };

  const [data, action, pending] = useActionState(handleLogin);

  return (
    <>
      <h1>Simple Validation in React JS</h1>
      <input
        type="text"
        placeholder="Enter Name"
        onChange={handleName}
        className={nameErr ? 'error' : ''}
      />
      <span className="red-color">{nameErr && nameErr}</span>
      <br />
      <br />
      <input
        type="text"
        placeholder="Enter Password"
        onChange={handlePassword}
        className={passErr ? 'error' : ''}
      />
      <span className="red-color">{passErr && passErr}</span>
      <br />
      <br />
      <button disabled={passErr || nameErr}>Log In</button>

      <h1>Validation using useAction</h1>
      <p>why? because using too many states can slow down your application.</p>
      {data?.message && <span style={{ color: 'green' }}>{data.message}</span>}
      {data?.error && <span style={{ color: 'red' }}>{data?.error}</span>}
      <form action={action}>
        <input
          defaultValue={data?.Name}
          type="text"
          name="Name"
          placeholder="Enter user name"
        />
        <br />
        <br />
        <input
          defaultValue={data?.Password}
          type="text"
          name="Password"
          placeholder="Enter Password"
        />
        <br />
        <br />
        <button>Log In</button>
      </form>
      <h1>useReducer Hook</h1>
      <div>
        <input
          type="text"
          placeholder="enter name"
          onChange={(event) =>
            dispatch({ val: event.target.value, type: 'uname' })
          }
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="enter Password"
          onChange={(event) =>
            dispatch({ val: event.target.value, type: 'upass' })
          }
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="enter email"
          onChange={(event) =>
            dispatch({ val: event.target.value, type: 'uemail' })
          }
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="enter city"
          onChange={(event) =>
            dispatch({ val: event.target.value, type: 'ucity' })
          }
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="enter address"
          onChange={(event) =>
            dispatch({ val: event.target.value, type: 'uaddress' })
          }
        />
        <br />
        <br />
      </div>

      <ul>
        <li>Name:{state.uname}</li>
        <li>Password:{state.upass}</li>
        <li>email:{state.uemail}</li>
        <li>city:{state.ucity}</li>
        <li>address:{state.uaddress}</li>
      </ul>

      <button onClick={() => console.log(state)}>Add Details</button>

      <h1>Lazy Loading in React JS</h1>
      <h4>
        saves you from unnecessary calling of components that makes app run
        slower.
      </h4>
      {Load ? (
        <Suspense fallback={<h3>Loading...</h3>}>
          <User />
        </Suspense>
      ) : null}
      {/*{Load ? <User /> : null} */}
      <button onClick={() => setLoad(true)}>Load User</button>

      <h2>"use" API, its not a Hook</h2>
      <div>
        <Suspense fallback={<p>loading...</p>}>
          <Users userRes={userRes} />
        </Suspense>
      </div>
    </>
  );
}
export default App;

const Users = ({ userRes }) => {
  const userData = use(userRes);
  console.log(userData.users);
  return (
    <>
      <div>
        <h3>Users List</h3>
        {userData?.users?.map((user, idx) => (
          <p key={idx}>{user.firstName}</p>
        ))}
      </div>
    </>
  );
};
