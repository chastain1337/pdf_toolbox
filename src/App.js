import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
import PDFNode from "./PDFNode";
import { Worker } from "@phuocng/react-pdf-viewer";
import "@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css";

const prefs = require("./preferences.json");

export default class App extends React.Component {
  addExplorer = () => {
    this.setState((prevState) => {
      const _explorers = [
        ...prevState.explorers,
        <FileExplorer
          initialPath=""
          removePDFFromViewPort={this.removePDFFromViewPort}
          addPDFToViewPort={this.addPDFToViewPort}
          removeExplorer={this.removeExplorer}
          key={`explorer-${Date.now()}`}
          id={Date.now()}
          addExplorer={this.addExplorer}
        />,
      ];
      return { explorers: _explorers };
    });
  };

  removeExplorer = (id) => {
    this.setState((prevState) => {
      const _explorers = prevState.explorers.filter((explorer) => {
        return explorer.props.explorer_id !== id;
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

  removePDFFromViewPort = (filePath, id) => {
    this.setState((prevState) => {
      return {
        pdfsToView: [...prevState.pdfsToView].filter((pdf) => pdf.id != id),
      };
    });
  };

  componentDidMount = () => {
    const newExplorers = prefs.fileExplorer.initialPaths.map((path, i) => {
      if (i !== 0) {
        // already mounting the first explorer, regardless of prefs
        console.log("creating explorer with id explorer-auto-" + i);
        return (
          <FileExplorer
            initialPath={path}
            removeExplorer={this.removeExplorer}
            removePDFFromViewPort={this.removePDFFromViewPort}
            addPDFToViewPort={this.addPDFToViewPort}
            key={"explorer-auto-" + i}
            explorer_id={"explorer-auto-" + i}
            addExplorer={this.addExplorer}
          />
        );
      }
    });
    newExplorers.splice(0, 1);
    this.setState((prevState) => {
      const combined = [...prevState.explorers, ...newExplorers];
      console.log(combined);
      return { explorers: combined };
    });
  };

  state = {
    explorers: [
      <FileExplorer
        initialPath={
          prefs.fileExplorer.initialPaths[0]
            ? prefs.fileExplorer.initialPaths[0]
            : null
        }
        removeExplorer={this.removeExplorer}
        removePDFFromViewPort={this.removePDFFromViewPort}
        addPDFToViewPort={this.addPDFToViewPort}
        key="explorer-auto-0"
        explorer_id={0} // don't change - used to prevent "-" button from spawning
        addExplorer={this.addExplorer}
      />,
    ],
    pdfsToView: [],
  };

  render() {
    const listToView = this.state.pdfsToView.map((pdf) => {
      return (
        <PDFNode pdf={pdf} removePDFFromViewPort={this.removePDFFromViewPort} />
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
          <Row className="border-top border-black">{this.state.explorers}</Row>
        </Container>
      </div>
    );
  }
}
