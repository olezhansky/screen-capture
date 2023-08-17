import { useEffect, useState, useCallback } from "react";
import Modal from "react-modal";
import ReactCrop from "react-image-crop";
import { getCroppedImage } from "../../utils";
import styles from "./CaptureModal.module.css";

const customStyles = {
  content: {
    top: "5%",
    bottom: "5%",
    left: "5%",
    right: "5%",
    padding: "16px",
    borderRadius: "8px",
    overflow: "auto",
  },
  overlay: { zIndex: 10, backgroundColor: "rgba(0, 0, 0, 0.5)" },
};

const initialCropConfiguration = {
  unit: "%",
  width: 30,
  height: 30,
  x: 25,
  y: 25,
};

const CaptureModal = ({ isOpen, onCancel, imageToCrop, goBack }) => {
  const [croppedImageBlob, setCroppedImageBlob] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const [cropConfiguration, setCropConfiguration] = useState(
    initialCropConfiguration
  );
  const [croppedImage, setCroppedImage] = useState(null);

  console.log("croppedImage", croppedImage);

  const cropImage = useCallback(
    async (crop) => {
      if (imageRef && crop.width && crop.height) {
        const croppedImageUrl = await getCroppedImage(
          imageRef,
          crop,
          "croppedImage.jpeg",
          setCroppedImageBlob
        );
        setCroppedImage(croppedImageUrl);
      }
    },
    [imageRef]
  );

  useEffect(() => {
    cropImage(cropConfiguration).then();
  }, [cropConfiguration, cropImage, imageRef]);

  const handleCropImage = async () => {
    try {
      const formData = new FormData();
      formData.append("file", croppedImageBlob);
      onCancel();
      console.log("formData", formData);
    } catch (err) {
      console.error("Error");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      style={customStyles}
      closeTimeoutMS={300}
      contentLabel="Select Search Area"
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <button onClick={goBack}>Back</button>
          <button onClick={onCancel}>Close</button>
        </div>
        <div className={styles.main}>
          <ReactCrop
            src={imageToCrop}
            crop={cropConfiguration}
            ruleOfThirds
            onImageLoaded={(image) => setImageRef(image)}
            onComplete={(crop) => cropImage(crop)}
            onChange={(cropConfig) => setCropConfiguration(cropConfig)}
            style={{ height: "100%" }}
          />
        </div>
        <div className={styles.bottom}>
          <button onClick={handleCropImage}>Send cropped image</button>
        </div>
      </div>
    </Modal>
  );
};

export default CaptureModal;
