/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

console.log("Testing addition of shares");
var assert = require('assert');
var fs = require('fs');

// JavaScript files from the PIN pad  are included here:
eval(fs.readFileSync('../src/DBIG.js')+'');
eval(fs.readFileSync('../src/BIG.js')+'');
eval(fs.readFileSync('../src/FP.js')+'');
eval(fs.readFileSync('../src/ROM.js')+'');
eval(fs.readFileSync('../src/UInt64.js')+'');
eval(fs.readFileSync('../src/HASH256.js')+'');
eval(fs.readFileSync('../src/HASH384.js')+'');
eval(fs.readFileSync('../src/HASH512.js')+'');
eval(fs.readFileSync('../src/RAND.js')+'');
eval(fs.readFileSync('../src/AES.js')+'');
eval(fs.readFileSync('../src/GCM.js')+'');
eval(fs.readFileSync('../src/ECP.js')+'');
eval(fs.readFileSync('../src/FP2.js')+'');
eval(fs.readFileSync('../src/ECP2.js')+'');
eval(fs.readFileSync('../src/FP4.js')+'');
eval(fs.readFileSync('../src/FP12.js')+'');
eval(fs.readFileSync('../src/PAIR.js')+'');
eval(fs.readFileSync('./MPIN.js')+'');
eval(fs.readFileSync('../src/MPINAuth.js')+'');

// Configuration file
eval(fs.readFileSync('./config.js')+'');

// Load test vectors
var vectors = require('./testVectors.json');

// Turn on DEBUG mode in MPINAuth
MPINAuth.DEBUG = DEBUG;

for(var vector in vectors)
  {
    console.log("Test "+vectors[vector].test_no);
    // Client secrets
    if (DEBUG){console.log("CS1 "+vectors[vector].CS1);}
    if (DEBUG){console.log("CS2 "+vectors[vector].CS2);}
    if (DEBUG){console.log("CLIENT_SECRET "+vectors[vector].CLIENT_SECRET);}
    var client_secret = MPINAuth.addShares(vectors[vector].CS1, vectors[vector].CS2);
    if (DEBUG){console.log("client_secret "+client_secret);}
    try
      {
        assert.equal(client_secret, vectors[vector].CLIENT_SECRET, "Client Secret Addition failed");
      }
    catch(err)
      {
        txt="Error description: " + err.message;
        console.error(txt);
        console.log("TEST FAILED");
        return;
      }
    // Time permits
    if (DEBUG){console.log("TP1 "+vectors[vector].TP1);}
    if (DEBUG){console.log("TP2 "+vectors[vector].TP2);}
    if (DEBUG){console.log("TIME_PERMIT "+vectors[vector].TIME_PERMIT);}
    var time_permit = MPINAuth.addShares(vectors[vector].TP1, vectors[vector].TP2);
    if (DEBUG){console.log("time_permit "+time_permit);}
    try
      {
        assert.equal(time_permit, vectors[vector].TIME_PERMIT, "Time Permit Addition failed");
      }
    catch(err)
      {
        txt="Error description: " + err.message;
        console.error(txt);
        console.log("TEST FAILED");
        return;
      }
  }
console.log("TEST PASSED");