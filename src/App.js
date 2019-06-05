import React from 'react';
import { Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import withQuery from 'with-query'
import Bar from './bar.js'
import PieChart from './pichart.js'
import Chart from 'react-google-charts';

// var sentence = "I hate this resturant, Never come here"
//I hate this resturant, Never come here
//This is the best Chinese restaurant I have ever been
// I don't like this resturant, but its food is good
const getPercent = (num) => {
  return Math.round(num*10000) / 100
}
class Word extends React.Component{
  weightToLight(weight){
    let w = Math.abs(weight)
    if (w > 2.5)
      return  "30"
    if (2.5 >= w && w > 2)
      return  "40"
    if (2 >= w && w > 1.5)
      return  "50"
    if (1.5 >= w && w > 1)
      return  "60"
    if (1 >= w && w > 0.5)
      return  "70"
    if (0.5 >= w)
      return  "80"

  }
  w_style(word, isColored, prediction, weight) {
      let bg_color = "white" 
      let text_color = "black"
      let light = this.weightToLight(weight)
      let red = "hsl(1, 100%, " + light + "%)"
      let blue = "hsl(245, 100%, " + light + "%)"
      let _pred = prediction
      if (prediction === 'SPAM' || prediction == 'NOTSPAM'){
        _pred = prediction === 'SPAM' ? 'NEGATIVE' : 'POSITIVE'
      }
      if (isColored){
        if (_pred === "NEGATIVE" && weight > 0)
          bg_color = blue
        if (_pred === "NEGATIVE" && weight < 0)
          bg_color = red
        if (_pred === "POSITIVE" && weight > 0)
          bg_color = red
        if (_pred === "POSITIVE" && weight < 0) //
          bg_color = blue
        // bg_color = prediction === "NEGATIVE" ? red : blue
        text_color = "white"
      }
      return {
        backgroundColor: bg_color,
        color: text_color
      }
  }

  render(){
    let { word, prediction, isColored, weight } = this.props;
    let word_style = this.w_style(word, isColored, prediction, weight)
    let word_info = <Tooltip id={word + weight}>
                      weight: {weight}
                    </Tooltip>
    return (
      <OverlayTrigger key={word + weight} trigger='hover' overlay={word_info}>
        <span> <span style={word_style}>{word}</span> </span>
      </OverlayTrigger>
    )
  }
}

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      textInput: "",
      result: {prediction: null, word_to_color: [], contributions: [], word_count_total: []}
    }
    this.model_id = React.createRef()
    this.handleClick = this.handleClick.bind(this)
  }

  extract(data){
    // .log("my data", data)
    // console.log("backend", data)
    let { prediction, targets } = data
    let weighted_spans = targets[0].weighted_spans
    let word_count_total = targets[0].word_count_total
    let words = weighted_spans.map(ws => ws[0])
    let contributions = weighted_spans.map(ws => ws[2])
    // console.log(words)
    // console.log(contributions)
    return { prediction, words, contributions, word_count_total }
  }

  handleClick(e){
    fetch(withQuery('http://127.0.0.1:5000/explain', {
      model_id: this.model_id.current.value,
      sentence: this.state.textInput
    }))
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(data => {
      console.log('data I got', data)
        let { prediction, words, contributions, word_count_total } = this.extract(data)
        this.setState({
          result: { 
            prediction: prediction, 
            word_to_color: words, 
            contributions: contributions, 
            word_count_total: word_count_total
          }
        })

    })
  }

  _makeExplanation(percent, word, pred){
    // console.log(this.state.result)
    let status = 'disconfirm'
    let { prediction, contributions, word_to_color } = this.state.result
    let weight = word_to_color.findIndex(w => w === word)
    if (prediction === 'POSITIVE' && weight >= 0)
      status = 'confirm'
    if (prediction === 'NEGATIVE' && weight >= 0)
      status = 'confirm'
    let message = percent + '% of all reviews that contain the word \"' + word + "\"" +
                  " are " + pred
    return <span> {message} </span>
  }

  _renderPicharts(){
    let { word_count_total } = this.state.result
    // console.log("myprops", this.props.counts)
    let mydata = word_count_total.map( obj => {
      let { word, count, total } = obj
      return [
        {name: word, value: count},
        {name: word, value: total - count}
      ]
    })
    return mydata.map((d,i)=>{
      let count = d[0].value
      let rest = d[1].value
      let word = d[0].name
      let percent = getPercent(count/(count + rest))
      return (
        <Col md={{ offset: 3, span:9}} key={i}>
          <Row>
            <Col md={4}>
              <PieChart data={d}/>
            </Col>
            <Col md={6}>
              <div style={{"marginTop": "100px"}}>
                {this._makeExplanation(percent, word, this.state.result.prediction)}
              </div>
            </Col>
          </Row>
        </Col>
      )
    })
  }
        // <Col sm={{ offset: 3, span: 3}} md={{ offset: 3, span:3}} key={i}>

  render(){
    // console.log('state', this.state)
    let { textInput, result } = this.state
    return (
      <div className="App">
        <Row>

          <Col sm={{ offset: 3, span: 6}} md={{ offset: 3, span:6}}>
            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Input Sentence</Form.Label>
              <Form.Control as="textarea" rows="3" ref={node => this.textInput = node} onChange={e => this.setState({textInput: e.target.value})}/>
            </Form.Group>
            <Form.Control as="select" ref={this.model_id}>
              <option>1</option>
              <option>2</option>
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Col sm={{ offset: 3, span: 6}} md={{ offset: 3, span:6}}>
            <Button size='sm' onClick={() => this.handleClick()}> Click </Button>
          </Col>
        </Row>
        <Row>
          <Col sm={{ offset: 3, span: 6}} md={{ offset: 3, span:6}}>
            <div>
              prediction result: {result.prediction}
            </div>
            <div style={{padding: "40px"}}> 
            {textInput.split(" ").map((w, i) => {
              let word_index = result.word_to_color.findIndex(_w => _w === w)
              let isColored = word_index === -1 ? false : true; //no need to color the word
              let weight = word_index === -1 ? 0 : result.contributions[word_index]
              weight = Math.round(weight * 10000) / 10000
              return <Word key={i} word={w} prediction={result.prediction} isColored={isColored} weight={weight} /> 
            })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col sm={{ offset: 3, span: 6}} md={{ offset: 3, span:6}}>
            <Bar result={this.state.result}/>
          </Col>
        </Row>
        <Row>
            {this._renderPicharts()}
        </Row>
        <Row>

        </Row>
    </div>
    );
  }
}

export default App;
