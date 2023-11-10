import React, { useState, useEffect } from "react";
import styled from "styled-components";

const InstallationForm = ({
  headStoneName,
  invoiceNo,
  foundationInstall,
  monumentSetting,
}) => {
  const [foundationInstallImagesBase64, setFoundationInstallImagesBase64] =
    useState([]);
  const [monumentSettingImageBase64, setMonumentSettingImageBase64] =
    useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (foundationInstall) {
      const extractedBase64Images = foundationInstall.map(
        (item) => item?.base64Data
      );
      setFoundationInstallImagesBase64(extractedBase64Images);
    }
    if (monumentSetting) {
      setMonumentSettingImageBase64(monumentSetting);
    }
  }, [foundationInstall, monumentSetting]);

  const handleFoundationInstallUpload = (e) => {
    const files = Array.from(e.target.files);

    const loadImages = async () => {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = () => {
          setFoundationInstallImagesBase64((prevImages) => [
            ...prevImages,
            reader.result,
          ]);
        };

        reader.readAsDataURL(file);
      }
    };

    loadImages();
  };

  const removeFoundationImage = (index) => {
    const updatedImages = [...foundationInstallImagesBase64];
    updatedImages.splice(index, 1);
    setFoundationInstallImagesBase64(updatedImages);
  };

  const handleMonumentSettingUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setMonumentSettingImageBase64(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const submitToFoundation = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);

      // Append foundation install images
      foundationInstallImagesBase64.forEach((base64Image, index) => {
        const blob = dataURLtoBlob(base64Image);
        formDataToSend.append(
          `foundationInstallImages`,
          blob,
          `image${index}.png`
        );
      });

      // Append monument setting image
      if (monumentSettingImageBase64) {
        const blob = dataURLtoBlob(monumentSettingImageBase64);
        formDataToSend.append(
          "foundationInstallImages",
          blob,
          "monument-setting.png"
        );
      }

      // Make a POST request to your API endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/foundation-submission`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        // Handle successful response (e.g., show a success message)
        console.log("Foundation/Setting submission successful!");
        setSubmissionSuccess(true);
      } else {
        // Handle error response
        console.error("Foundation/Setting submission failed.");
      }
    } catch (error) {
      console.error("Error submitting Foundation/Setting:", error);
    }
  };

  return (
    <FormContainer>
      <InputLabel>Foundation Install</InputLabel>
      <ImageInput
        type="file"
        multiple
        onChange={handleFoundationInstallUpload}
      />
      <ImagePreview>
        {foundationInstallImagesBase64.map((image, index) => (
          <div key={index} className="thumbnail-container">
            <span
              className="delete-button"
              onClick={() => removeFoundationImage(index)}
            >
              &#x2716;
            </span>
            <Thumbnail src={image} alt="Non-image file" />
          </div>
        ))}
      </ImagePreview>
      <InputLabel>Monument Setting</InputLabel>
      <ImageInput type="file" onChange={handleMonumentSettingUpload} />
      <ImagePreview>
        {monumentSettingImageBase64 && (
          <Thumbnail src={monumentSettingImageBase64} alt="Non-image file" />
        )}
      </ImagePreview>
      <SubmitButton
        type="button"
        onClick={submitToFoundation}
        disabled={
          foundationInstallImagesBase64.length <= 0 ||
          monumentSettingImageBase64 === null ||
          submissionSuccess
        }
      >
        {submissionSuccess ? "Submitted" : "Submit to Upload"}
      </SubmitButton>
    </FormContainer>
  );
};

function dataURLtoBlob(dataURL) {
  const parts = dataURL.split(",");
  const contentType = parts[0].split(";")[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uint8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uint8Array], { type: contentType });
}

const FormContainer = styled.div`
  margin-top: 20px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  color: #333;
  display: block;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ImageInput = styled.input`
  display: block;
  margin-bottom: 10px;
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .thumbnail-container {
    position: relative;
    margin: 5px;
  }

  .thumbnail {
    max-width: 100px;
    max-height: 100px;
    border: 1px solid #ddd;
  }

  .delete-button {
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    color: #f00; /* Red color */
    font-size: 20px;
  }
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
  margin: 10px;
`;

const SubmitButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export default InstallationForm;
