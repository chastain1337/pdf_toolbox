import React, { useState, useEffect, Component } from "react";
import { Col, Table } from "react-bootstrap";
const fs = window.require("fs");
const path = window.require("path");

export default class FileExplorer extends Component {
  state = {
    root: "/Users/chastain/pdf_toolbox/sample_pdfs",
    folders: [],
  };

  getFolders = (directory) => {
    if (fs.existsSync(directory)) {
      return fs
        .readdirSync(directory)
        .filter((fileName) => fileName.toUpperCase().substr(-3) === "PDF");
    } else {
      return [];
    }
  };

  componentDidMount = () => {
    this.setState({ folders: this.getFolders(this.state.root) });
  };

  handleRootChange = (e) => {
    this.setState({ root: e.target.value });
    this.setState({ folders: this.getFolders(e.target.value) });
  };
  handleAddExplorer = () => {
    this.props.addExplorer()
  }

  handleRemoveExplorer = () => {
    this.props.removeExplorer(this.props.id)
  }
  render() {
    const folderList = this.state.folders.map((folder, i) => (
      <tr key={`rw-${folder}-${i}`}>
        <td colSpan={2} style={{ fontSize: "9pt" }} key={`cl-${folder}-${i}`}>
          {folder}
        </td>
      </tr>
    ));

    return (
      <Col className="mx-1 border border-success p-1">
        
        
          <Table size="sm" striped hover>
            <tbody>
              <tr>
              <td><input
          style={{width: "100%"}}
          placeholder="Path"
          onChange={this.handleRootChange}
          value={this.state.root}
        ></input></td>
        <td style={{textAlign: "right"}}>
          <button onClick={this.handleAddExplorer}>+</button>
          {this.props.id != 0 ? (<button onClick={this.handleRemoveExplorer}>-</button>) : null}
          </td>
              </tr>
              {folderList}
              </tbody>
          </Table>
        
      </Col>
    );
  }
}
