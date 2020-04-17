import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const fs = window.require("fs");

export default class Toolbar extends React.Component {
  state = {
    buttonsToRender: [
      {
        buttonTitle: "Rename",
        enableOn: "EXACTLY_1",
        onClick: this.handleRenameClick,
      },
      {
        buttonTitle: "Split",
        onClick: this.handleSplitClick,
        enableOn: "EXACTLY_1",
      },
      {
        buttonTitle: "Merge",
        onClick: this.handleMergeClick,
        enableOn: "MORE_THAN_1",
      },
      {
        buttonTitle: "Archive",
        onClick: this.handleArchiveClick,
        enableOn: "AT_LEAST_1",
      },
      {
        buttonTitle: "Parse",
        onClick: this.handleParseClick,
        enableOn: false,
      },
    ],
  };

  handleRenameClick = (e) => {
    console.log("reaming " + this.props.selectedPDFPaths[0]);
    const newName = window.prompt("Enter new name: ");
    fs.rename(this.props.selectedPDFPaths[0], newName);
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
    console.log(this.props.numberSelected);
    const toolbarButtons = this.state.buttonsToRender.map((button) => {
      let enabled;
      switch (button.enableOn) {
        case "MORE_THAN_1":
          enabled = this.props.numberSelected > 1;
          break;
        case "EXACTLY_1":
          enabled = this.props.numberSelected === 1;
          break;
        case "AT_LEAST_1":
          enabled = this.props.numberSelected >= 1;
          break;
        default:
          enabled = false;
      }
      return (
        <Col key={`col-${button.buttonTitle}`}>
          <Button
            onClick={button.onClick}
            key={button.buttonTitle}
            variant="secondary"
            block
            size="sm"
            disabled={!enabled}
          >
            {button.buttonTitle}
          </Button>
        </Col>
      );
    });
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
        {toolbarButtons}
      </Row>
    );
  }
}
