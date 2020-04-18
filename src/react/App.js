import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
import PDFNode from "./PDFNode";
import { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";
import Toolbar from "./Toolbar";
import { channels } from "../shared/constants";

const { ipcRenderer } = window;
const prefs = require("./preferences2.json");

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      explorers: [],
      pdfsToView: [],
      appName: "",
      appVersion: "",
    };
  }

  rerender = () => {
    this.forceUpdate();
  };

  createFileExplorerObject = (
    initialPath = "",
    key = `explorer-${Date.now()}`,
    explorer_id = Date.now()
  ) => {
    return {
      initialPath: initialPath,
      key: key,
      explorer_id: explorer_id,
    };
  };

  addExplorer = () => {
    this.setState((prevState) => {
      const _explorers = [
        ...prevState.explorers,
        this.createFileExplorerObject(),
      ];
      return { explorers: _explorers };
    });
  };

  removeExplorer = (id) => {
    this.setState((prevState) => {
      const _explorers = prevState.explorers.filter((explorer) => {
        return explorer.explorer_id !== id;
      });
      return { explorers: _explorers };
    });
  };

  addPDFToViewPort = (filePath, id, shortPath, minimized = false) => {
    this.setState((prevState) => {
      const _pdfsToView = [
        ...prevState.pdfsToView,
        { path: filePath, id: id, name: shortPath, minimized },
      ];
      return { pdfsToView: _pdfsToView };
    });
  };

  removePDFFromViewPort = (id) => {
    this.setState((prevState) => {
      return {
        pdfsToView: [...prevState.pdfsToView].filter((pdf) => pdf.id !== id),
      };
    });
  };

  componentDidMount = () => {
    const newExplorers = prefs.fileExplorer.initialPaths.map((path, i) => {
      // set id of index 0 to 0, used later
      return this.createFileExplorerObject(
        path,
        "explorer-auto-" + i,
        i !== 0 ? "explorer-auto-" + i : 0
      );
    });
    this.setState({ explorers: newExplorers });
    ipcRenderer.send(channels.APP_INFO);
    ipcRenderer.on(channels.APP_INFO, (event, arg) => {
      ipcRenderer.removeAllListeners(channels.APP_INFO);
      const { appName, appVersion } = arg;
      this.setState({ appName, appVersion });
    });
  };

  togglePDFMinimization = (id, minimize) => {
    this.setState((prevState) => {
      const _pdfsToView = prevState.pdfsToView.map((pdf) => {
        if (pdf.id === id) {
          pdf.minimized = minimize;
        }
        return pdf;
      });
      return { pdfsToView: _pdfsToView };
    });
  };

  toggleExplorers = (explorerShouldBeDisabled) => {
    this.setState((prevState) => {
      const _explorers = prevState.explorers.map((explorer) => {
        return { ...explorer, disabled: explorerShouldBeDisabled };
      });
      return { explorers: _explorers };
    });
  };

  render() {
    console.log(this.state.appName, this.state.appVersion);
    const explorers = this.state.explorers.map((explorer) => (
      <FileExplorer
        disabled={explorer.disabled}
        initialPath={explorer.initialPath}
        key={explorer.key}
        explorer_id={explorer.explorer_id}
        // functions
        removePDFFromViewPort={this.removePDFFromViewPort}
        addPDFToViewPort={this.addPDFToViewPort}
        removeExplorer={this.removeExplorer}
        addExplorer={this.addExplorer}
        togglePDFMinimization={this.togglePDFMinimization}
        // props based on state
        selectedPDFIds={this.state.pdfsToView.map((pdf) => pdf.id)}
        minimizedPDFIds={this.state.pdfsToView
          .filter((pdf) => pdf.minimized)
          .map((pdf) => pdf.id)}
      />
    ));

    const listToView = this.state.pdfsToView.map((pdf) => {
      return (
        <PDFNode
          key={pdf.id}
          pdf={pdf}
          removePDFFromViewPort={this.removePDFFromViewPort}
          togglePDFMinimization={this.togglePDFMinimization}
        />
      );
    });

    return (
      <div className="mx-1">
        <Container fluid>
          <Row
            style={{
              minHeight: "74vh",
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.3.200/build/pdf.worker.min.js">
              {this.state.pdfsToView.length > 0 ? listToView : null}
            </Worker>
          </Row>
          <Toolbar
            className="border-top border-black"
            numberSelected={this.state.pdfsToView.length}
            selectedPDFPaths={this.state.pdfsToView.map((pdf) => pdf.path)}
            toggleExplorers={this.toggleExplorers}
          />
          <Row>{explorers}</Row>
        </Container>
      </div>
    );
  }
}
