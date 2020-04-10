import React, { useState, useEffect, Component } from "react";
import { Col, Table } from "react-bootstrap";
import "./App.css";

const fs = window.require("fs");
const path = window.require("path");

export default class FileExplorer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      root: this.props.initialPath,
      folders: [],
    };
  }

  getFolders = (directory) => {
    try {
      if (fs.existsSync(directory)) {
        return fs
          .readdirSync(directory)
          .filter((fileName) => fileName.toUpperCase().substr(-4) === ".PDF");
      } else {
        return [];
      }
    } catch (e) {
      // i know, i know...
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
    this.props.addExplorer();
  };

  handleRemoveExplorer = () => {
    this.props.removeExplorer(this.props.explorer_id);
  };

  toggleSelected = (target) => {
    if (target.classList.contains("selected")) {
      target.classList.remove("selected");
    } else {
      target.classList.add("selected");
    }
  };

  handleSelectRow = (e) => {
    const fullPath = path.join(this.state.root, e.target.innerText);
    if (e.target.classList.contains("selected")) {
      this.props.removePDFFromViewPort(`${this.props.explorer_id}-${fullPath}`);
    } else {
      this.props.addPDFToViewPort(
        fullPath,
        `${this.props.explorer_id}-${fullPath}`,
        e.target.innerText
      );
    }
  };

  render() {
    const folderList = this.state.folders.map((folder, i) => (
      <tr key={`rw-${folder}-${i}`}>
        <td
          className={
            this.props.selectedFiles.includes(folder) ? "selected" : null
          }
          onClick={this.handleSelectRow}
          colSpan={2}
          style={{ fontSize: "9pt" }}
          key={`cl-${folder}-${i}`}
        >
          {folder}
        </td>
      </tr>
    ));

    return (
      <Col
        className="mx-1 p-1"
        style={{ overflowY: "scroll", maxHeight: "24vh" }}
      >
        <Table size="sm" striped hover>
          <tbody>
            <tr>
              <td>
                <input
                  style={{ width: "100%" }}
                  placeholder="Path"
                  onChange={this.handleRootChange}
                  value={this.state.root}
                ></input>
              </td>
              <td style={{ textAlign: "right" }}>
                <button onClick={this.handleAddExplorer}>+</button>
                {this.props.explorer_id != 0 ? (
                  <button onClick={this.handleRemoveExplorer}>-</button>
                ) : null}
              </td>
            </tr>
            {folderList}
          </tbody>
        </Table>
      </Col>
    );
  }
}
