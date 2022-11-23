import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import { Outlet, Link } from "react-router-dom";
import ListComp from './ListComp';


function App(props: any) {

  const shoot = (msg: string) => {
    alert("Great Shot! " + msg);
  }

  const cond:boolean = true; 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
        {props.color} Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <props.children></props.children>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <button onClick={() => shoot("Goal!")}>Take the shot!</button>

<hr/>
<span>This is a button</span>

<Button color="red" value={cond} title="BBBTTTBBB">
  BBBTTTBBB
</Button>
            
      <a href = "/blogs">blooogs</a>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="contact" element={<Contact />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>

      </header>


    </div>
  );
}

export default App;



const Home = () => {
  return <>
    <h1>Home</h1>
    <ListComp />
  </>
};

const Blogs = () => {
  return <h1>Blog Articles</h1>;
};

const Contact = () => {
  return <h1>Contact Me</h1>;
};

const NoPage = () => {
  return <h1>404</h1>;
};

const Layout = () => {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/blogs">Blogs</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>

      <Outlet /> 
    </>
  )
};

export interface ButtonProps
{
  value: boolean;
  color: string;
  disabled?: boolean;
  text?: string;
  indeterminate?: boolean;
  title?: string;
}

export const Button: React.FunctionComponent<React.PropsWithChildren<ButtonProps>> = (
  props
) => {
  const s = {
    color: "red",
    padding: "12px",
    border: "1px solid grey",
    background: "lightgreen"
  }
  
  console.log("child", props.children); 
  console.log("props", props); 
  
  const {value, color, disabled, text, indeterminate, title, children} = props;
  return (
    <>
      <span title={props.title} style={s}> {props.children}</span>
      <button> {props.children} - {props.color} -</button>
    </>
  );
}

export const CompGenerics: React.FunctionComponent<React.PropsWithChildren<any>> = (
  props
) => {
    
  
  console.log("props", props); 
  
  return (
    <>
      <span> {props.children}</span>
      
    </>
  );
}