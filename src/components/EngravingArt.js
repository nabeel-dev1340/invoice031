import React, { useState, useEffect } from "react";
import styled from "styled-components";

const EngravingArt = ({ headStoneName, invoiceNo, oldEngravingImage }) => {
  const [engravingImageBase64, setEngravingImageBase64] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // Set oldEngravingImage to engravingImageBase64 if it's not null
  useEffect(() => {
    if (oldEngravingImage) {
      setEngravingImageBase64(oldEngravingImage);
    }
  }, [oldEngravingImage]);

  const handleEngravingImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result;
      setEngravingImageBase64(base64String);
    };

    reader.readAsDataURL(file);
  };

  const submitToEngraving = async (e) => {
    e.preventDefault();

    try {
      if (!engravingImageBase64) {
        console.error("No engraving image has been selected.");
        return;
      }

      // Convert the base64 image to a Blob
      const blob = dataURLtoBlob(engravingImageBase64);

      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);
      formDataToSend.append("engravingImage", blob, "engraving.png");

      // Make a POST request to your API endpoint
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
        // Handle a successful response (e.g., show a success message)
        console.log("Engraving submission successful!");
        setSubmissionSuccess(true);
      } else {
        // Handle an error response
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

  return (
    <EngravingContainer>
      <h3>Engraving Submission</h3>
      <EngravingForm>
        <InputLabel>Photo of Engraving</InputLabel>
        <ImageInput
          type="file"
          onChange={handleEngravingImageUpload}
        />
        {engravingImageBase64 && (
          <ImagePreview>
            <Thumbnail src={engravingImageBase64} alt="Non-image file" />
          </ImagePreview>
        )}
        <SubmitButton
          type="button"
          onClick={submitToEngraving}
          disabled={engravingImageBase64 === null || submissionSuccess}
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
