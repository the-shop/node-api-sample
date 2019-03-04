import React from "react";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";
import FileCloudDownload from "material-ui/svg-icons/file/cloud-download";
import customTheme from "../customTheme";

/**
 * Used for FileUpload resource read mode - renders download button
 *
 * @param record
 * @param style
 */
const DownloadButton = ({ record, style }) => {
  if (record === null) {
    return false;
  }

  return (
    <RaisedButton
      label=""
      onClick={(event) => {
        event.preventDefault();
        window.open(record.url);
      }}
      icon={<FileCloudDownload style={customTheme} />}
      style={style}
    />
  );
};

DownloadButton.propTypes = {
  style: {},
  record: null,
};

DownloadButton.propTypes = {
  record: PropTypes.object,
  style: PropTypes.object,
};

export default DownloadButton;
