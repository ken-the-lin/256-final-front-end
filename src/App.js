import React from 'react';
import { Button, Form, Row, Col} from 'react-bootstrap'
import withQuery from 'with-query'


var sentence = "I hate this resturant, Never come here"

class Word extends React.Component{
  w_style(word, sign) {
      let word_to_color = ["hate", "Never"]
      let ret = word_to_color.find(w => w === word) 
      let c = "white" 
      if (ret){
        c = sign === "positive" ? "#ff0000" : "#0099ff"
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

class App extends React.Component {
  handleClick(e){
    // let url = new URL('http://127.0.0.1:5000/explain')
    // let params = new URLSearchParams([['model_id', 1], ['sentence', sentence]])
    // url.search = params
    fetch(withQuery('http://127.0.0.1:5000/explain', {
      model_id: 1,
      sentence: sentence
    }))
    .then(data => data.json())
    .then(json => console.log('my json', json))
    .catch(err => console.log(err))

  }
  render(){
    return (
      <div className="App">
        <Row>

        <Col sm={6} md={6} lg={6}>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Input Sentence</Form.Label>
            <Form.Control as="textarea" rows="3" />
          </Form.Group>
          <Button size='sm' onClick={() => this.handleClick()}> Click </Button>
        </Col>

        <Col sm={6} md={6}>
          <p> {sentence.split(" ").map((w, i) => <Word key={i} word={w} sign="positive"/> )}</p>
        </Col>

      </Row>
    </div>
    );
  }
}

export default App;
