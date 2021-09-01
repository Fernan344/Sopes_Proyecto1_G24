import React from 'react'
import { Bar } from 'react-chartjs-2'

class DataCard extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
        };
    }

    render(){
       
        return(                   
                <Bar data={{
                    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange', 'Black'],        
                    datasets: [{
                        label: 'UpVotes',
                        data: [12, 15, 25, 12, 25, 38, 40],
                        borderColor: 'red',
                        backgroundColor: 'white',
                        borderWidth: 2,
                        borderRadius: 40,
                        borderSkipped: false,
                    },
                    {
                        label: 'DownVotes',
                        data: [-21, -41, -35, -18, -15, -17, -12],
                        borderColor: 'white',
                        backgroundColor: 'red',
                        borderWidth: 2,
                        borderRadius: 40,
                        borderSkipped: false,
                    }]                    
                }}              
                height={290}
                widht={75}
                options={{
                    indexAxis: 'y',
                    // Elements options apply to all of the options unless overridden in a dataset
                    // In this case, we are setting the border of each horizontal bar to be 2px wide
                    elements: {
                    bar: {
                        borderWidth: 2,
                    }
                    },
                    responsive: true,
                    plugins: {
                    legend: {
                        position: 'right',
                    },
                    title: {
                        display: true,
                        text: 'Chart.js Horizontal Bar Chart'
                    }
                    }
                }}
            />            
        ) 
    }
}
  
  export default DataCard