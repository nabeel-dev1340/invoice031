import React, { useState } from "react";
import styled from "styled-components";

const EngravingArt = ({ headStoneName, invoiceNo }) => {
  const [engravingImage, setEngravingImage] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleEngravingImageUpload = (e) => {
    const file = e.target.files[0];
    setEngravingImage(file);
  };

  const submitToEngraving = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);

      if (engravingImage) {
        formDataToSend.append("engravingImage", engravingImage);
      }

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
        // Handle successful response (e.g., show a success message)
        console.log("Engraving submission successful!");
        setSubmissionSuccess(true);
      } else {
        // Handle error response
        console.error("Engraving submission failed.");
      }
    } catch (error) {
      console.error("Error submitting engraving:", error);
    }
  };

  return (
    <EngravingContainer>
      <h3>Engraving Submission</h3>
      <EngravingForm>
        <InputLabel>Photo of Engraving</InputLabel>
        <ImageInput
          type="file"
          accept="image/*"
          onChange={handleEngravingImageUpload}
          required
        />
        {engravingImage && (
          <ImagePreview>
            <Thumbnail src={URL.createObjectURL(engravingImage)} />
          </ImagePreview>
        )}
        <SubmitButton
          type="button"
          onClick={submitToEngraving}
          disabled={engravingImage === null || submissionSuccess}
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

const EngravingForm = styled.form`
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
