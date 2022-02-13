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
  otx.font = "36pt 'Amatic SC'";
  otx.fillStyle = "red";
  otx.fillText(
    place.substring(0, place.search(",")),
    40,
    80,
    video.videoWidth - 80
  );
}
/******************************************************/
/****************** Kamera **************************/
const video = document.querySelector("#video");

// Ensure cross-browser functionality.
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
    showLocation();
  })
  .catch((e) => {
    document.querySelector("#camera").innerHTML =
      "<p>Kamera nicht benutzbar!</p>";
    console.log(e);
  });

let click_button = document.querySelector("#btn-cam");
let canvas = document.querySelector("#photo_canvas");
let bCanvas = canvas.toDataURL();
let dl_button = document.querySelector("#dl");
let show_button = document.querySelector("#btn_visibility");
click_button.addEventListener("click", function () {
  let ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  let fontsize = video.videoWidth/35;
  ctx.font = fontsize + "pt 'Amatic SC'";
  console.log(video.videoWidth);
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
  ctx.fillStyle = "red";
  ctx.fillText(
    place.substring(0, place.search(",")),
    40,
    80,
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
/* Klick Event Listener hinzufügen */
togglevisibility.addEventListener(
  "click",
  function () {
    // anonyme Funktion
    let btn = document.querySelector("#btn_visibility");
    let camera = document.querySelector("#camera-frame");
    let photo = document.querySelector("#photo-frame");

    if (btn.innerHTML === '<span class="material-icons"> collections </span>') {
      btn.innerHTML = '<span class="material-icons">photo_camera</span>';
      camera.style.display = "none";
      photo.style.display = "block";
      photo.style.visibility = "visible";
    } else {
      btn.innerHTML = '<span class="material-icons"> collections </span>';
      photo.style.display = "none";
      camera.style.display = "block";
      camera.style.visibility = "visible";
    }
  },
  true
);
/****************************************************************************/
