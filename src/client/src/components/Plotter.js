import React from "react";
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'highcharts-react-official';

export default class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.placeholder = this.placeholder.bind(this);
    
  }

  placeholder() {

  }

  render() {
    const plotOptions = {
        title: {
          text: this.props.title
        },
        yAxis: {
            title: {
                text: 'Price ($)'
            }
        },
        xAxis: {
            title: {
                text: 'Date'
            },
            categories: this.props.xdata

        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: Object.entries(this.props.ydata).map(e => {
            return {
                name: e[0],
                data: e[1]
            }
        })    
    };

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={plotOptions}
        />
    );
  }

}