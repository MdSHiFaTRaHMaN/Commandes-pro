import React, { useRef, useState } from "react";
import { useSingleOrder } from "../../api/api";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import { toPng } from "html-to-image";

function InvoiceOrder() {
  const { orderId } = useParams();
  const { singleOrder, isLoading } = useSingleOrder(orderId);
  const invoiceRef = useRef(); // Reference to the invoice container
  const [printLoading, setPrintLoading] = useState(false);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!singleOrder) {
    return <div>Order not found!</div>;
  }

  const {
    company,
    created_at,
    delivery_date,
    sub_total,
    tax_amount,
    total,
    products,
    user_delivery_address,
  } = singleOrder;

  // Function to handle printing the invoice

  const printInvoice = () => {
    setPrintLoading(true);
    const element = document.getElementById("content");
    toPng(element)
      .then((imgData) => {
        const pdf = new jsPDF();
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.autoPrint();
        const pdfBlob = pdf.output("bloburl");
        const iframe = document.createElement("iframe");
        iframe.style.position = "fixed";
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        iframe.src = pdfBlob;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow.print();
        };
        setPrintLoading(false);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setPrintLoading(false);
      });
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div id="content" ref={invoiceRef}>
        {/* Header Section */}
        <div className="flex flex-wrap justify-between">
          <div className="text-lg">
            <h1 className="my-6 text-2xl font-semibold">CommandesPro</h1>
            <p>10, rue de la Chicane</p>
            <p>59620 Villeneuve d'Ascq</p>
            <p>Tel.: 01 23 45 67 89</p>
            <p>Email: contact@commandespros.com</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p>Invoice No: {singleOrder.id}</p>
            <p>Invoice Date: {new Date(created_at).toLocaleDateString()}</p>
            <p>Order No: {singleOrder.id}</p>
            <p>Order Date: {new Date(delivery_date).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Billing and Delivery Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h2 className="font-bold">Billing Address:</h2>
            <p>{company}</p>
          </div>
          <div>
            <h2 className="font-bold">Delivery Address:</h2>
            <p>Contact: {user_delivery_address.contact}</p>
            <p>Phone: {user_delivery_address.phone}</p>
            <p>Address: {user_delivery_address.address}</p>
            <p>City: {user_delivery_address.city}</p>
            <p>Post Code: {user_delivery_address.post_code}</p>
          </div>
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
              {products.map((product, index) => (
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
            <p className="flex justify-between">
              <span>Subtotal (excl. tax):</span>
              <span>{sub_total.toFixed(2)} €</span>
            </p>
            <p className="flex justify-between">
              <span>VAT Amount:</span>
              <span>{tax_amount.toFixed(2)} €</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Total (incl. VAT):</span>
              <span>{total.toFixed(2)} €</span>
            </p>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <Button
        type="default"
        className="text-white bg-PrimaryColor p-5 font-semibold mt-6"
        onClick={printInvoice}
        loading={printLoading}
        disabled={printLoading}
      >
        <PrinterOutlined /> Print Invoice
      </Button>
    </div>
  );
}

export default InvoiceOrder;
