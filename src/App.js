import { useState } from "react";
import "./App.css";
import CaptureModal from "./components/CaptureModal/CaptureModal";

function App() {
  const [isOpenCaptureModal, setIsOpenCaptureModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState("");

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia();
      const video = document.createElement("video");
      video.srcObject = stream;
      video.addEventListener("loadedmetadata", () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        video.play();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        stream.getVideoTracks()[0].stop();
        const result = canvas.toDataURL();
        setImageToCrop(result);
      });
      setIsOpenCaptureModal(true);
    } catch (error) {
      setIsOpenCaptureModal(false);
    }
  };

  const handleCloseCaptureModal = () => {
    setIsOpenCaptureModal(false);
  };

  const handleGoBack = () => {
    setIsOpenCaptureModal(false);
    startCapture(setImageToCrop, setIsOpenCaptureModal).then();
  };

  return (
    <div className="App">
      <div className="Wrapper">
        <CaptureModal
          isOpen={isOpenCaptureModal}
          onCancel={handleCloseCaptureModal}
          imageToCrop={imageToCrop}
          goBack={handleGoBack}
        />
        <button className="Button" onClick={startCapture}>
          Open capture modal
        </button>
      </div>
    </div>
  );
}

export default App;
