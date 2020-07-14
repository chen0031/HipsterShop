/*
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// require('@google-cloud/profiler').start({
//   serviceContext: {
//     service: 'paymentservice',
//     version: '1.0.0'
//   }
// });
// require('@google-cloud/trace-agent').start();
// require('@google-cloud/debug-agent').start({
//   serviceContext: {
//     service: 'paymentservice',
//     version: 'VERSION'
//   }
// });
const path = require('path');
const {logger} = require("@opencensus/core");
const tracing = require("@opencensus/nodejs");
const {plugin} = require("@opencensus/instrumentation-grpc");
const {ZipkinTraceExporter} = require("@opencensus/exporter-zipkin");
zipkinUrl = process.env.ZIPKIN_COLLECTOR_URL;
if (!zipkinUrl || zipkinUrl === "off") {
  console.log("jaeger exporter not initialized");
  return undefined;
}

const exporter = new ZipkinTraceExporter({
  url: zipkinUrl,
  serviceName: "paymentservice",
  tags: [
    {
      key: "service",
      value: "paymentservice",
    },
  ],
  logger: logger.logger("info"),
});

tracing.registerExporter(exporter).start({
  samplingRate: 1,
  logLevel: 1,
});

const basedir = path.dirname(require.resolve("grpc"));
const version = require(path.join(basedir, "package.json")).version;

// Enables GRPC plugin: Method that enables the instrumentation patch.
plugin.enable(
    grpc,
    tracing.tracer,
    version,
    /** plugin options */ {},
    basedir
);

console.log("jaeger tracing initialized");

const HipsterShopServer = require('./server');

const PORT = process.env['PORT'];
const PROTO_PATH = path.join(__dirname, '/proto/');

const server = new HipsterShopServer(PROTO_PATH, PORT);

server.listen();
