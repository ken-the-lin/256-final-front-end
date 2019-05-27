import React from 'react';
import logo from './logo.svg';
import { Button, Form, Row, Col} from 'react-bootstrap'


var sentence = "I hate this resturant, Never come here"

class Word extends React.Component{
  w_style(word, sign) {
      let word_to_color = ["hate", "Never"]
      let ret = word_to_color.find(w => w == word) 
      let c = "white" 
      if (ret){
        c = sign == "positive" ? "#ff0000" : "#0099ff"
      }
      return {
        backgroundColor: c
      }
  }

  render(){
    let { word, sign } = this.props;
    let word_style = this.w_style(word, sign)
    return <span> <span style={word_style}>{word}</span> </span>
  }
}

function App() {
  return (
    <div className="App">
      <Row>
      <Col md={6}>
        <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label>Input Sentence</Form.Label>
          <Form.Control as="textarea" rows="3" />
        </Form.Group>
        <Button size='sm'> Clicke </Button>
      </Col>
        <p> {sentence.split(" ").map(w => <Word word={w} sign="positive"/> )}</p>
      <Col md={6}>
      </Col>
      </Row>
    </div>
  );
}

export default App;
