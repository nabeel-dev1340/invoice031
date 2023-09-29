import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import IconWithText from "../components/IconWithTExt";
import IconHome from "../assets/icons/home.png";
import IconSave from "../assets/icons/diskette.png";
import IconPrint from "../assets/icons/printing.png";
import BrandingSection from "../components/BrandingSection";
import HorizontalRule from "../components/HorizontalRule";
import {
  cemeteryNames,
  getCemeteryDataByName,
} from "../utils/cemeteryFunctions";
import ImageModal from "../components/ImageModal";
import colorOptions from "../utils/colorOptions";
import SuccessModal from "../components/SuccessModal";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const InvoicehtmlForm = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [successModalIsOpen, setSuccessModalIsOpen] = useState(false);

  const handleOpenModal = () => {
    setModalIsOpen(true);
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handleSuccessModalOpen = () => {
    setSuccessModalIsOpen(true);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalIsOpen(false);
  };

  const handleImageSelect = (imageSrc, imageTitle) => {
    // Update the selected model image in your form data
    setFormData((prevData) => ({
      ...prevData,
      model: imageSrc,
      selectModelImage: imageTitle,
    }));

    handleCloseModal();
  };

  const generateInvoiceNumber = () => {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 10000); // You can adjust the range as needed
    return `INV-${timestamp}-${random}`;
  };

  useEffect(() => {
    const uniqueInvoiceNumber = generateInvoiceNumber();
    setFormData((prevData) => ({
      ...prevData,
      invoiceNo: uniqueInvoiceNumber,
    }));
    // Make the "invoiceNo" field read-only
    document.getElementById("invoice").readOnly = true;
  }, []);

  // Update the form data to include the initial today's date
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);

    setFormData((prevData) => ({
      ...prevData,
      date: formattedDate, // Pre-set the date field to today's date
    }));
  }, []);

  const handlePrint = () => {
    document.title = "Computerized Invoice";
    window.print();
  };

  // Initialize state to store form data
  const [formData, setFormData] = useState({
    headstoneName: "",
    invoiceNo: "",
    date: "",
    cemetery: "",
    cemeteryAddress: "",
    cemeteryContact: "",
    cemeteryPhone: "",
    zone: "",
    lotOwner: "",
    lotNumber: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    model: "",
    selectModelImage: "",
    modelColor: "",
    modelQty: "",
    modelPrice: "",
    subTotal: "",
    tax: "",
    delivery: "",
    foundation: "",
    discount: "",
    total: "",
    deposit: "",
    balance: "",
    details: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    // Fetch and update cemetery data if cemetery is selected
    if (name === "cemetery") {
      const selectedCemeteryData = getCemeteryDataByName(value);
      if (selectedCemeteryData) {
        updatedFormData = {
          ...updatedFormData,
          cemeteryAddress: selectedCemeteryData.ADDRESS,
          cemeteryContact: selectedCemeteryData.CONTACT_NAME,
          Cemeteryphone: selectedCemeteryData.PHONE,
          zone: selectedCemeteryData.Zone,
        };
      }
    }

    // Calculate subtotal when modelQty or modelPrice changes
    if (name === "modelQty" || name === "modelPrice") {
      const quantity = parseFloat(updatedFormData.modelQty);
      const price = parseFloat(updatedFormData.modelPrice);

      if (!isNaN(quantity) && !isNaN(price)) {
        updatedFormData.subTotal = (quantity * price).toFixed(2);
      } else {
        updatedFormData.subTotal = "";
      }
    }

    // Calculate total based on subtotal, tax, stake/delivery, and foundation
    const subTotal = parseFloat(updatedFormData.subTotal);
    const delivery = parseFloat(updatedFormData.delivery);
    const foundation = parseFloat(updatedFormData.foundation);
    const deposit = parseFloat(updatedFormData.deposit);
    const discountPercentage = parseFloat(updatedFormData.discount);

    const subTotalIsValid = !isNaN(subTotal);
    const deliveryIsValid = !isNaN(delivery);
    const foundationIsValid = !isNaN(foundation);
    const depositIsValid = !isNaN(deposit);

    if (subTotalIsValid && deliveryIsValid && foundationIsValid) {
      // Calculate the total without discount
      const totalBeforeTax = subTotal + delivery + foundation;
      const taxPercentage = 8.25; // Fixed tax percentage
      const tax = (totalBeforeTax * (taxPercentage / 100)).toFixed(2);
      updatedFormData.tax = tax;

      // Apply the discount if a discount percentage is entered
      if (!isNaN(discountPercentage) && discountPercentage > 0) {
        const discountAmount = (
          totalBeforeTax *
          (discountPercentage / 100)
        ).toFixed(2);
        updatedFormData.discountAmount = discountAmount;
        updatedFormData.total = (
          totalBeforeTax -
          discountAmount +
          parseFloat(tax)
        ).toFixed(2);
      } else {
        updatedFormData.discountAmount = "";
        updatedFormData.total = (totalBeforeTax + parseFloat(tax)).toFixed(2);
      }
    } else {
      updatedFormData.total = "";
      updatedFormData.tax = "";
      updatedFormData.discountAmount = "";
    }

    // Calculate the balance if a deposit is entered
    if (depositIsValid) {
      updatedFormData.balance = (deposit - updatedFormData.total).toFixed(2);
    } else {
      updatedFormData.balance = "";
    }

    setFormData(updatedFormData);
  };

  const captureFormSnapshot = async () => {
    const pdf = new jsPDF({
      unit: "mm", // Use millimeters as the unit of measurement
      format: "a4", // Set the paper size to A4
    });

    // Capture the form as an image using html2canvas
    const canvas = await html2canvas(document.getElementById("invoice-form"));

    // Get the width and height of the canvas element
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate the aspect ratio to fit the canvas within the A4 paper size
    const aspectRatio = canvasWidth / canvasHeight;

    // Calculate the width and height of the image in the PDF
    let pdfWidth = 190; // A4 paper width in millimeters
    let pdfHeight = pdfWidth / aspectRatio;

    // Ensure that the image fits within the A4 paper size
    if (pdfHeight > 277) {
      pdfHeight = 277; // A4 paper height in millimeters
      pdfWidth = pdfHeight * aspectRatio;
    }

    // Calculate the center position to place the image on the A4 page
    const xPosition = (210 - pdfWidth) / 2; // A4 paper width is 210mm
    const yPosition = (297 - pdfHeight) / 2; // A4 paper height is 297mm

    // Convert the captured image to a data URL
    const imageData = canvas.toDataURL("image/png");

    // Add the captured image to the PDF
    pdf.addImage(imageData, "PNG", xPosition, yPosition, pdfWidth, pdfHeight);

    // Save the PDF as a blob
    const pdfBlob = pdf.output("blob");

    // Create a FormData object to send the blob to the backend
    const finalFormData = new FormData();
    finalFormData.append("pdf", pdfBlob, "invoice.pdf");
    finalFormData.append("headstoneName", formData.headstoneName);
    finalFormData.append("invoiceNo", formData.invoiceNo);

    try {
      // Make an API call to save the PDF and additional data on the backend
      const response = await axios.post(
        "http://localhost:3000/save-invoice", // Replace with your backend API endpoint
        finalFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Success, you can handle it as needed
        console.log("PDF and data saved successfully");
        // Show success modal
        handleSuccessModalOpen();
      } else {
        console.error("Failed to save PDF and data");
      }
    } catch (error) {
      console.error("Error while saving PDF and data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Process the form data or make API calls here
    // console.log("Form Data:", formData);
    // // Capture the form snapshot as a PDF
    // await captureFormSnapshot();
    try {
      // const res = await axios.post("http://localhost:3000/invoice", formData);
      // console.log(res.data);
      // Process the form data or make API calls here
      console.log("Form Data:", formData);
      // Capture the form snapshot as a PDF
      await captureFormSnapshot();
    } catch (error) {
      console.error("API Error:", error);
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
        <div id="invoice-form">
          <BrandingSection />
          <HeadstoneInfoSection>
            <div className="input-row">
              <label htmlFor="name">Name on Headstone:</label>
              <input
                type="text"
                id="name"
                name="headstoneName"
                value={formData.headstoneName}
                onChange={handleInputChange}
                placeholder="Enter name to be written on Headstone"
                required
              />
            </div>
            <div className="input-row">
              <label htmlFor="invoice">Invoice Number:</label>
              <input
                type="text"
                id="invoice"
                name="invoiceNo"
                value={formData.invoiceNo}
                readOnly
              />
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
          </HeadstoneInfoSection>
          <HorizontalRule />
          <CemetrySection>
            <div className="input-row">
              <label htmlFor="cemetery">Cemetery:</label>
              <select
                id="cemetery"
                name="cemetery"
                value={formData.cemetery}
                onChange={handleInputChange}
              >
                <option value="">Select Cemetery</option>
                {cemeteryNames.map((cemeteryName) => (
                  <option key={cemeteryName} value={cemeteryName}>
                    {cemeteryName}
                  </option>
                ))}
              </select>
              <label htmlFor="address">Address:</label>
              <input
                type="text"
                id="address"
                name="cemeteryAddress"
                value={formData.cemeteryAddress}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="input-row">
              <label htmlFor="cemeteryContact">Cemetery Contact:</label>
              <input
                type="text"
                id="cemeteryContact"
                name="cemeteryContact"
                value={formData.cemeteryContact}
                onChange={handleInputChange}
                readOnly
              />
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="Cemeteryphone"
                onChange={handleInputChange}
                value={formData.Cemeteryphone}
                readOnly
              />
              <label htmlFor="zone">Zone:</label>
              <input
                type="text"
                id="zone"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            <div className="input-row">
              <label htmlFor="lotOwner">Lot Owner:</label>
              <input
                type="text"
                id="lotOwner"
                name="lotOwner"
                value={formData.lotOwner}
                onChange={handleInputChange}
                placeholder="Enter Lot"
                required
              />
              <label htmlFor="lotNumber">Lot Number:</label>
              <input
                type="text"
                id="lotNumber"
                name="lotNumber"
                value={formData.lotNumber}
                onChange={handleInputChange}
                placeholder="Enter lot number"
                required
              />
            </div>
          </CemetrySection>
          <HorizontalRule />
          <CustomerDetailsSection>
            <div className="row">
              <label htmlFor="customerName">Customer Name:</label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Enter customer name"
                required
              />
              <label htmlFor="phone">Phone:</label>
              <input
                type="text"
                id="phone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleInputChange}
                placeholder="Enter customer phone"
                required
              />
            </div>
            <div className="row">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="customerEmail"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="Enter customer email"
                required
              />
            </div>
          </CustomerDetailsSection>
          <HorizontalRule />
          <AccountsSection>
            <div className="model-row">
              <div className="model-input model-flex">
                <label htmlFor="model">Model:</label>
                <SelectModelButton type="button" onClick={handleOpenModal}>
                  Select Model
                </SelectModelButton>
              </div>
              {formData.model !== "" && (
                <div className="selected-image">
                  <img
                    src={formData.model}
                    style={{ width: "70px", height: "50px" }}
                    alt="Selected Model"
                  />
                </div>
              )}
              <div className="model-color model-flex">
                <label htmlFor="model-color">Color:</label>
                <select
                  id="model-color"
                  name="modelColor"
                  value={formData.modelColor}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Color</option>
                  {Object.keys(colorOptions).map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                {formData.modelColor && (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: colorOptions[formData.modelColor],
                    }}
                  />
                )}
              </div>
              <div className="model-qty model-flex">
                <label htmlFor="model-qty">Qty:</label>
                <input
                  type="number"
                  name="modelQty"
                  min={1}
                  value={formData.modelQty}
                  onChange={handleInputChange}
                  placeholder="Enter Quantity"
                  required
                />
              </div>
              <div className="model-price model-flex">
                <label htmlFor="model-price">Price:</label>
                <input
                  type="text"
                  name="modelPrice"
                  value={formData.modelPrice}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                />
              </div>
            </div>
            <div className="details-row">
              <div className="left-section">
                <div className="details-input">
                  <label htmlFor="details">Details:</label>
                  <textarea
                    id="details"
                    name="details"
                    rows="9"
                    cols="60"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Enter details here"
                  ></textarea>
                </div>
                <div className="end-note">
                  <p>
                    Make all checks payable to Headstone World Houston
                    <br />
                    <span className="grey-highlight">
                      Complete orders left over 30 days subject to storage fee
                    </span>
                    <br />
                    Customer Responsible for Cemetery fee
                    <br />
                    <span className="grey-highlight">
                      All purchases are not eligible for refund or exhange
                    </span>
                    <br />
                    Headstone World is not responsible for mistakes
                    <br />
                    which appear in signed and approved orders
                  </p>
                </div>
              </div>
              <div className="right-section">
                <div className="total-inputs">
                  <div className="sub-total model-flex-right">
                    <label htmlFor="sub-total">Sub Total:</label>
                    <input
                      type="number"
                      name="subTotal"
                      value={formData.subTotal}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="tax model-flex-right">
                    <label htmlFor="tax">Tax:</label>
                    <input
                      type="number"
                      name="tax"
                      value={formData.tax}
                      onChange={handleInputChange}
                      placeholder="8.25% of total"
                      readOnly
                    />
                  </div>
                  <div className="delivery model-flex-right">
                    <label htmlFor="delivery">Stake/Delivery:</label>
                    <input
                      type="number"
                      name="delivery"
                      value={formData.delivery}
                      onChange={handleInputChange}
                      placeholder="Enter delivery amount"
                    />
                  </div>
                  <div className="foundation model-flex-right">
                    <label htmlFor="foundation">Setting/Foundation:</label>
                    <input
                      type="number"
                      name="foundation"
                      value={formData.foundation}
                      onChange={handleInputChange}
                      placeholder="Enter foundation amount"
                    />
                  </div>
                  <div className="discount model-flex-right">
                    <label htmlFor="discount">Discount:</label>
                    <input
                      type="number"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      placeholder="Enter in percentage"
                    />
                  </div>
                  <div className="total model-flex-right">
                    <label htmlFor="total">Total</label>
                    <input
                      type="number"
                      name="total"
                      value={formData.total}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                  <div className="deposit model-flex-right">
                    <label htmlFor="deposit">Deposit:</label>
                    <input
                      type="number"
                      name="deposit"
                      value={formData.deposit}
                      onChange={handleInputChange}
                      placeholder="Enter deposit amount"
                    />
                  </div>
                  <div className="balance model-flex-right">
                    <label htmlFor="balance">Balance:</label>
                    <input
                      type="number"
                      name="balance"
                      value={formData.balance}
                      onChange={handleInputChange}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          </AccountsSection>
        </div>
      </form>
      <ImageModal
        isOpen={modalIsOpen}
        closeModal={handleCloseModal}
        handleImageSelect={handleImageSelect}
      />
      <SuccessModal
        isOpen={successModalIsOpen}
        onClose={handleSuccessModalClose}
        headStoneName={formData.headstoneName}
        invoiceNo={formData.invoiceNo}
        date={formData.date}
        customerName={formData.customerName}
        customerEmail={formData.customerEmail}
        customerPhone={formData.customerPhone}
        cemeteryName={formData.cemetery}
        cemeteryAddress={formData.cemeteryAddress}
        cemeteryContact={formData.cemeteryContact}
        lotNumber={formData.lotNumber}
      />
    </Container>
  );
};

export default InvoicehtmlForm;

const Container = styled.div`
  width: 900px;
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

const NavBar = styled.nav`
  background: #747c7c;
  display: flex;
  height: 60px;
  padding: 15px;
  justify-content: space-between;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #000;
`;

const UtilityContainer = styled.div`
  display: flex;
  gap: 30px;
`;

const HeadstoneInfoSection = styled.section`
  background: #eec843;
  .input-row {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px;
  }

  label {
    flex: 1;
    margin-right: 10px;
    text-align: right;
  }

  input[type="text"],
  input[type="date"] {
    flex: 2;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  input[type="submit"] {
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  input[type="submit"]:hover {
    background-color: #45a049;
  }

  @media screen and (max-width: 480px) {
    .headstone-section {
      max-width: 100%;
    }

    .input-row {
      flex-wrap: wrap;
    }

    label,
    input[type="text"],
    input[type="date"] {
      flex: 100%;
    }

    input[type="submit"] {
      flex: 100%;
    }
  }
`;

const CemetrySection = styled.div`
  background: #5887fb;
  padding: 15px;
  .input-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .input-row label {
    flex: 1;
    margin-right: 10px;
    text-align: right;
  }

  .input-row input[type="text"],
  .input-row select {
    flex: 2;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .input-row:nth-child(2) {
    flex-wrap: wrap;
  }

  .input-row:nth-child(2) label,
  .input-row:nth-child(2) input[type="text"] {
    flex: 1;
    margin-right: 10px;
  }

  .input-row:nth-child(3) label,
  .input-row:nth-child(3) input[type="text"] {
    flex: 1;
    margin-right: 10px;
  }

  @media screen and (max-width: 480px) {
    .cemetery-section {
      max-width: 100%;
    }

    .input-row {
      flex-wrap: wrap;
    }

    .input-row label,
    .input-row input[type="text"],
    .input-row select {
      flex: 100%;
    }
  }
`;

const CustomerDetailsSection = styled.section`
  padding: 10px;
  background: #57facb;
  .row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 80%;
    margin: 0 auto;
  }

  .row label {
    margin-right: 20px;
  }

  .row input[type="text"],
  .row input[type="email"] {
    flex: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-top: 10px;
  }

  @media screen and (max-width: 480px) {
    .customer-details-section {
      max-width: 100%;
    }

    .row label {
      flex-basis: auto;
      text-align: left;
    }
  }
`;

const AccountsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 15px;
  padding-bottom: 20px;
  background: #e7e9eb;

  .model-row {
    display: flex;
    justify-content: space-around;
  }

  .model-flex {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .model-row input,
  select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .details-row {
    display: flex;
    justify-content: space-around;
    gap: 55px;
  }

  .left-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 15px;
  }

  .details-input {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .grey-highlight {
    background-color: #b9b3b3;
  }

  .total-inputs input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .end-note {
    text-align: center;
  }

  .right-section .total-inputs {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .model-flex-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }
`;

const SelectModelButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* Add a little spacing to the right */
`;
