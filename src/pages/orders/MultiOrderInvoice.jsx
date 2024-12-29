import React, { useRef, useState } from "react";
import { Button, Spin } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import logoImage from "../../assets/images/LOGO-COMMANDES-PRO.png";
import { useMultipleOrder } from "../../api/api";
import html2pdf from "html2pdf.js";

function MultiOrderInvoice() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const data = queryParams.get("data")
    ? JSON.parse(queryParams.get("data"))
    : [];
  const invoiceRef = useRef(); // Reference to the invoice container

  const { multipleOrder, isLoading, isError, error, refetch } =
    useMultipleOrder(data);

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const today = new Date();
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const totalPrice = multipleOrder.allProducts.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  const printInvoice = () => {
    const element = invoiceRef.current;

    html2pdf()
      .set({
        margin: 1,
        filename: "invoice.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.autoPrint();
        const pdfData = pdf.output("dataurlstring");
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.src = pdfData;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.print();
        };
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div id="content" ref={invoiceRef}>
        <div>
          <h1 className="text-center  text-4xl font-bold">
            <span className="text-PrimaryColor">Commandes </span>
            Pros
          </h1>
          <h2 className="text-4xl font-semibold text-PrimaryColor">
            Préparation des Commandes du jour
          </h2>

          <p className="text-xl font-semibold">Invoice Date: {formattedDate}</p>
        </div>

        {/* Products Table */}

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-PrimaryColor text-white">
              <tr>
                <th className="border border-gray-300 p-2">Product</th>
                <th className="border border-gray-300 p-2">Quantity</th>
                <th className="border border-gray-300 p-2">
                  Price (excl. VAT)
                </th>
                <th className="border border-gray-300 p-2">
                  Total (excl. VAT)
                </th>
              </tr>
            </thead>
            <tbody>
              {multipleOrder.allProducts.map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {product.name || `Product ${product.product_id}`}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.quantity}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {product.price.toFixed(2)} €
                  </td>
                  <td className="border border-gray-300 p-2">
                    {(product.price * product.quantity).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary Section */}
        <div className="flex justify-end mt-8">
          <div className="w-full md:w-1/3">
            <p className="flex justify-between font-bold">
              <span>Total (incl. VAT):</span>
              <span>{totalPrice.toFixed(2)} €</span>
            </p>
          </div>
        </div>
      </div>
      {/* Print Button */}
      <Button
        type="default"
        className="text-white bg-PrimaryColor p-5 font-semibold mt-6"
        onClick={printInvoice}
      >
        <PrinterOutlined /> Multiple Print Invoice
      </Button>
    </div>
  );
}
export default MultiOrderInvoice;
