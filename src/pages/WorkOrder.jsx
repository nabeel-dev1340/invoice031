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
import html2canvas from "html2canvas";

const WorkOrder = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [formData, setFormData] = useState({
    headStoneName: "",
    invoiceNo: "",
    date: "",
    customerEmail: "",
    customerName: "",
    customerPhone: "",
    cemeteryName: "",
    cemeteryAddress: "",
    cemeteryContact: "",
    lotNumber: "",
  });
  const location = useLocation();

  useEffect(() => {
    // Check if location.state is available
    if (location.state) {
      setFormData(location.state);
    }
  }, [location.state]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Capture the form as an image using html2canvas
      const canvas = await html2canvas(document.getElementById("work-order"));

      // Convert the captured canvas to a Blob
      canvas.toBlob(async (blob) => {
        // Create a FormData object to send data to the server
        const formDataToSend = new FormData();
        formDataToSend.append("invoiceNo", formData.invoiceNo);
        formDataToSend.append("workOrder", blob, `${formData.invoiceNo}.png`);

        // Make a POST API call to the /work-order endpoint
        const response = await fetch("http://localhost:3000/work-order", {
          method: "POST",
          body: formDataToSend,
        });

        if (response.ok) {
          console.log("Work order submission successful!");
          // Optionally, you can redirect or show a success message here
        } else {
          console.error("Work order submission failed.");
          // Handle the error, show an error message, or retry the submission
        }
      }, "image/png");
    } catch (error) {
      console.error("Error while submitting work order:", error);
      // Handle the error, show an error message, or retry the submission
    }
  };

  const submitToCemetery = async () => {
    try {
      const formDataToSend = new FormData();

      // Append all form data fields
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      // Append image files with the correct field name "images"
      uploadedImages.forEach((image, index) => {
        formDataToSend.append("images", image); // Use "images" as the field name
      });

      // Make the API call
      const response = await fetch("http://localhost:3000/submit-to-cemetery", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        console.log("Submission to Cemetery successful!");
        // Optionally, you can redirect or show a success message here
      } else {
        console.error("Submission to Cemetery failed.");
        // Handle the error, show an error message, or retry the submission
      }
    } catch (error) {
      console.error("Error while submitting to Cemetery:", error);
      // Handle the error, show an error message, or retry the submission
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <NavBar className="nav-bar">
          <StyledLink to="/landing-page">
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
        <div id="work-order">
          <Header>
            <HeadstoneName>{formData.headStoneName}</HeadstoneName>
            <Details>
              <Detail>
                <DetailTitle>Invoice No:</DetailTitle>
                <DetailValue>{formData.invoiceNo}</DetailValue>
              </Detail>
              <Detail>
                <DetailTitle>Date:</DetailTitle>
                <DetailValue>{formData.date}</DetailValue>
              </Detail>
            </Details>
            <CustomerDetails>
              <Detail>
                <DetailTitle>Customer Name:</DetailTitle>
                <DetailValue>{formData.customerName}</DetailValue>
              </Detail>
              <Detail>
                <DetailTitle>Email:</DetailTitle>
                <DetailValue>{formData.customerEmail}</DetailValue>
              </Detail>
              <Detail>
                <DetailTitle>Phone Number:</DetailTitle>
                <DetailValue>{formData.customerPhone}</DetailValue>
              </Detail>
            </CustomerDetails>
          </Header>
          <CustomerDesign>
            <SectionTitle>Customer Design Approval</SectionTitle>
            <DesignForm>
              <InputLabel>Design Approved by Customer</InputLabel>
              <ImageInput
                type="file"
                name="images"
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
              <SubmitButton type="button" onClick={submitToCemetery}>
                Submit to Cemetery
              </SubmitButton>
            </DesignForm>
          </CustomerDesign>
          <ArtComponent
            headStoneName={formData.headStoneName}
            invoiceNo={formData.invoiceNo}
          />
          <EngravingArt
            headStoneName={formData.headStoneName}
            invoiceNo={formData.invoiceNo}
          />
          <CemeteryInfo>
            <SectionTitle>Cemetery Information</SectionTitle>
            <CemeteryDetail>
              <DetailTitle>Cemetery Name:</DetailTitle>
              <DetailValue>{formData.cemeteryName}</DetailValue>
            </CemeteryDetail>
            <CemeteryDetail>
              <DetailTitle>Cemetery Address:</DetailTitle>
              <DetailValue>{formData.cemeteryAddress}</DetailValue>
            </CemeteryDetail>
            <CemeteryDetail>
              <DetailTitle>Cemetery Contact:</DetailTitle>
              <DetailValue>{formData.cemeteryContact}</DetailValue>
            </CemeteryDetail>
            <CemeteryDetail>
              <DetailTitle>Lot Number:</DetailTitle>
              <DetailValue>{formData.lotNumber}</DetailValue>
            </CemeteryDetail>
            <InstallationForm
              headStoneName={formData.headStoneName}
              invoiceNo={formData.invoiceNo}
            />
          </CemeteryInfo>
        </div>
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
  width: 80%;
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

const DesignForm = styled.div`
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
  width: 80%;
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
