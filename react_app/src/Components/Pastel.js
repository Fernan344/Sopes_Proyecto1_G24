import React from 'react'
import { Pie } from 'react-chartjs-2'

class DataCard extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
        };
    }

    render(){
       
        return(                   
                <Pie data={{
                    labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'],    
                    datasets: [
                        {
                        label: 'Dataset 1',
                        data: [1, 5, 10, 15, 25],
                        backgroundColor: [
                            'red', 'blue', 'yellow', 'black', 'pink'
                        ]
                        }
                    ]                  
                }}              
                height={10}
                widht={10}
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
                        text: 'Top 5 HashTags'
                    }
                    }
                }}
            />            
        ) 
    }
}
  
  export default DataCard