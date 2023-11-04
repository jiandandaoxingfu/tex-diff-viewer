import './App.css';
import arrow from './arrow.png';

import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

const uploadHandler = function(id, setCode, fileCount, setFileCount) {
  let file = document.getElementById('upload-input-' + id)?.files?.[0];
  if (!file) return;
  document.getElementById('upload-' + id).innerText = file.name;
  let reader = new FileReader();
  reader.onload = function() {
    let result = this.result.replace(/([a-z]+\.) ([A-Z][a-z]+)/g, '$1\n$2')
    setCode(result);
  }
  reader.readAsText(file);
}

function rotate(oldCode, setOldCode, newCode, setNewCode) {
  let rotation = document.getElementById('arrow').style.transform.match(/(\d+)deg/);
  document.getElementById('arrow').style.transform = `translateY(40px) scale(0.8) rotateZ(${rotation === null || rotation[1] === "0" ? 180 : 0}deg)`;
  let oldCode_ = oldCode;
  setOldCode(newCode);
  setNewCode(oldCode_);
}

function download() {
  const tex = {'+': '', '-': ''};
  for (let tr of document.querySelectorAll('.css-1n7ec1i-line') ) {
      let pm = tr.children[2].innerText;
      if(pm.length === 1) {
          let text = tr.lastElementChild.innerText;
          let ends = '';
          if (text.match(/\\\\ *?$/)) {
              text = text.replace(/\\\\ *?$/, '');
              ends = '\\\\';
          }
          let mark_left = `\\colorbox{${pm === '+' ? 'blue' : 'red'}}{ ( }`;
          let mark_right = `\\colorbox{${pm === '+' ? 'blue' : 'red'}}{ ) }`;
          tex[pm] += mark_left + text + mark_right + ends + '\n';
      } else if (pm === ''){
          tex['+'] += tr.lastElementChild.innerText + '\n';
          tex['-'] += tr.lastElementChild.innerText + '\n';
      }
  }
  
  let textFile = new Blob([tex['-']], { type: "text/plain" });
  let textFileURL = URL.createObjectURL(textFile);
  let downloadLink = document.createElement('a');
  downloadLink.href = textFileURL;
  downloadLink.setAttribute('download', 'test_old.tex');
  downloadLink.click();
  
  textFile = new Blob([tex['+']], { type: "text/plain" });
  textFileURL = URL.createObjectURL(textFile);
  downloadLink = document.createElement('a');
  downloadLink.href = textFileURL;
  downloadLink.setAttribute('download', 'test_new.tex');
  downloadLink.click();

}

function App() {
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isDiff, setIsDiff] = useState(false);
  const [showDiffOnly, setShowDiffOnly] = useState(true);
  const [disableWordDiff, setDisableWordDiff] = useState(false);

  return (
    isDiff ?
      <>
        <ReactDiffViewer 
          oldValue={oldCode} 
          newValue={newCode}
          splitView={false} 
          disableWordDiff={disableWordDiff}
          hideLineNumbers={false}
          extraLinesSurroundingDiff={1}
          compareMethod={DiffMethod.WORDS}
          showDiffOnly={showDiffOnly}
        />
        <div id="diff-tool" style={{position: 'fixed', width: '100%', textAlign: 'center', 
                paddingTop: '15px', bottom: '0px', height: '40px', backgroundColor: 'white', 
                boxShadow: '0px -6px 6px 3px gray'}}>
          <input type="checkbox" id="showDiffOnly" onChange={() => setShowDiffOnly(!showDiffOnly)} 
              checked={showDiffOnly} style={{position: 'absolute', zoom: "1.6", top: '12px'}}/>
          <label style={{padding: '5px', margin: '0 20px 0 22px'}}>折叠未发生变动部分</label>
          <input type="checkbox" id="disableWordDiff" onChange={() => setDisableWordDiff(!disableWordDiff)} 
              checked={!disableWordDiff} style={{position: 'absolute', zoom: "1.6", top: '12px'}}/>
          <label style={{padding: '5px'}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;凸显单词对比</label>
          <button id="download" style={{marginLeft: '30px', padding: '5px'}} onClick={() => {!showDiffOnly && disableWordDiff && download()}} title="取消勾选两个选项后可以下载">下载标记tex文件</button>
        </div>
      </>
      :
      <>
        <div id="uploader">
          <button id="upload-old" onClick={() => document.getElementById('upload-old').nextElementSibling.click()}>选择老文件</button>
          <input type="file" accept=".tex" id="upload-input-old" className="upload-input" onChange={() => uploadHandler('old', setOldCode)}/>
          <img id="arrow" src={arrow} onClick={() => rotate(oldCode, setOldCode, newCode, setNewCode)}/>
          <button id="upload-new" onClick={() => document.getElementById('upload-new').nextElementSibling.click()}>选择新文件</button>
          <input type="file" accept=".tex" id="upload-input-new" className="upload-input" onChange={() => uploadHandler('new', setNewCode)}/>
          <br/>
          <button id="diff" onClick={() => {if (oldCode !== "" && newCode !== "") setIsDiff(true)}}>开始比对</button>
        </div>
        <div style={{position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>  
          <span style={{ margin: '0px 10px' }}>
            ©2023
            <a style={{ color: 'black', textDecoration: 'none' }} rel="noreferrer" target="_blank" href="https://github.com/jiandandaoxingfu/tex-diff-viewer"><strong> text-diff</strong></a>  &nbsp;
          </span>
          <span></span>
          <span style={{ margin: '0 3px'}}>
            Created by 
            <a style={{ color: 'black', textDecoration: 'none' }} rel="noreferrer" target="_blank" href="https://github.com/jiandandaoxingfu">
            <strong>  JMx  </strong>
            </a>
            with 
            <a style={{ color: 'black', textDecoration: 'none' }} rel="noreferrer" target="_blank" href="https://github.com/praneshr/react-diff-viewer">
              <strong>  react-diff-viewer  </strong>
            </a>
            and
            ❤️  
          </span>  
        </div>
      </>
  );
}

export default App;