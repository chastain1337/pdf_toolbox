import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const fs = window.require("fs");

export default class Toolbar extends React.Component {
  state = {
    buttonsToRender: [],
    tools: [{ id: "rename", name: "File Renamer", display: false }],
  };

  enableTools = (toolIDs) => {
    this.setState((prevState) => {
      const _tools = prevState.tools.map((tool) => {
        if (toolIDs.includes(tool.id)) {
          tool.display = true;
        }
        return tool;
      });
      return { tools: _tools };
    });
  };

  handleRenameClick = (e) => {
    console.log("clicked rename");
    this.enableTools(["rename"]);
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
    const buttons = [
      {
        buttonTitle: "Rename",
        display: true,
        callback: this.handleRenameClick,
        disabled: this.props.numberSelected !== 1,
      },
      {
        buttonTitle: "Split",
        callback: this.handleSplitClick,
        display: true,
        disabled: this.props.numberSelected !== 1,
      },
      {
        buttonTitle: "Merge",
        callback: this.handleMergeClick,
        display: true,
        disabled: this.props.numberSelected < 2,
      },
      {
        buttonTitle: "Archive",
        callback: this.handleArchiveClick,
        display: true,
        disabled: this.props.numberSelected < 1,
      },
      {
        buttonTitle: "Parse",
        callback: this.handleParseClick,
        display: true,
        disabled: true,
      },
    ];

    const toolbarButtons = buttons.map((button) => {
      return (
        <Col key={`col-${button.buttonTitle}`}>
          <Button
            onClick={button.callback}
            key={button.buttonTitle}
            variant="secondary"
            block
            size="sm"
            disabled={button.disabled}
          >
            {button.buttonTitle}
          </Button>
        </Col>
      );
    });
    console.log(this.state.tools);
    const toolsToShow = this.state.tools
      .filter((tool) => tool.display)
      .map((tool) => <Col>{tool.name}</Col>);

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
        {toolsToShow}
      </Row>
    );
  }
}
