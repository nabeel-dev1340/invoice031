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
import { useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const WorkOrder = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [workOrderSaved, setWorkOrderSaved] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
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
    cemeterySubmission: [],
    engravingSubmission: [],
    foundationInstall: [],
    monumentSetting: [],
    cemeteryApproval: [],
    finalArt: [],
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
      // Set uploaded images to cemeterySubmission
      if (location.state.cemeterySubmission) {
        const extractedBase64Images = location?.state?.cemeterySubmission?.map(
          (item) => item?.base64Data
        );
        setUploadedImages(extractedBase64Images);
      }
    }
  }, [location.state]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Convert uploaded images to base64 strings and store them
    const base64Images = [];

    const loadImages = async () => {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = () => {
          base64Images.push(reader.result);
          if (base64Images.length === files.length) {
            // When all images are loaded, update the state
            setUploadedImages((prevImages) => [...prevImages, ...base64Images]);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    loadImages();
  };

  const removeThumbnail = (index) => {
    const updatedImages = [...uploadedImages];
    updatedImages.splice(index, 1);
    setUploadedImages(updatedImages);
  };

  const handlePrint = () => {
    document.title = "Computerized Print";
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingOrder(true);
      // Hide the input elements before capturing the screenshot
      const inputElements = document.querySelectorAll("input[type='file']");
      inputElements.forEach((input) => {
        input.style.display = "none";
      });

      // Capture the form as an image using html2canvas
      const canvas = await html2canvas(document.getElementById("work-order"));

      // Restore the visibility of input elements
      inputElements.forEach((input) => {
        input.style.display = "block";
      });

      // Convert the captured canvas to a Blob
      canvas.toBlob(async (blob) => {
        // Create a FormData object to send data to the server
        const formDataToSend = new FormData();
        formDataToSend.append(
          "workOrder",
          blob,
          `${formData.headStoneName}..${formData.invoiceNo}.png`
        );
        // Append each field of formData to finalFormData
        for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
            formDataToSend.append(key, formData[key]);
          }
        }

        // Make a POST API call to the /work-order endpoint
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/work-order`,
          {
            method: "POST",
            headers: {
              "ngrok-skip-browser-warning": "69420",
            },
            body: formDataToSend,
          }
        );

        if (response.ok) {
          console.log("Work order submission successful!");
          setWorkOrderSaved(true);
          // Optionally, you can redirect or show a success message here
        } else {
          console.error("Work order submission failed.");
          // Handle the error, show an error message, or retry the submission
        }
        setSavingOrder(false); // Stop the saving process
      }, "image/png");
    } catch (error) {
      console.error("Error while submitting work order:", error);
      // Handle the error, show an error message, or retry the submission
      setSavingOrder(false); // Stop the saving process
    }
  };

  const submitToCemetery = async () => {
    try {
      const formDataToSend = new FormData();

      formDataToSend.append("headStoneName", formData.headStoneName);
      formDataToSend.append("invoiceNo", formData.invoiceNo);

      // Convert base64 strings to Blobs and append them
      uploadedImages.forEach((base64Image, index) => {
        const blob = dataURLtoBlob(base64Image);
        formDataToSend.append("images", blob, `image${index}.png`);
      });

      // Make the API call
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/submit-to-cemetery`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Submission to Cemetery successful!");
        setSubmissionSuccess(true);
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

  const closeModal = () => {
    setWorkOrderSaved(false);
  };

  return (
    <Container>
      <NavBar className="nav-bar">
        <StyledLink to="/landing-page">
          <IconWithText iconSrc={IconHome} text="Home" />
        </StyledLink>
        <UtilityContainer>
          <IconWithText
            iconSrc={IconSave}
            type="submit"
            text={savingOrder ? "Saving..." : workOrderSaved ? "Saved" : "Save"}
            onClick={handleSubmit}
          />
          <IconWithText
            iconSrc={IconPrint}
            type="button"
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
              multiple
              onChange={handleImageUpload}
            />
            <ImagePreview>
              {uploadedImages &&
                uploadedImages.map((image, index) => (
                  <div key={index} className="thumbnail-container">
                    <span
                      className="delete-button"
                      onClick={() => removeThumbnail(index)}
                    >
                      &#x2716;
                    </span>
                    <Thumbnail
                      className="thumbnail"
                      src={image}
                      alt="Non-Image file"
                    />
                  </div>
                ))}
            </ImagePreview>
            <SubmitButton
              type="button"
              onClick={submitToCemetery}
              disabled={uploadedImages.length <= 0 || submissionSuccess}
            >
              {submissionSuccess ? "Submitted" : "Submit to Cemetery"}
            </SubmitButton>
          </DesignForm>
        </CustomerDesign>
        <ArtComponent
          headStoneName={formData.headStoneName}
          invoiceNo={formData.invoiceNo}
          finalArt={location.state?.finalArt || []}
          cemeteryApproval={
            (location.state?.cemeteryApproval &&
              location.state.cemeteryApproval[0]?.base64Data) ||
            null
          }
        />
        <EngravingArt
          headStoneName={formData.headStoneName}
          invoiceNo={formData.invoiceNo}
          oldEngravingImage={
            (location.state?.engravingSubmission &&
              location.state.engravingSubmission[0]?.base64Data) ||
            null
          }
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
            foundationInstall={location.state?.foundationInstall || []}
            monumentSetting={
              (location.state?.monumentSetting &&
                location.state?.monumentSetting[0]?.base64Data) ||
              null
            }
          />
        </CemeteryInfo>
      </div>
      {workOrderSaved && (
        <SuccessModal>
          <SuccessModalContent>
            <h2>Work Order Saved Successfully</h2>
            <button onClick={closeModal}>Close</button>
          </SuccessModalContent>
        </SuccessModal>
      )}
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
  background: white;
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid grey;
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

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuccessModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  max-width: 400px; /* Adjust the width as needed */
  text-align: center;

  h2 {
    font-size: 24px;
    color: #333;
    margin-bottom: 15px;
  }

  button {
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
  }
`;
