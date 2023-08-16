export const getCroppedImage = (
  sourceImage,
  cropConfig,
  fileName,
  setCroppedImageBlob
) => {
  const canvas = document.createElement("canvas");
  const scaleX = sourceImage.naturalWidth / sourceImage.width;
  const scaleY = sourceImage.naturalHeight / sourceImage.height;
  canvas.width = cropConfig.width;
  canvas.height = cropConfig.height;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    sourceImage,
    cropConfig.x * scaleX,
    cropConfig.y * scaleY,
    cropConfig.width * scaleX,
    cropConfig.height * scaleY,
    0,
    0,
    cropConfig.width,
    cropConfig.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      // eslint-disable-next-line no-param-reassign
      blob.name = fileName;
      setCroppedImageBlob(blob);

      // creating a Object URL representing the Blob object given
      const croppedImageUrl = window.URL.createObjectURL(blob);

      resolve(croppedImageUrl);
    }, "image/png");
  });
};
