import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const fs = window.require("fs");

export default class Toolbar extends React.Component {
  allButtons = ["rename", "merge", "split", "archive"];

  state = {
    buttonsToDisplay: this.allButtons,
    tools: [{ id: "rename", name: "File Renamer", display: false }],
    renameField: "",
  };

  renameElement = React.createRef();

  toggleTools = (toolIDs, toolShouldBeDisplayed) => {
    this.setState((prevState) => {
      const _tools = prevState.tools.map((tool) => {
        const _tool = { ...tool };
        if (toolIDs.includes(_tool.id)) {
          _tool.display = toolShouldBeDisplayed;
        }
        return _tool;
      });
      return { tools: _tools };
    });
  };

  // toggleButtons = (buttonNames, toggle) => {
  //   this.setState((prevState) => {
  //     if (toggle) {
  //       // Add it to the display list
  //       return {
  //         buttonsToDisplay: [...prevState.buttonsToDisplay, ...buttonNames],
  //       };
  //     } else {
  //       // Remove them from the list
  //       const _buttonsToDisplay = [...prevState.buttonsToDisplay];
  //       _buttonsToDisplay.filter((name) => !buttonNames.includes(name));
  //       return { buttonsToDisplay: _buttonsToDisplay };
  //     }
  //   });
  // };

  handleRenameClick = (e) => {
    this.toggleTools(["rename"], true);
    this.setState(
      {
        buttonsToDisplay: ["rename"],
        renameField: this.props.selectedPDFPaths[0],
      },
      () => {
        this.renameElement.current.focus();
        this.renameElement.current.setSelectionRange(
          this.state.renameField.lastIndexOf("/") + 1,
          this.state.renameField.length - 4
        );
      }
    );
  };

  componentDidUpdate = (prevProps, prevState) => {
    const previousNumberOfToolsEnabled = prevState.tools.filter(
      (tool) => tool.display
    ).length;
    const currentNumberOfToolsEnabled = this.state.tools.filter(
      (tool) => tool.display
    ).length;
    if (previousNumberOfToolsEnabled === 0 && currentNumberOfToolsEnabled > 0) {
      this.props.toggleExplorers(true);
    } else if (
      currentNumberOfToolsEnabled === 0 &&
      previousNumberOfToolsEnabled > 0
    ) {
      this.props.toggleExplorers(false);
    }
  };

  handleRenameFieldChange = (e) => {
    this.setState({ renameField: e.target.value });
  };

  submitRename = (e) => {
    const directory = this.state.renameField.substr(
      0,
      this.state.renameField.lastIndexOf("/") + 1
    );

    if (this.state.renameField.substr(-4).toUpperCase() !== ".PDF")
      return window.alert("Extension must be .PDF");

    // Check if path exists
    if (!fs.existsSync(directory)) {
      window.alert("Folder does not exist exists.");
    }

    try {
      // Validated that file name ends in .PDF and folder exists
      fs.renameSync(this.props.selectedPDFPaths[0], this.state.renameField);
      window.location.reload();
    } catch (e) {
      window.alert("There was an unknown error saving the file: \n" + e);
    }
  };

  cancelRename = (e) => {
    // hide the tool
    this.toggleTools(["rename"], false);
    // re-enable the explorers (handled by componentDidUpdate)
    // re-display all the buttons
    this.setState({ buttonsToDisplay: this.allButtons });
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
        display: this.state.buttonsToDisplay.includes("rename"),
        callback: this.handleRenameClick,
        disabled:
          this.props.numberSelected !== 1 ||
          this.state.tools.filter((tool) => tool.display).length > 0,
      },
      {
        buttonTitle: "Split",
        callback: this.handleSplitClick,
        display: this.state.buttonsToDisplay.includes("split"),
        disabled:
          this.props.numberSelected !== 1 ||
          this.state.tools.filter((tool) => tool.display).length > 0,
      },
      {
        buttonTitle: "Merge",
        callback: this.handleMergeClick,
        display: this.state.buttonsToDisplay.includes("merge"),
        disabled:
          this.props.numberSelected < 2 ||
          this.state.tools.filter((tool) => tool.display).length > 0,
      },
      {
        buttonTitle: "Archive",
        callback: this.handleArchiveClick,
        display: this.state.buttonsToDisplay.includes("archive"),
        disabled:
          this.props.numberSelected < 1 ||
          this.state.tools.filter((tool) => tool.display).length > 0,
      },
      {
        buttonTitle: "Parse",
        callback: this.handleParseClick,
        display: this.state.buttonsToDisplay.includes("parse"),
        disabled: true,
      },
    ];

    const toolbarButtons = buttons
      .filter((button) => button.display)
      .map((button) => {
        return (
          <Col key={`col-${button.buttonTitle}`}>
            <Button
              onClick={button.callback}
              //key={button.buttonTitle}
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

    const toolComponents = {
      rename: (
        <>
          <input
            ref={this.renameElement}
            style={{ width: "90%", fontSize: "9pt" }}
            value={this.state.renameField}
            onChange={this.handleRenameFieldChange}
          ></input>
          <input
            style={{ fontSize: "9pt" }}
            type="submit"
            value="✓"
            onClick={this.submitRename}
          ></input>
          <input
            style={{ fontSize: "9pt" }}
            type="submit"
            value="x"
            onClick={this.cancelRename}
          ></input>
        </>
      ),
    };

    // filter first so we can use that length to determine the length of the column
    // 8 / number of tools
    const toolsWithTrueDisplayProps = this.state.tools.filter(
      (tool) => tool.display
    );
    const toolsToShow = toolsWithTrueDisplayProps.map((tool) => (
      <Col
        className={`col-${8 / toolsWithTrueDisplayProps.length}`}
        key={tool.id}
      >
        {toolComponents[tool.id]}
      </Col>
    ));

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
