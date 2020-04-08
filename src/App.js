import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";

//const electron = window.require("electron");

export default class App extends React.Component {
  addExplorer = () => {
    this.setState( prevState => {
      const _explorers = [...prevState.explorers, <FileExplorer removePDFFromViewPort={this.removePDFFromViewPort} addPDFToViewPort={this.addPDFToViewPort} removeExplorer={this.removeExplorer} key={`explorer-${Date.now()}`} id={Date.now()} addExplorer={this.addExplorer}/>]
      return {explorers: _explorers}
  });
}

  removeExplorer = id => {
    
    this.setState( prevState => {
      const _explorers = prevState.explorers.filter( explorer => explorer.props.id !=  id)
      return {explorers: _explorers}
    })
  }

  addPDFToViewPort = filePath => {
    this.setState( prevState => {
      const _pdfsToView = [...prevState.pdfsToView, filePath]
      return {pdfsToView: _pdfsToView}
    })
  }

  removePDFFromViewPort = filePath => {
    this.setState(prevState => {
      const idx = this.state.pdfsToView.indexOf(filePath)
      const _pdfsToView = [...prevState.pdfsToView]
      console.log(idx)
      if (idx > -1) {
        _pdfsToView.splice(idx,1);
        return {pdfsToView: _pdfsToView}
      }});
  }

  state = {
    explorers: [<FileExplorer removeExplorer={this.removeExplorer} removePDFFromViewPort={this.removePDFFromViewPort} addPDFToViewPort={this.addPDFToViewPort} key="explorer-0" id={0} addExplorer={this.addExplorer}/>],
    pdfsToView: []
  }
  

  render() {
    const listToView = this.state.pdfsToView.map ( path =>     <li key={`${path}-${Date.now()}`}>{path}</li> );
    return (
      <div className="mx-1">
        <Container fluid>
          <Row style={{minHeight: "50vh"}}>
            {this.state.pdfsToView.length > 0 ? <ul>{listToView}</ul> : null}
          </Row>
          <Row style={{maxHeight: "50vh", overflow: "scroll"}}>
            {this.state.explorers}
          </Row>
        </Container>
      </div>
    );
  }
}
