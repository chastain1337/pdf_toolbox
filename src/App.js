import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
import PDFNode from "./PDFNode";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const fs = window.require("fs");
const prefs = require("./preferences.json");

//const electron = window.require("electron");

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

  addPDFToViewPort = (filePath, id) => {
    this.setState((prevState) => {
      const _pdfsToView = [...prevState.pdfsToView, { path: filePath, id: id }];
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
        <Col key={pdf.id}>
          <Document
            className="pdf-viewer"
            key={pdf.id}
            file={{ data: fs.readFileSync(pdf.path) }}
          >
            <Page pageNumber={1} scale={0.95} />
          </Document>
        </Col>
      );
    });

    return (
      <div className="mx-1">
        <Container fluid>
          <Row
            style={{
              minHeight: "75vh",
              overflowY: "scroll",
              maxHeight: "75vh",
            }}
          >
            {this.state.pdfsToView.length > 0 ? listToView : null}
          </Row>
          <Row
            style={{ maxHeight: "25vh", overflowY: "scroll" }}
            className="border-top border-black"
          >
            {this.state.explorers}
          </Row>
        </Container>
      </div>
    );
  }
}
