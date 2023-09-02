import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import IconWithText from "../components/IconWithTExt";
import IconHome from "../assets/icons/home.png";
import IconSave from "../assets/icons/diskette.png";
import IconPrint from "../assets/icons/printing.png";
import ArtComponent from "../components/ArtComponent";
import EngravingArt from "../components/EngravingArt";
import InstallationForm from "../components/InstallationForm";

const WorkOrder = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const location = useLocation();
  const {
    headStoneName,
    invoiceNo,
    date,
    customerEmail,
    customerName,
    customerPhone,
    cemeteryName,
    cemeteryAddress,
    cemeteryContact,
    lotNumber,
  } = location.state;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  useEffect(() => {
    const imagePreviews = uploadedImages.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewImages(imagePreviews);

    return () => {
      previewImages.forEach(URL.revokeObjectURL);
    };
  }, [uploadedImages]);

  const handlePrint = () => {
    document.title = "Computerized Print";
    window.print();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the form data or make API calls here
    console.log("Form Data:");
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <NavBar className="nav-bar">
          <StyledLink to="/">
            <IconWithText iconSrc={IconHome} text="Home" />
          </StyledLink>
          <UtilityContainer>
            <IconWithText iconSrc={IconSave} type="submit" text="Save" />
            <IconWithText
              iconSrc={IconPrint}
              onClick={handlePrint}
              text="Print"
            />
          </UtilityContainer>
        </NavBar>
        <Header>
          <HeadstoneName>{headStoneName}</HeadstoneName>
          <Details>
            <Detail>
              <DetailTitle>Invoice No:</DetailTitle>
              <DetailValue>{invoiceNo}</DetailValue>
            </Detail>
            <Detail>
              <DetailTitle>Date:</DetailTitle>
              <DetailValue>{date}</DetailValue>
            </Detail>
          </Details>
          <CustomerDetails>
            <Detail>
              <DetailTitle>Customer Name:</DetailTitle>
              <DetailValue>{customerName}</DetailValue>
            </Detail>
            <Detail>
              <DetailTitle>Email:</DetailTitle>
              <DetailValue>{customerEmail}</DetailValue>
            </Detail>
            <Detail>
              <DetailTitle>Phone Number:</DetailTitle>
              <DetailValue>{customerPhone}</DetailValue>
            </Detail>
          </CustomerDetails>
        </Header>
        <CustomerDesign>
          <SectionTitle>Customer Design Approval</SectionTitle>
          <DesignForm>
            <InputLabel>Design Approved by Customer</InputLabel>
            <ImageInput
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              required
            />
            <ImagePreview>
              {previewImages.map((image, index) => (
                <Thumbnail key={index} src={image} />
              ))}
            </ImagePreview>
            <SubmitButton type="submit">Submit to Cemetery</SubmitButton>
          </DesignForm>
        </CustomerDesign>
        <ArtComponent />
        <EngravingArt />
        <CemeteryInfo>
          <SectionTitle>Cemetery Information</SectionTitle>
          <CemeteryDetail>
            <DetailTitle>Cemetery Name:</DetailTitle>
            <DetailValue>{cemeteryName}</DetailValue>
          </CemeteryDetail>
          <CemeteryDetail>
            <DetailTitle>Cemetery Address:</DetailTitle>
            <DetailValue>{cemeteryAddress}</DetailValue>
          </CemeteryDetail>
          <CemeteryDetail>
            <DetailTitle>Cemetery Contact:</DetailTitle>
            <DetailValue>{cemeteryContact}</DetailValue>
          </CemeteryDetail>
          <CemeteryDetail>
            <DetailTitle>Lot Number:</DetailTitle>
            <DetailValue>{lotNumber}</DetailValue>
          </CemeteryDetail>
          <InstallationForm />
        </CemeteryInfo>
      </form>
    </Container>
  );
};

export default WorkOrder;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;

  @media print {
    .nav-bar {
      display: none;
    }
    title {
      display: none;
    }
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const NavBar = styled.nav`
  background: #747c7c;
  display: flex;
  align-items: center;
  padding: 15px;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const UtilityContainer = styled.div`
  display: flex;
  gap: 30px;
  margin-left: auto;
`;

const Header = styled.div`
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const HeadstoneName = styled.h2`
  font-size: 28px;
  color: #333;
  margin-bottom: 10px;
`;

const Details = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-top: 20px;
`;

const CustomerDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 30px;
  margin-top: 20px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailTitle = styled.h3`
  font-size: 16px;
  color: #777;
  margin-bottom: 5px;
`;

const DetailValue = styled.p`
  font-size: 18px;
  color: #333;
`;

const CustomerDesign = styled.div`
  width:80%;
  margin-left: auto;
  margin-right: auto;
  background: #57facb;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  color: #333;
  margin-bottom: 15px;
`;

const DesignForm = styled.form`
  margin-top: 20px;
`;

const InputLabel = styled.label`
  font-size: 16px;
  color: #333;
  font-weight: bold;
  display: block;
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

const CemeteryInfo = styled.div`
  background: #f5f5f5;
  width:80%;
  margin: 20px auto;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const CemeteryDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;
