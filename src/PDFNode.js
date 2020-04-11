import React from "react";
import { Col } from "react-bootstrap";
import Viewer, { defaultLayout } from "@phuocng/react-pdf-viewer"; // https://react-pdf-viewer.dev/docs/options/

export default class PDFNode extends React.Component {
  renderToolbar = (toolbarSlot) => {
    return (
      <div
        style={{
          alignItems: "center",
          display: "flex",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexGrow: 1,
            flexShrink: 1,
            justifyContent: "left",
          }}
        >
          <div style={{ padding: "0 2px" }}>
            {toolbarSlot.toggleSidebarButton}
          </div>
          <div style={{ padding: "0 2px" }}>
            {toolbarSlot.previousPageButton}
          </div>
          <div style={{ padding: "0 2px" }}>{toolbarSlot.nextPageButton}</div>
          <div style={{ padding: "0 2px" }}>{toolbarSlot.zoomOutButton}</div>
          <div style={{ padding: "0 2px" }}>{toolbarSlot.zoomInButton}</div>
          <div style={{ fontSize: "9pt" }}>{this.props.pdf.name}</div>
          <div style={{ marginLeft: "auto" }}>
            <button onClick={this.handleMinimize}>
              {this.props.pdf.minimized ? "+" : "-"}
            </button>
            <button
              onClick={() =>
                this.props.removePDFFromViewPort(this.props.pdf.id)
              }
            >
              x
            </button>
          </div>
        </div>
      </div>
    );
  };

  handleMinimize = (e) => {
    this.props.togglePDFMinimization(this.props.pdf.id,!this.props.pdf.minimized);    
  };

  layout = (isSidebarOpened, container, main, toolbar, sidebar) => {
    return defaultLayout(
      isSidebarOpened,
      container,
      main,
      toolbar(this.renderToolbar),
      sidebar
    );
  };

  render() {
    return this.props.pdf.minimized ? (
      null
    ) : (
      <Col key={this.props.pdf.id} style={{ maxHeight: "73vh" }}>
        <Viewer
          layout={this.layout}
          defaultScale={1}
          key={this.props.pdf.id}
          fileUrl={"file:" + this.props.pdf.path}
        />
      </Col>
    );
  }
}
