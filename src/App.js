import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";

//const electron = window.require("electron");

export default class App extends React.Component {
  addExplorer = () => {
    this.setState( prevState => {
      const _explorers = [...prevState.explorers, <FileExplorer removeExplorer={this.removeExplorer} key={`explorer-${Date.now()}`} id={Date.now()} addExplorer={this.addExplorer}/>]
      return {explorers: _explorers}
  });
}

  removeExplorer = id => {
    
    this.setState( prevState => {
      const _explorers = prevState.explorers.filter( explorer => explorer.props.id !=  id)
      return {explorers: _explorers}
    })
  }

  state = {
    explorers: [<FileExplorer removeExplorer={this.removeExplorer} key="explorer-0" id={0} addExplorer={this.addExplorer}/>]
  }
  

  render() {
    return (
      <div className="mx-1">
        <Container fluid>
          <Row style={{minHeight: "50vh"}}>
          </Row>
          <Row style={{maxHeight: "50vh", overflow: "scroll"}}>
            {this.state.explorers}
          </Row>
        </Container>
      </div>
    );
  }
}
