import React, { useState, useEffect } from "react";
import styled from "styled-components";

const InstallationForm = () => {
  const [foundationInstallImages, setFoundationInstallImages] = useState([]);
  const [foundationInstallPreviews, setFoundationInstallPreviews] = useState(
    []
  );
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
      {/* ... other inputs or buttons ... */}
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

export default InstallationForm;
