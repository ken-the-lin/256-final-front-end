import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import {OverlayTrigger} from 'react-bootstrap';
// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 }
//   // { name: 'Group D', value: 200 },
// ];
var global_prediction = ""

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    prediction, payload, percent, value, explanation
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  let red = '#f73131'
  let blue = '#4050f9'
  let f1 = red
  if (global_prediction === 'NEGATIVE' || global_prediction === 'SPAM'){
    f1 = blue
  }
  // let f2 = f1 === '#f73131' ? '#4050f9' : '#f73131'
  // let count = global_data[0].value
  // let total = glo
  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill='#000000'>{payload.name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={f1}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={f1}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={f1} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={f1} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
    </g>
  );
};

   //   <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
     //   {`(${(percent * 100).toFixed(2)}%)`}
     // </text>

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/hqnrgxpj/';

  state = {
    activeIndex: 0,
  };

  onPieEnter = (data, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    let { data, prediction } = this.props
    global_prediction = prediction
    console.log("pichar props", this.props)
    return (
          <PieChart width={400} height={400}>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx={200}
              cy={200}
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
            />
          </PieChart>)
  }
}
              // onMouseEnter={this.onPieEnter}