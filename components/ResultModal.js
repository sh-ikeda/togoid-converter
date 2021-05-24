import React, { useState } from "react";
import copy from "copy-to-clipboard";
import { saveAs } from "file-saver";
import { executeQuery, exportCSV } from "../lib/util";
import dbCatalogue from "../public/dataset.json";

const ResultModal = (props) => {
  const [exportMenuVisibility, setExportMenuVisibility] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClipboardCopy = (e) => {
    e.preventDefault();
    const text = props.tableData.rows.map((v) => v[v.length - 1]).join("\n");
    copy(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const handleExportCSV = async () => {
    const d = await executeQuery(props.route, props.ids);
    exportCSV([props.tableData.heading, ...d.results]);
  };

  const handleIdDownload = async () => {
    const d = await executeQuery(props.route, props.ids, "target");
    const texts = d.results.join("\r\n");
    const blob = new Blob([texts], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "ids.txt");
  };

  const handleURLDownload = async () => {
    const dbName = props.route[props.route.length - 1].name;
    const dbPrefix = dbCatalogue[dbName].prefix;
    const d = await executeQuery(props.route, props.ids, "target");
    const texts = d.results.map((v) => dbPrefix + v).join("\r\n");
    const blob = new Blob([texts], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, "urls.txt");
  };

  return (
    <div className="modal">
      <div className="modal__inner">
        <div className="modal__scroll_area">
          <button
            onClick={() => props.setModalVisibility(false)}
            className="modal__close"
          >
            <svg viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </button>
          <h2 className="title">ID forwarding</h2>

          <div className="modal__path">
            <p className="modal__heading">PATH</p>
            <div className="modal__path__frame">
              <div className="modal__path__frame__inner">
                {props.tableData.heading.map((v, i) => (
                  <div key={i} className="path_label green">
                    <span className="path_label__inner">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="modal__top">
            <div className="item_wrapper">
              {props.tableData && props.tableData.rows.length > 0 && (
                /*
                <div className="input_search">
                  <svg className="input_search__icon" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"
                    />
                  </svg>
                  <input type="search" className="input_search__input" />
                </div>
*/
                <span>
                  Showing {props.tableData.rows.length} of {props.total} results
                </span>
              )}
              {props.tableData && props.tableData.rows.length > 0 && (
                <div className="export_button">
                  <button
                    onClick={handleClipboardCopy}
                    className="button_icon"
                  >
                    <svg className="button_icon__icon" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z"
                      />
                    </svg>
                    変換後IDをクリップボードにコピー
                    {copied && <span>Copied.</span>}
                  </button>
                  <button
                    onClick={handleIdDownload}
                    className="button_icon"
                  >
                    <svg className="button_icon__icon" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
                      />
                    </svg>
                    変換後ID
                  </button>
                  <button
                    onClick={handleURLDownload}
                    className="button_icon"
                  >
                    <svg className="button_icon__icon" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
                      />
                    </svg>
                    変換後URL
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="button_icon"
                  >
                    <svg className="button_icon__icon" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z"
                      />
                    </svg>
                    CSV
                  </button>
                </div>
              )}
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                {props.tableData &&
                  props.tableData.heading.length > 0 &&
                  props.tableData.heading.map((v, i) => <th key={i}>{v}</th>)}
              </tr>
            </thead>
            <tbody>
              {props.tableData && props.tableData.rows.length > 0 ? (
                props.tableData.rows.map((data, i) => (
                  <tr key={i}>
                    {data.map((d, j) => (
                      <td key={j}>{d}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={props.tableData.heading.length}
                    className="no_results"
                  >
                    No Results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
