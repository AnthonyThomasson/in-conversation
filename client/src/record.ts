import { MediaRecorder, register } from "extendable-media-recorder";
import { connect } from "extendable-media-recorder-wav-encoder";

if (navigator.mediaDevices) {
  console.log("getUserMedia supported.");

  await register(await connect());

  let startBtn = document.querySelector("#startBtn") as HTMLButtonElement;
  let stopBtn = document.querySelector("#stopBtn") as HTMLButtonElement;

  const constraints = { audio: true };
  let chunks: Blob[] = [];

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/wav",
      });
      startBtn.onclick = () => {
        mediaRecorder.start();
        console.log(mediaRecorder.state);
        console.log("recorder started");
        startBtn.style.background = "red";
        startBtn.style.color = "black";
      };

      stopBtn.onclick = () => {
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");
        startBtn.style.background = "";
        startBtn.style.color = "";
      };

      mediaRecorder.onstop = (e) => {
        console.log("data available after MediaRecorder.stop() called.");

        const audio = document.querySelector("#audioOut") as HTMLAudioElement;
        const downloadBtn = document.querySelector(
          "#downloadBtn"
        ) as HTMLLinkElement;
        audio.controls = true;
        const blob = new Blob(chunks, { type: "audio/wav" });
        chunks = [];
        const audioURL = URL.createObjectURL(blob);
        audio.src = audioURL;
        downloadBtn.href = audioURL;
        console.log("recorder stopped");
      };

      mediaRecorder.ondataavailable = (e: BlobEvent) => {
        chunks.push(e.data);
        console.log(chunks);
      };
    })
    .catch((err) => {
      console.error(`The following error occurred: ${err}`);
    });
}
