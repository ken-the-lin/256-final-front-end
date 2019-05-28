import React from 'react';
import { Button, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import withQuery from 'with-query'


// var sentence = "I hate this resturant, Never come here"
//I hate this resturant, Never come here
//This is the best Chinese restaurant I have ever been
// I don't like this resturant, but its food is good
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
      if (isColored){
        if (prediction === "NEGATIVE" && weight > 0)
          bg_color = blue
        if (prediction === "NEGATIVE" && weight < 0)
          bg_color = red
        if (prediction === "POSITIVE" && weight > 0)
          bg_color = red
        if (prediction === "POSITIVE" && weight < 0) //
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
      result: {prediction: null, word_to_color: [], contributions: []}
    }
    this.model_id = React.createRef()
  }

  extract(data){
    // .log("my data", data)
    let { prediction, targets } = data
    let weighted_spans = targets[0].weighted_spans
    let words = weighted_spans.map(ws => ws[0])
    let contributions = weighted_spans.map(ws => ws[2])
    // console.log(words)
    // console.log(contributions)
    return { prediction, words, contributions }
  }

  handleClick(e){
    fetch(withQuery('http://127.0.0.1:5000/explain', {
      model_id: this.model_id.current.value,
      sentence: this.state.textInput
    }))
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(data => {
      let { prediction, words, contributions } = this.extract(data)
      this.setState({result: { 
        prediction: prediction, 
        word_to_color: words, 
        contributions: contributions 
      }})
    })
  }

  render(){
    let { textInput, result } = this.state
    return (
      <div className="App">
        <Row>

        <Col sm={{ offset: 1, span: 5}} md={{ offset: 1, span: 5}}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Input Sentence</Form.Label>
            <Form.Control as="textarea" rows="3" ref={node => this.textInput = node} onChange={e => this.setState({textInput: e.target.value})}/>
          </Form.Group>
          <Form.Control as="select" ref={this.model_id}>
            <option>1</option>
            <option>2</option>
          </Form.Control>
          <Button size='sm' onClick={() => this.handleClick()}> Click </Button>
        </Col>

        <Col sm={{ span: 5 }} md={{ span: 5 }}>
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
    </div>
    );
  }
}

export default App;
