import React, { Component } from 'react';
import './App.css';
const fs = window.require("fs")

const electron = window.require("electron");
const { ipcRenderer } = electron;
//const data = fs.readFileSync("test.txt","utf8")

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {data: ""}
  }
  
  componentDidMount() {
		ipcRenderer.on('MESSAGE_FROM_BACKGROUND_VIA_MAIN', (event, args) => {
      console.log(args)
      this.setState({data: args})
		});

		ipcRenderer.send('START_BACKGROUND_VIA_MAIN', {
			number: 5
		});
	}

	render() {
    
    return (
			<div className="App">
				{this.state.data}
			</div>
		);
	}
}

export default App;

