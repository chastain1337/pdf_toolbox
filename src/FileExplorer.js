import React, { useState, useEffect, Component } from "react";
import { Col, Table } from "react-bootstrap";
const fs = window.require("fs");
const path = window.require("path");

export default class FileExplorer extends Component {
  state = {
    root: "\\\\SERVER2\\aNAHVAC\\Community\\DEV\\From Accounting",
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

  render() {
    const folderList = this.state.folders.map((folder, i) => (
      <tr key={`rw-${folder}-${i}`}>
        <td style={{ fontSize: "9pt" }} key={`cl-${folder}-${i}`}>
          {folder}
        </td>
      </tr>
    ));

    return (
      <Col className="mx-1 border border-success p-1">
        <input
          placeholder="Path"
          onChange={this.handleRootChange}
          value={this.state.root}
        ></input>
        {folderList.length > 0 ? (
          <Table size="sm" striped hover>
            <tbody>{folderList}</tbody>
          </Table>
        ) : null}
      </Col>
    );
  }
}
