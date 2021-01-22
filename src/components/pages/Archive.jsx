/*!
 * Copyright 2021 Dimitrios-Georgios Akestoridis
 * hiveguard-frontend/src/components/pages/Archive.jsx
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Jumbotron from 'react-bootstrap/Jumbotron';
import DownloadFiles from '../segments/DownloadFiles';

function Archive({ retentionAPI }) {
  const [archiveFoldersState, setArchiveFoldersState] = useState([]);
  const [folderNameOptions, setFolderNameOptions] = useState([]);
  const [selectFolderState, setSelectFolderState] = useState('');
  const [folderURLState, setFolderURLState] = useState(null);

  const fetchArchiveFolders = async () => {
    try {
      const response = await fetch(`${retentionAPI}/archive-folders`);
      if (
        response.ok
        && response.headers.get('content-type').includes('application/json')
      ) {
        setArchiveFoldersState(await response.json());
      } else {
        setArchiveFoldersState([]);
      }
    } catch (err) {
      setArchiveFoldersState([]);
    }
  };

  useEffect(() => {
    fetchArchiveFolders();
  }, []);

  useEffect(() => {
    if (archiveFoldersState.length === 0) {
      setFolderNameOptions([]);
      setSelectFolderState('');
    } else {
      setFolderNameOptions(Array.from(
        archiveFoldersState,
        (folderName) => (
          <option key={folderName} value={folderName}>
            {folderName}
          </option>
        ),
      ));
      setSelectFolderState(archiveFoldersState[0]);
    }
  }, [archiveFoldersState]);

  useEffect(() => {
    if (retentionAPI && selectFolderState) {
      setFolderURLState(
        `${retentionAPI}/archive-folders/${selectFolderState}`,
      );
    } else {
      setFolderURLState(null);
    }
  }, [selectFolderState]);

  return (
    <Container>
      <Jumbotron align="center">
        <h1>Archive Page</h1>
        <br />
        <br />
        <label htmlFor="folder_name_options" style={{ fontSize: 'x-large' }}>
          <b>
            Folder Name:
          </b>
          {' '}
          <select
            id="folder_name_options"
            value={selectFolderState}
            onChange={(event) => setSelectFolderState(event.target.value)}
          >
            {folderNameOptions}
          </select>
        </label>
      </Jumbotron>
      <DownloadFiles
        dataURL={folderURLState}
      />
    </Container>
  );
}

Archive.propTypes = {
  retentionAPI: PropTypes.string.isRequired,
};

export default Archive;
