import React, { useState, useEffect } from "react";
import styled from "styled-components";

const EngravingArt = ({ headStoneName, invoiceNo, oldEngravingImage }) => {
  const [engravingImagesBase64, setEngravingImagesBase64] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (oldEngravingImage && oldEngravingImage.length > 0) {
      const extractedBase64Images = oldEngravingImage.map(
        (item) => item?.base64Data
      );
      setEngravingImagesBase64(extractedBase64Images);
    }
  }, [oldEngravingImage]);

  const handleEngravingImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const loadImages = async () => {
      for (const file of files) {
        const reader = new FileReader();

        reader.onload = () => {
          setEngravingImagesBase64((prevImages) => [
            ...prevImages,
            reader.result,
          ]);
        };

        reader.readAsDataURL(file);
      }
    };

    loadImages();
  };

  const submitToEngraving = async (e) => {
    e.preventDefault();

    try {
      if (engravingImagesBase64.length === 0) {
        console.error("No engraving images have been selected.");
        return;
      }

      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);

      engravingImagesBase64.forEach((base64Image, index) => {
        const blob = dataURLtoBlob(base64Image);
        formDataToSend.append(`engravingImages`, blob, `engraving${index}.png`);
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/engraving-submission`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Engraving submission successful!");
        setSubmissionSuccess(true);
      } else {
        console.error("Engraving submission failed.");
      }
    } catch (error) {
      console.error("Error submitting engraving:", error);
    }
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

  const removeEngravingImage = (index) => {
    const updatedImages = [...engravingImagesBase64];
    updatedImages.splice(index, 1);
    setEngravingImagesBase64(updatedImages);
  };

  return (
    <EngravingContainer>
      <h3>Engraving Submission</h3>
      <EngravingForm>
        <InputLabel>Photos of Engraving</InputLabel>
        <ImageInput
          type="file"
          multiple
          onChange={handleEngravingImageUpload}
        />
        <ImagePreview>
          {engravingImagesBase64.map((base64Image, index) => (
            <div key={index} className="thumbnail-container">
              <span
                className="delete-button"
                onClick={() => removeEngravingImage(index)}
              >
                &#x2716;
              </span>
              <Thumbnail src={base64Image} alt={`Engraving ${index}`} />
            </div>
          ))}
        </ImagePreview>
        <SubmitButton
          type="button"
          onClick={submitToEngraving}
          disabled={engravingImagesBase64.length === 0 || submissionSuccess}
        >
          {submissionSuccess ? "Submitted" : "Submit to Install"}
        </SubmitButton>
      </EngravingForm>
    </EngravingContainer>
  );
};

export default EngravingArt;

const EngravingContainer = styled.div`
  background: #eec843;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  h3 {
    font-size: 24px;
  }
`;

const EngravingForm = styled.div`
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
