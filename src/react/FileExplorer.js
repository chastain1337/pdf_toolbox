import React, { Component } from "react";
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

  handleRightClick = (e) => {
    // If not selected -> select and minimize
    // If selected -> just minimize
    // If minimized -> expand
    const pdfID =
      this.props.explorer_id +
      "-" +
      path.join(this.state.root, e.target.innerText);
    if (!this.props.selectedPDFIds.includes(pdfID)) {
      this.handleLeftClick(e);
    }
    if (this.props.minimizedPDFIds.includes(pdfID)) {
      this.props.togglePDFMinimization(pdfID, false);
    } else {
      this.props.togglePDFMinimization(pdfID, true);
    }
  };

  handleLeftClick = (e) => {
    // Selects with display
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
    const folderList = this.state.folders.map((folder, i) => {
      const pdfID =
        this.props.explorer_id + "-" + path.join(this.state.root, folder);
      const folderIsSelected = this.props.selectedPDFIds.includes(pdfID);
      const folderIsMinimized = folderIsSelected
        ? this.props.minimizedPDFIds.includes(pdfID)
        : false;
      return (
        <tr key={`rw-${folder}-${i}`} style={{ fontSize: "9pt" }}>
          <td
            className={folderIsSelected ? "selected" : null}
            onAuxClick={this.props.disabled ? null : this.handleRightClick}
            onClick={this.props.disabled ? null : this.handleLeftClick}
            colSpan={folderIsMinimized ? 1 : 2}
            key={`cl-${folder}-${i}`}
          >
            {folder}
          </td>
          {folderIsMinimized ? (
            <td>
              <button
                disabled={this.props.disabled}
                onClick={() => this.props.togglePDFMinimization(pdfID, false)}
              >
                +
              </button>
              <button
                disabled={this.props.disabled}
                onClick={() => this.props.removePDFFromViewPort(pdfID)}
              >
                x
              </button>
            </td>
          ) : null}
        </tr>
      );
    });

    return (
      <Col
        className="mx-1 p-1"
        style={{ overflowY: "scroll", maxHeight: "22vh" }}
      >
        <Table size="sm" striped hover>
          <tbody>
            <tr>
              <td>
                <input
                  disabled={this.props.disabled}
                  style={{ width: "100%", fontSize: "9pt" }}
                  placeholder="Path"
                  onChange={this.handleRootChange}
                  value={this.state.root}
                ></input>
              </td>
              <td style={{ textAlign: "right" }}>
                <button
                  disabled={this.props.disabled}
                  onClick={this.handleAddExplorer}
                >
                  +
                </button>
                {this.props.explorer_id !== 0 ? (
                  <button
                    disabled={this.props.disabled}
                    onClick={this.handleRemoveExplorer}
                  >
                    -
                  </button>
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
