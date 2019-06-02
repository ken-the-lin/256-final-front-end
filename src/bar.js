import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

const data = [
  {
    name: 'I', neg: -0.8, pos: 0.2, amt: 2400,
  },
  {
    name: 'am', neg: -0.7, pos: 0.3, amt: 2210, 
  },
  {
    name: 'a', neg: -0.6, pos: 0.4, amt: 2290, 
  },
  {
    name: 'hood', neg: -0.5, pos: 0.5, amt: 2000, 
  },
  {
    name: 'man', neg: -0.4, pos: 0.6, amt: 2181, 
  },
  {
    name: 'loveliness', neg: -0.3, pos: 0.7, amt: 2500, 
  },
  {
    name: 'piece', neg: -0.2, pos: 0.8, amt: 2100, 
  },
];

export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/p82xhe2a/';

  render() {
    return (
      <BarChart
        width={700}
        height={300}
        data={data}
        stackOffset="sign"
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign='top'/>
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="pos" fill="#0000ff" stackId="stack" />
        <Bar dataKey="neg" fill="#ff0000" stackId="stack" />
      </BarChart>
    );
  }
}
