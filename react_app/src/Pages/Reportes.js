import React from "react";
import NavVar from "../Components/NavVar";
import DataCard from "../Components/DataCard";
import Tabla from "../Components/Tabla";
import Barras from "../Components/Barras"
import Pastel from "../Components/Pastel"

import Like from '@material-ui/icons/ThumbUpRounded';
import Cat from '@material-ui/icons/Category';
import Book from '@material-ui/icons/MenuBookRounded';



class Reportes extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            data: ["200000", "5000", "123456"],
            columnas: ["NOMBRE", "FECHA", "MENSAJE", "HASHTAGS"]
        };
    }

    render() {
        return (
            <form>
                <NavVar/>
                <div class="row" style={{marginRight: 25, marginLeft: 25, marginTop: 25}}>
                    <DataCard nombre="NOTICIAS" dato={this.state.data[0]} icon = {<Book fontSize="large"/>} />
                    <DataCard nombre="HASHTAGS" dato={this.state.data[1]+" DIFERENTES"} icon={<Cat fontSize="large"/>}/>
                    <DataCard nombre="UPVOTES" dato={this.state.data[2]} icon={<Like fontSize="large"/>}/>
                </div>

                <div class="row" style={{marginRight: 25, marginLeft: 25, marginTop: 25}}>
                    <div class="col-sm-6">
                    <Barras/>
                    </div>
                    <div class="col-sm-6">
                    <Pastel/>
                    </div>
                </div >    
                    
                <div>
                    <Tabla columnas={this.state.columnas} tuplas={[]}/>
                </div>
            </form>
        );
    }
}

export default Reportes;