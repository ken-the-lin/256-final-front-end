import React, { PureComponent } from 'react';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

// const data = [
//   {
//     name: 'I', neg: -0.8, pos: 0.2, amt: 2400,
//   },
//   {
//     name: 'am', neg: -0.7, pos: 0.3, amt: 2210, 
//   },
//   {
//     name: 'a', neg: -0.6, pos: 0.4, amt: 2290, 
//   },
//   {
//     name: 'hood', neg: -0.5, pos: 0.5, amt: 2000, 
//   },
//   {
//     name: 'man', neg: -0.4, pos: 0.6, amt: 2181, 
//   },
//   {
//     name: 'loveliness', neg: -0.3, pos: 0.7, amt: 2500, 
//   },
//   {
//     name: 'piece', neg: -0.2, pos: 0.8, amt: 2100, 
//   },
// ];

const data = []
export default class Example extends PureComponent {
  static jsfiddleUrl = 'https://jsfiddle.net/alidingling/p82xhe2a/';

  render() {
    let { result } = this.props
    let data = result.word_to_color.map((w,i) => {
      let pred = result.prediction
      let contr = result.contributions[i]
      let neg = 0
      let pos = 0

      if (pred === 'NEGATIVE' && contr > 0)
        neg = contr * -1
      if (pred === 'POSITIVE' && contr < 0)
        neg = contr

      if (pred === 'POSITIVE' && contr > 0)
        pos = contr
      if (pred === 'NEGATIVE' && contr < 0)
        pos = contr * -1

      return {
        word: w, neg: neg, pos: pos, amt: 2000
      }
    })

    return result.prediction ? (
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
        <XAxis dataKey="word" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign='top'/>
        <ReferenceLine y={0} stroke="#000" />
        <Bar dataKey="pos" fill="#0000ff" stackId="stack" />
        <Bar dataKey="neg" fill="#ff0000" stackId="stack" />
      </BarChart>
    ) : null;
  }
}
