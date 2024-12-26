import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useSingleOrder } from "../../api/api";
import html2pdf from "html2pdf.js";


function OrderInvoice() {
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
    <div className="w-3/5 mx-auto mt-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div id="content" ref={invoiceRef}>
        {/* Header Section */}
        <div className="flex flex-wrap justify-between">
          <div className="text-">
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
        <div className="flex justify-between gap-6 mt-6">
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
      >
        <PrinterOutlined /> Print Invoice
      </Button>
    </div>
  );
}
export default OrderInvoice;