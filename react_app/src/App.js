import React from "react";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import Principal from "./Pages/Principal";

function App() {
  return(
    <BrowserRouter>
        <Route path="/" component={Principal} />
        <Route path="/" render={() => <Redirect to="/" />} exact={true} />
    </BrowserRouter> 
  ); 
}

export default App;