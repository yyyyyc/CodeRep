// Index.tsx
// -----------------------------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const reducer = (state = 0, action: any) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;
    case 'DECREMENT':
      return state - action.payload;
    default:
      return state;
  }
};

const store = configureStore({reducer});

store.subscribe(() => {
  // document.getElementById ("adsf").value = ""
  console.log('current state', store.getState());
});

store.dispatch({
  type: 'INCREMENT',
  payload: 1
});

store.dispatch({
  type: 'INCREMENT',
  payload: 5
});

store.dispatch({
  type: 'DECREMENT',
  payload: 2
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();




// App.tsx
// -----------------------------------------------------------------------------------------

import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';


interface ISwitch {
  ip: string,
  name: string
}

interface ISwitchArr extends Array<ISwitch>{}

function App() {
  
  return (
    <div className="App" style={{width: "100vh",  height: "100vh"}}>
      <header className="App-header">
        <MainComp></MainComp>
      </header>
    </div>
  );
}

export default App;


export function MainComp(props: any) {
  return (
    <div style={{background:"yellow", width: "100vh",  height: "100vh"}}>
      <NavComp></NavComp>
      <div style={{display:"flex", height: "700px"}} >
        <span  style={{width: "50vh",  height: "700px"}}>
          <LeftComp></LeftComp>
        </span>
        <span  style={{width: "50vh",  height: "700px"}}>
          <RightComp></RightComp>
        </span>
      </div>
    </div>
  );
}

function Inc () {
  const dispatch: any = useDispatch ();

  dispatch({
    type: 'INCREMENT',
    payload: 5
  });
}


export function NavComp(props: any) {

  const state_num: any = useSelector (state => state);

  const [color, setColor] = useState("red"); 
  
  let color2: string = "green";

    
  return (
    <div  style={{background: color, width: "100vh", height: "200px" }}>

      <span id="spnNum">{ state_num }</span>

      <button onClick={() => setColor("pink")}>pink</button>
      <button onClick={() => setColor("cyan")}>cyan</button>
      <button onClick={() => setColor("yellow")}>yellow</button>

    </div>
  );
}
  

export function RightComp() {

  const [switches, setSwitches] = React.useState<ISwitchArr>([]);
  let isLoading: any = false;

  useEffect(() => {
    isLoading = true;
    fetch('http://localhost:32362/switch')
    .then((res) => res.json())
    .then((data) => {
      setSwitches(data);
      isLoading = false;
    })
  }, []);

  return (
    <div className="clsRightComp" style={{background:"pink",  height: "700px"}}>
      
      { isLoading && <div className="clsLoading">Loading..<b>{isLoading}</b></div>}
        {
        switches.map (sw => 
            <div className="clsRightCompSwitchRow">
                <span className="clsRightCompSwitchCell">{sw.ip}</span>
                <span className="clsRightCompSwitchCell">{sw.name} </span>
            </div>)
        }
    </div>
  );
}

export function AddComp() {

  const dispatch: any = useDispatch ();

  return (
    <div  style={{background:"grey"}}>

      <button onClick={()=> 
        dispatch({
          type: 'INCREMENT',
          payload: 1
        })
      }>Increment</button>

      <button onClick={()=> 
        dispatch({
          type: 'DECREMENT',
          payload: 1
        })
      }>Decrement</button>      

    </div>
  );
}
export function LeftComp() {
  return (
    <div  style={{background:"purple",  height: "700px"}}>
      <AddComp></AddComp>
    </div>
  );
}


// SwitchController.cs
// -----------------------------------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BL;
//using Microsoft.AspNetCore.Cors;
using System.Web.Http.Cors;
using Microsoft.AspNetCore.Mvc;

namespace NIRMRORDYC.Controllers
{
    [EnableCors (origins:"*", headers:"*", methods:"*")]
    [ApiController]
    [Route("[controller]")]
    public class SwitchController : ControllerBase
    {
        [EnableCors(origins: "*", headers: "*", methods: "*")]
        [HttpGet]
        public IEnumerable<SwitchDTO> Get()
        {
            SwitchManager sm = new SwitchManager();
            return sm.GetSwitches();
        }
    }
}


SwitchDTO.cs
// -----------------------------------------------------------------------------------------

namespace BL
{
    // DTO = Data Transfer Object
    [Serializable]
    public class SwitchDTO
    {
        public string IP { get; set; }
        public string Name { get; set; }

        public override string ToString()
        {
            return string.Format("Name: {0}, IP:{1}", Name, IP);
        }
    }
}


// SwitchManager.cs
// -----------------------------------------------------------------------------------------

using System.Collections.Generic;
using System.Data;
using DAL;

namespace BL
{
    //Business Logic

    public class SwitchManager
    {
        public List<SwitchDTO> GetSwitches()
        {
            List<SwitchDTO> switches = new List<SwitchDTO>();
            SqlDAL dal = new SqlDAL("Persist Security Info=False;User ID=sa;Pwd=sa_123456;Initial Catalog=AccessLayers;Data Source=.");
            DataTable table = dal.SelectTable("select networkEntityIP, networkEntityName from pnConfNetworkEntities");
            foreach (DataRow row in table.Rows)
            {
                SwitchDTO dto = new SwitchDTO();
                dto.IP = row["networkEntityIP"].ToString();
                dto.Name = row["networkEntityName"].ToString();
                switches.Add(dto);
            }
            
            return switches;
        }
    }
}

SqlDAL.cs
// -----------------------------------------------------------------------------------------

using System;
using System.Data;
using System.Data.SqlClient;

namespace DAL
{
    //Data Access Layer:
    //Select,Delete,Insert,Modify database data
    public class SqlDAL
    {
        private string _connectionString;

        public SqlDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        public DataTable SelectTable(string query)
        {
            DataTable result = null;
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(query, conn);
                result = new DataTable("result");
                result.Load(cmd.ExecuteReader(CommandBehavior.KeyInfo));

            }
                return result;
        }
        public static DataTable Test()
        {
            SqlDAL dal = new SqlDAL("Persist Security Info=False;User ID=sa;Pwd=sa_123456;Initial Catalog=AccessLayers;Data Source=.");

            DataTable dt = dal.SelectTable("select networkEntityIP, networkEntityName from pnConfNetworkEntities");
            return dt;
        }
    }
}


