import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import FileExplorer from "./FileExplorer";

//const electron = window.require("electron");

function App() {
  return (
    <div className="mx-1">
      <Container fluid>
        <Row>
          <FileExplorer />
          <Col className="border border-dark" xs={7}></Col>
          <FileExplorer />
        </Row>
      </Container>
    </div>
  );
}

export default App;
