let colorpicker = document.querySelector("#colorpicker");
let color = colorpicker.value;
colorpicker.addEventListener("input", function () {
  let colorpicker = document.querySelector("#colorpicker");
  color = colorpicker.value;
  showLocation();
});
/****************** GPS **************************/
let place = "";
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  }
}

function showPosition(position) {
  const geocoder = new google.maps.Geocoder();
  const latlng = {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
  geocoder.geocode({ location: latlng }).then((response) => {
    for (let j = 0; j < response.results.length; j++) {
      if (
        response.results[j].types.includes("political") &&
        response.results[j].types.includes("locality")
      ) {
        place = response.results[j].formatted_address;
      }
    }
    if (response.results.length === 0) {
    }
    showLocation();
  });
}
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}

function showLocation() {
  let vid = document.querySelector("#video");
  let overlay = document.querySelector("#text-overlay");
  let otx = overlay.getContext("2d");
  overlay.width = vid.videoWidth;
  overlay.height = vid.videoHeight;
  otx.fillStyle = "#00000000";
  otx.fillRect(0, 0, vid.videoWidth, vid.videoHeight);
  otx.font = fontsize + "pt 'Amatic SC'";
  otx.fillStyle = color;
  let gl = Math.round(video.videoWidth / 32);
  let date = new Date();
  otx.fillText(
    place.substring(0, place.search(",")),
    gl,
    20 + Math.round(fontsize),
    video.videoWidth - 80
  );
  otx.fillText(
    "23.1.2022",
    gl,
    video.videoHeight - 20,
    video.videoWidth - 80
  );
}
/******************************************************/
/****************** Kamera **************************/
const video = document.querySelector("#video");

let constraints = {
  audio: false,
  video: {
    width: { ideal: 99999 },
    height: { ideal: 99999 },
    facingMode: "environment",
  },
};
navigator.mediaDevices
  .getUserMedia(constraints)
  .then((stream) => {
    video.srcObject = stream;
    currentStream = stream;
    getLocation();
    showLocation();
  })
  .catch(() => {
    document.querySelector("#camera").innerHTML =
      "<p>Kamera nicht benutzbar!</p>";
  });

let click_button = document.querySelector("#btn-cam");
let canvas = document.querySelector("#photo_canvas");
let bCanvas = canvas.toDataURL();
let dl_button = document.querySelector("#dl");
let show_button = document.querySelector("#btn_visibility");
let fontin = document.querySelector("#sizeselector");
let fontsize = fontin.value;
fontin.setAttribute("value", fontsize.toString());
fontin.addEventListener("input", function () {
  fontsize = fontin.value;
  showLocation();
});
click_button.addEventListener("click", function () {
  let ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.font = fontsize + "pt 'Amatic SC'";
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  ctx.fillStyle = color;
  let gl = Math.round(video.videoWidth / 32);
  ctx.fillText(
    place.substring(0, place.search(",")),
    gl,
    20 + Math.round(fontsize),
    video.videoWidth - 80
  );
  let date = new Date();
  ctx.fillText(
    date.getDate() + "." + (date.getMonth() + 1) + "." + date.getFullYear(),
    gl,
    video.videoHeight - 20,
    video.videoWidth - 80
  );
  show_button.disabled = false;
  dl_button.disabled = false;
});

function dlCanvas() {
  /// create an "off-screen" anchor tag
  let lnk = document.createElement("a"),
    e;

  /// the key here is to set the download attribute of the a tag
  lnk.download = "image.png";

  if (canvas.toDataURL() === bCanvas) {
    alert("No photo taken!");
  } else {
    lnk.href = canvas.toDataURL("image/png;base64");

    /// create a "fake" click-event to trigger the download
    if (document.createEvent) {
      e = document.createEvent("MouseEvents");
      e.initMouseEvent(
        "click",
        true,
        true,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );

      lnk.dispatchEvent(e);
    }
  }
}
document.querySelector("#dl").addEventListener("click", dlCanvas, false);

/******************************************************/
/***************** Toggle Visibility, Display None, Display Block ***********/
const togglevisibility = document.querySelector("#btn_visibility");
togglevisibility.innerHTML = '<span class="material-icons"> collections </span>';
/* Klick Event Listener hinzufügen */
togglevisibility.addEventListener(
  "click",
  function () {
    // anonyme Funktion
    let btn = document.querySelector("#btn_visibility");
    let camera = document.querySelector("#camera-frame");
    let photo = document.querySelector("#photo-frame");

    if (btn.innerHTML === '<span class="material-icons"> collections </span>') {
      console.log("if");
      btn.innerHTML = '<span class="material-icons">photo_camera</span>';
      camera.style.display = "none";
      photo.style.display = "block";
      photo.style.visibility = "visible";
    } else {
      console.log("else");
      btn.innerHTML = '<span class="material-icons"> collections </span>';
      photo.style.display = "none";
      camera.style.display = "block";
      camera.style.visibility = "visible";
    }
  },
  true
);
/****************************************************************************/

let currentStream;
let videoConstraints = {
  width: { ideal: 99999 },
  height: { ideal: 99999 },
  facingMode: "environment",
};

let camSwitch = document.querySelector("#flip-cam");

function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

camSwitch.addEventListener(
  "click",
  () => {
    let tbh = document.querySelector("#camera-frame");
    tbh.style.visibility = "hidden";
    if (typeof currentStream !== "undefined") {
      stopMediaTracks(currentStream);
    }
    if (videoConstraints.facingMode === "environment") {
      videoConstraints.facingMode = "user";
    } else {
      videoConstraints.facingMode = "environment";
    }
    constraints.video = videoConstraints;
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      currentStream = stream;
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    })
    let delayInMilliseconds = 1200;
    setTimeout(() => {tbh.style.visibility="visible"}, delayInMilliseconds);
  }
)

let supportsOrientationChange = "onorientationchange" in window,
    orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

window.addEventListener(orientationEvent, function() {
  let delayInMilliseconds = 100;
  setTimeout(showLocation, delayInMilliseconds);
  showLocation();
}, true);