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

/* Test DVS - test driver and function exerciser for Designator Verifier Signature API Functions */

var fs = require('fs');

eval(fs.readFileSync('@SWD/BIG_XXX.js') + '');
eval(fs.readFileSync('@SWD/DBIG_XXX.js') + '');
eval(fs.readFileSync('@SWD/ROM_CURVE_ZZZ.js') + '');
eval(fs.readFileSync('@SWD/ROM_FIELD_YYY.js') + '');
eval(fs.readFileSync('@SWD/UInt64.js') + '');
eval(fs.readFileSync('@SWD/RAND.js') + '');
eval(fs.readFileSync('@SWD/FP_YYY.js') + '');
eval(fs.readFileSync('@SWD/FP2_YYY.js') + '');
eval(fs.readFileSync('@SWD/FP4_YYY.js') + '');
eval(fs.readFileSync('@SWD/FP12_YYY.js') + '');
eval(fs.readFileSync('@SWD/HASH256.js') + '');
eval(fs.readFileSync('@SWD/HASH512.js') + '');
eval(fs.readFileSync('@SWD/ECP_ZZZ.js') + '');
eval(fs.readFileSync('@SWD/ECP2_ZZZ.js') + '');
eval(fs.readFileSync('@SWD/MPIN_ZZZ.js') + '');
eval(fs.readFileSync('@SWD/PAIR_ZZZ.js') + '');

var RAW = [];
var rng = new RAND();
rng.clean();
for (i = 0; i < 100; i++) RAW[i] = i;

rng.seed(100, RAW);


var res;

var S = [];
var SST = [];
var TOKEN = [];
var SEC = [];
var xID = [];
var X = [];
var Y1 = [];
var Y2 = [];
var Z = [];
var Pa = [];
var U = [];

var sha = MPIN_ZZZ.HASH_TYPE;

/* Trusted Authority set-up */
MPIN_ZZZ.RANDOM_GENERATE(rng, S);
console.log("M-Pin Master Secret s: 0x" + MPIN_ZZZ.bytestostring(S));

/* Create Client Identity */
var IDstr = "testuser@miracl.com";
var CLIENT_ID = MPIN_ZZZ.stringtobytes(IDstr);

console.log("Client ID= " + MPIN_ZZZ.bytestostring(CLIENT_ID));

/* Generate random public key and z */
res = MPIN_ZZZ.GET_DVS_KEYPAIR(rng,Z,Pa);
if (res!=0)
{
    console.log("Can't generate DVS keypair, error ", res);
    return 1;
}

console.log("Z: 0x"+MPIN_ZZZ.bytestostring(Z));
console.log("Pa: 0x"+MPIN_ZZZ.bytestostring(Pa));

/* Append Pa to ID */
for (var i = 0; i < Pa.length; i++) {
	CLIENT_ID.push(Pa[i]);
}
console.log("ID|Pa: 0x"+MPIN_ZZZ.bytestostring(CLIENT_ID));
/* Hash Client ID */
HCID = MPIN_ZZZ.HASH_ID(sha, CLIENT_ID);

/* Client and Server are issued secrets by DTA */
MPIN_ZZZ.GET_SERVER_SECRET(S, SST);
console.log("Server Secret SS: 0x" + MPIN_ZZZ.bytestostring(SST));

MPIN_ZZZ.GET_CLIENT_SECRET(S, HCID, TOKEN);
console.log("Client Secret CS: 0x" + MPIN_ZZZ.bytestostring(TOKEN));

/* Compute client secret for key escrow less scheme z.CS */
res = MPIN_ZZZ.GET_G1_MULTIPLE(null,0,Z,TOKEN,TOKEN);
if (res != 0)
{
    console.log("Failed to compute z.CS, error ", res);
    return 1;
}
console.log("z.CS: 0x"+MPIN_ZZZ.bytestostring(TOKEN));

/* Client extracts PIN from secret to create Token */
var pin = 1234;
console.log("Client extracts PIN= " + pin);
res = MPIN_ZZZ.EXTRACT_PIN(sha, CLIENT_ID, pin, TOKEN);
if (res != 0)
    console.log("Failed to extract PIN, Error: ", res);

console.log("Client Token TK: 0x" + MPIN_ZZZ.bytestostring(TOKEN));

var date = 0;
var timeValue = MPIN_ZZZ.GET_TIME();

var message = "Message to sign";

res = MPIN_ZZZ.CLIENT(sha, 0, CLIENT_ID, rng, X, pin, TOKEN, SEC, U, null, null, timeValue, Y1, message);
if (res != 0){
    console.log("Failed to extract PIN, error ", res);
    return 1;
}

console.log("U: 0x" + MPIN_ZZZ.bytestostring(U));

console.log("Y1: 0x" + MPIN_ZZZ.bytestostring(Y1));
console.log("V: 0x" + MPIN_ZZZ.bytestostring(SEC));

/* Server  */
res = MPIN_ZZZ.SERVER(sha,0,xID,null,Y2,SST,U,null,SEC,null,null,CLIENT_ID,timeValue, message, Pa);
console.log("Y2: 0x"+MPIN_ZZZ.bytestostring(Y2));

if (res != 0)
{
    console.log("FAILURE Signature Verification, error", res);
    return -1
}
else
{
    console.log("SUCCESS Error Code ", res);
}
return 0;