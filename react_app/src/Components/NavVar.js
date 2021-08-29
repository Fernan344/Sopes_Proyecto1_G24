import React from 'react'


class NavVar extends React.Component {
    render(){
      return(
        <form action="Busqueda" method="POST">
              <nav class="navbar navbar-expand-lg navbar-light bg-light">
                  <a class="navbar-brand" href="/Principal">Inicio</a>
                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                      <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul class="navbar-nav mr-auto">
                          <li class="nav-item active">
                              <a class="nav-link" href="/Principal">Linea De Tiempo</a>
                          </li>                        
                      </ul>
                  </div>                      
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                      <ul class="navbar-nav mr-auto">
                          <li class="nav-item">
                              <a class="nav-link" href="/reportes">Reportes</a>
                          </li>           
                      </ul>
                  </div>
              </nav>
        </form>
      )
    }
  }
  
  export default NavVar