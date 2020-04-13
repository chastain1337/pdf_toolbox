import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const { PythonShell } = window.require("python-shell");

export default class Toolbar extends React.Component {
  handleRenameClick = (e) => {
    const options = {
      mode: "text",
      pythonPath:
        "C:\\Users\\James\\AppData\\Local\\Programs\\Python\\Python37-32\\python.exe",
      pythonOptions: ["-u"],
      scriptPath: "C:\\Users\\James\\pdf_toolbox\\src\\scripts",
      args: [e.target.innerText],
    };

    PythonShell.run("main.py", options, (err, data) => {
      console.log("Callback firing");
      if (err) {
        console.log(err);
      } else {
        window.alert(data);
      }
    });
  };

  handleSplitClick = (e) => {
    console.log(e.target.innerText);
  };

  handleMergeClick = (e) => {
    console.log(e.target.innerText);
  };

  handleArchiveClick = (e) => {
    console.log(e.target.innerText);
  };

  handleParseClick = (e) => {
    console.log(e.target.innerText);
  };

  render() {
    return (
      <Row className="text-center">
        <Col
          style={{
            margin: "auto",
            backgroundColor:
              this.props.numberSelected === 0
                ? "lightgray"
                : "rgb(181, 243, 179)",
          }}
        >
          {`${this.props.numberSelected} selected`}
        </Col>
        <Col>
          <Button
            onClick={this.handleRenameClick}
            variant="secondary"
            block
            size="sm"
            disabled={this.props.numberSelected === 1 ? false : true}
          >
            Rename
          </Button>
        </Col>
        <Col>
          <Button
            onClick={this.handleSplitClick}
            variant="secondary"
            block
            size="sm"
            disabled={this.props.numberSelected > 1 ? false : true}
          >
            Split
          </Button>
        </Col>
        <Col>
          <Button
            onClick={this.handleMergeClick}
            variant="secondary"
            block
            size="sm"
            disabled={this.props.numberSelected > 1 ? false : true}
          >
            Merge
          </Button>
        </Col>
        <Col>
          <Button
            onClick={this.handleArchiveClick}
            variant="secondary"
            block
            size="sm"
            disabled={this.props.numberSelected > 0 ? false : true}
          >
            Archive
          </Button>
        </Col>
        <Col>
          <Button
            onClick={this.handleParseClick}
            variant="secondary"
            block
            size="sm"
            disabled={this.props.numberSelected === 1 ? false : true}
          >
            Parse
          </Button>
        </Col>
      </Row>
    );
  }
}
