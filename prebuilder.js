/*
 * Copyright 2021-2022 Dimitrios-Georgios Akestoridis
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const checker = require('license-checker');

function deriveBuildIdentifier(pkgVersion) {
  let cp;
  let match;

  cp = spawnSync(
    'git',
    [
      '--git-dir',
      path.join(__dirname, '.git'),
      'describe',
      '--tags',
    ],
  );
  if (cp.status === 0) {
    match = cp.stdout.toString().match(
      new RegExp(
        `^v${pkgVersion.replace(/\./g, '\\.')}`
        + '(\\-[0-9]+\\-g([0-9a-f]{7}))?\\r?\\n$',
      ),
    );
    if (match) {
      if (match[2]) {
        return `+${match[2]}`;
      }
      return '';
    }
  }

  cp = spawnSync(
    'git',
    [
      '--git-dir',
      path.join(__dirname, '.git'),
      'rev-parse',
      '--short',
      'HEAD',
    ],
  );
  if (cp.status === 0) {
    match = cp.stdout.toString().match(/^([0-9a-f]{7})\r?\n$/);
    if (match) {
      return `+${match[1]}`;
    }
  }

  match = '$Format:%h$'.match(/^[0-9a-f]{7}$/);
  if (match) {
    return `+${match[0]}`;
  }
  return '+unknown';
}

function parsePackages(packages) {
  let i;
  let key;
  let match;
  let pkgName;
  let pkgVersion;
  let pkgLicense;
  let pkgLicenseFile;
  let pkgLicenseText;
  let frontendVersion;
  let frontendLicense;
  let frontendLicenseText;
  let frontendRepository;
  let metadata;

  const frontendName = 'hiveguard-frontend';
  const frontendDependencies = {};

  for (i = 0; i < Object.keys(packages).length; i += 1) {
    key = Object.keys(packages)[i];
    match = key.match(
      /^(@?.+)@((0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*))$/,
    );
    if (match) {
      /* eslint-disable prefer-destructuring */
      pkgName = match[1];
      pkgVersion = match[2];
      /* eslint-enable prefer-destructuring */
      pkgLicense = packages[key].licenses;
      pkgLicenseFile = packages[key].licenseFile;
    } else {
      throw new Error(`Unexpected package name and version format: ${key}`);
    }

    pkgLicenseText = fs.readFileSync(pkgLicenseFile, 'utf8');

    if (pkgName === frontendName) {
      frontendVersion = pkgVersion + deriveBuildIdentifier(pkgVersion);
      if (frontendLicense || frontendLicenseText || frontendRepository) {
        throw new Error(`Parsed multiple versions of ${frontendName}`);
      } else {
        frontendLicense = pkgLicense;
        frontendLicenseText = pkgLicenseText;
        frontendRepository = packages[key].repository;
        if (!frontendRepository) {
          throw new Error(`The repository of ${frontendName} is unknown`);
        }
      }
    } else {
      frontendDependencies[key] = {
        pkgLicense,
        pkgLicenseText,
      };
    }
  }

  if (frontendLicense || frontendLicenseText || frontendRepository) {
    metadata = {
      frontendName,
      frontendVersion,
      frontendLicense,
      frontendLicenseText,
      frontendRepository,
      frontendDependencies,
    };

    fs.writeFileSync(
      path.join(__dirname, 'src', 'components', 'metadata.json'),
      JSON.stringify(metadata),
    );
  } else {
    throw new Error(`Did not parse any version of ${frontendName}`);
  }
}

checker.init(
  {
    start: __dirname,
    production: true,
    unknown: true,
  },
  (err, packages) => {
    if (err) {
      throw err;
    } else {
      parsePackages(packages);
    }
  },
);
