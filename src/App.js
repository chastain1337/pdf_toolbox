import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
import PDFNode from "./PDFNode";
import { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

const prefs = require("./preferences.json");

export default class App extends React.Component {
  createFileExplorerObject = (
    initialPath = "",
    key = `explorer-${Date.now()}`,
    explorer_id = Date.now()
  ) => {
    return {
      initialPath: initialPath,
      key: key,
      explorer_id: explorer_id,
      removePDFFromViewPort: this.removePDFFromViewPort,
      addPDFToViewPort: this.addPDFToViewPort,
      removeExplorer: this.removeExplorer,
      addExplorer: this.addExplorer,
      selectedFiles: this.state.pdfsToView.map((pdf) => pdf.name),
    };
  };

  state = {
    explorers: [],
    pdfsToView: [],
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

  addPDFToViewPort = (filePath, id, shortPath) => {
    this.setState((prevState) => {
      const _pdfsToView = [
        ...prevState.pdfsToView,
        { path: filePath, id: id, name: shortPath },
      ];
      return { pdfsToView: _pdfsToView };
    });
  };

  removePDFFromViewPort = (id) => {
    this.setState((prevState) => {
      return {
        pdfsToView: [...prevState.pdfsToView].filter((pdf) => pdf.id != id),
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
  };

  render() {
    const explorers = this.state.explorers.map((explorer) => (
      <FileExplorer
        initialPath={explorer.initialPath}
        key={explorer.key}
        explorer_id={explorer.explorer_id}
        removePDFFromViewPort={explorer.removePDFFromViewPort}
        addPDFToViewPort={explorer.addPDFToViewPort}
        removeExplorer={explorer.removeExplorer}
        addExplorer={explorer.addExplorer}
        selectedFiles={explorer.selectedFiles}
      />
    ));
    const listToView = this.state.pdfsToView.map((pdf) => {
      return (
        <PDFNode
          key={pdf.id}
          pdf={pdf}
          removePDFFromViewPort={this.removePDFFromViewPort}
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
          <Row className="border-top border-black">{explorers}</Row>
        </Container>
      </div>
    );
  }
}
