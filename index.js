const got = require('got');
const qrcode = require('qrcode-terminal');
const terminalImage = require('terminal-image');

// const DECODE_SERVER_BASE = "http://localhost:5000";
const DECODE_SERVER_BASE = "https://decode.stadswerken.amsterdam/";
const DECODE_WEB_BASE = "http://vegter.github.io/decode"


startSession();

function startSession(){
  initDisclosure()
    .then(getSessionId)
    .then(generateQR)
    .then(getSessionStatus)
    .catch(err => {
      console.error(err);
    });
}

function initDisclosure() {
  let attribute_request = "ouderdan18";
  let description = "Ben je ouder dan 18 jaar?";  

  return got.post(
    DECODE_SERVER_BASE,
    { path: "/init_disclosure", json: true, body: {attribute_request, description}
  })
}

function getSessionId(input) {
  console.log(input.body);
  return input.body.session_id;
}

function generateQR(sessionId) {
  qrcode.generate(DECODE_WEB_BASE + "?session=" + sessionId);
  return sessionId;
}

function getSessionStatus(sessionId) {
  let session_id = sessionId;
  status_interval = setInterval(() => {
    status_promise = got.post(DECODE_SERVER_BASE, { path: "/get_session_status", json: true, body: { session_id } })
      .then(res => {
        if(res.body.response == 'FINALIZED') {
          clearInterval(status_interval);
          getSessionData(sessionId);
        }
      });
    
    status_promise.catch(err => {
      console.error(err);
    });
  }, 1000);
}

function getSessionData(sessionId) {
  let session_id = sessionId;
  console.log(session_id);
  got.post(DECODE_SERVER_BASE, { path: "/get_session", json: true, body: { session_id } })
    .then(res => {
      // console.log(res.body);
      (async () => {
        console.log(await terminalImage.file('./files/default-man.png'));
      })();
    }).catch(err => {
      console.error(err)
    });
  
  setTimeout(startSession, 3000);
}
