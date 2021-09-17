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
            principalData: ["200000", "5000", "123456"],
            cakeLabels: ['remo', 'bala', 'natacion', 'lanza', 'atletismo'],
            cakeData: [15, 25, 30, 45, 500],
            barLabels: ['01/09/2021', '02/09/2021', '03/09/2021', '04/09/2021', '05/09/2021', '06/09/2021', '07/09/2021'],
            barData: [[15, 50, 500, 100, 800, 505, 550], [-5, -400, -500, -850, -915, -1010, -12000]],
            columnas: ["NOMBRE", "FECHA", "MENSAJE", "HASHTAGS"],
            report: "ambos"
        };

        this.setAmbos = this.setAmbos.bind(this);
        this.setBarras = this.setBarras.bind(this);
        this.setPastel = this.setPastel.bind(this);
    }

    setAmbos(){
        this.setState({
            report: "ambos"
        })
    }

    setBarras(){
        this.setState({
            report: "bar"
        })
    }

    setPastel(){
        this.setState({
            report: "cake"
        })
    }

    render() {
        let ambos = [
            <div class="row" style={{marginRight: 25, marginLeft: 25, marginTop: 25}}>
                <div class="col-sm-6">
                    <Barras altura={230} labels={this.state.barLabels} upvotes={this.state.barData[0]} downvotes={this.state.barData[1]}/>
                </div>,
                <div class="col-sm-5" style={{left: 70}}>
                    <Pastel labels={this.state.cakeLabels} data={this.state.cakeData}/>
                </div>
            </div>
        ]

        let onlyBars = [
            <div style={{marginRight: 25, marginLeft: 25, marginTop: 25, left: 200}}>
                <Barras altura={150} labels={this.state.barLabels} upvotes={this.state.barData[0]} downvotes={this.state.barData[1]}/>
            </div>
        ]
        let onlyCake = [
            <div style={{marginRight: 25, marginLeft: 25, width: 800, marginTop: 25}}>
                <div class="col" style={{left: 250}}>
                    <Pastel labels={this.state.cakeLabels} data={this.state.cakeData}/>
                </div>
            </div>
        ]

        var report = ambos;

        if(this.state.report == "ambos"){
            report=ambos;
        }
        if(this.state.report == "bar"){
            report=onlyBars;
        }
        if(this.state.report == "cake"){
            report=onlyCake;
        }
        
        return (
            <form>
                <NavVar/>
                <div class="row" style={{marginRight: 25, marginLeft: 25, marginTop: 25}}>
                    <DataCard nombre="NOTICIAS" dato={this.state.principalData[0]} icon = {<Book fontSize="large"/>} />
                    <DataCard nombre="HASHTAGS" dato={this.state.principalData[1]+" DIFERENTES"} icon={<Cat fontSize="large"/>}/>
                    <DataCard nombre="UPVOTES" dato={this.state.principalData[2]} icon={<Like fontSize="large"/>}/>
                </div>

                <div>
                    {report}      
                </div>

                <div class="row" style={{marginRight: 25, marginLeft: 25, marginTop: 25, marginBottom: 25}}>
                    <div class="col-sm-4" id="divBar">
                        <button type="button" class="btn btn-outline-danger btn-block" onClick={this.setBarras}>Barras</button>
                    </div>
                    <div class="col-sm-4" id="divCake">
                        <button type="button" class="btn btn-outline-danger btn-block" onClick={this.setAmbos}>Ambos</button>
                    </div>
                    <div class="col-sm-4" id="divCake">
                        <button type="button" class="btn btn-outline-danger btn-block" onClick={this.setPastel}>Pastel</button>
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