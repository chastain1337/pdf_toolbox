import React from "react";
import { Container, Row } from "react-bootstrap";
import FileExplorer from "./FileExplorer";
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
      const _explorers = prevState.explorers.filter(
        (explorer) => explorer.props.id != id
      );
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
      if (i != 0) {
        // already mounting the first explorer, regardless of prefs
        return (
          <FileExplorer
            initialPath={path}
            removeExplorer={this.removeExplorer}
            removePDFFromViewPort={this.removePDFFromViewPort}
            addPDFToViewPort={this.addPDFToViewPort}
            key={"explorer-auto-" + i}
            id={Date.now()}
            addExplorer={this.addExplorer}
          />
        );
      }
    });
    this.setState((prevState) => ({
      explorers: [...prevState.explorers, ...newExplorers],
    }));
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
        key="explorer-0"
        id={0}
        addExplorer={this.addExplorer}
      />,
    ],
    pdfsToView: [],
  };

  render() {
    const listToView = this.state.pdfsToView.map((pdf) => {
      const fl = fs.readFileSync(pdf.path);
      // console.log(fl);
      return (
        <Document key={pdf.id} file={fl}>
          <Page pageNumber={1} />
        </Document>
      );
    });

    return (
      <div className="mx-1">
        <Container fluid>
          <Row style={{ minHeight: "50vh" }}>
            {/* <Document file={process.env.PUBLIC_URL + "sample_pdf_0.pdf"}>
              <Page pageNumber={1} />
            </Document> */}
            {this.state.pdfsToView.length > 0 ? <ul>{listToView}</ul> : null}
          </Row>
          <Row style={{ maxHeight: "50vh", overflowY: "scroll" }}>
            {this.state.explorers}
          </Row>
        </Container>
      </div>
    );
  }
}
