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
            justifyContent: "center",
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
        </div>
      </div>
    );
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
    return (
      <Col key={this.props.pdf.id} style={{ maxHeight: "74vh" }}>
        <Viewer
          layout={this.layout}
          key={this.props.pdf.id}
          fileUrl={"file:" + this.props.pdf.path}
        />
      </Col>
    );
  }
}
