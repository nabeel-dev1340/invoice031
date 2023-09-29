import React, { useState, useEffect } from "react";
import styled from "styled-components";

const InstallationForm = ({ headStoneName, invoiceNo }) => {
  const [foundationInstallImages, setFoundationInstallImages] = useState([]);
  const [foundationInstallPreviews, setFoundationInstallPreviews] = useState(
    []
  );
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [monumentSettingImage, setMonumentSettingImage] = useState(null);

  const handleFoundationInstallUpload = (e) => {
    const files = Array.from(e.target.files);
    setFoundationInstallImages((prevImages) => [...prevImages, ...files]);
  };

  useEffect(() => {
    const imagePreviews = foundationInstallImages.map((file) =>
      URL.createObjectURL(file)
    );
    setFoundationInstallPreviews(imagePreviews);

    return () => {
      imagePreviews.forEach(URL.revokeObjectURL);
    };
  }, [foundationInstallImages]);

  const handleMonumentSettingUpload = (e) => {
    const file = e.target.files[0];
    setMonumentSettingImage(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("headstoneName", headStoneName);
      formDataToSend.append("invoiceNo", invoiceNo);

      // Append final art images
      foundationInstallImages.forEach((file, index) => {
        formDataToSend.append(`foundationInstallImages`, file);
      });

      // Append cemetery approval image
      if (monumentSettingImage) {
        formDataToSend.append("foundationInstallImages", monumentSettingImage);
      }

      // Make a POST request to your API endpoint
      const response = await fetch(
        "http://localhost:3000/foundation-submission",
        {
          method: "POST",
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
        accept="image/*"
        multiple
        onChange={handleFoundationInstallUpload}
      />
      <ImagePreview>
        {foundationInstallPreviews.map((image, index) => (
          <Thumbnail key={index} src={image} />
        ))}
      </ImagePreview>
      <InputLabel>Monument Setting</InputLabel>
      <ImageInput
        type="file"
        accept="image/*"
        onChange={handleMonumentSettingUpload}
      />
      <SubmitButton
        type="button"
        onClick={handleUpload}
        disabled={
          foundationInstallImages.length <= 0 ||
          monumentSettingImage === null ||
          submissionSuccess
        }
      >
        {submissionSuccess ? "Submitted" : "Submit to Upload"}
      </SubmitButton>
    </FormContainer>
  );
};

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
