import { Button } from "antd";
import { PrinterOutlined } from "@ant-design/icons";



function MultiOrderInvoice() {




 

  return (
    <div className="w-3/5 mx-auto mt-5 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
      <div id="content" >
        {/* Header Section */}
        <div className="flex flex-wrap justify-between">
          <div className="text-">
            <h1 className="my-6 text-2xl font-semibold">CommandesPro</h1>
            <p>10, rue de la Chicane</p>
            <p>59620 Villeneuve Ascq</p>
            <p>Tel.: 01 23 45 67 89</p>
            <p>Email: contact@commandespros.com</p>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <p>Invoice No: </p>
            <p>Invoice Date: </p>
            <p>Order No: </p>
            <p>Order Date: </p>
          </div>
        </div>
        {/* Billing and Delivery Address Section */}
        <div className="flex justify-between gap-6 mt-6">
          <div>
            <h2 className="font-bold">Billing Address:</h2>
            <p></p>
          </div>
          <div>
            <h2 className="font-bold">Delivery Address:</h2>
            <p>Contact: </p>
            <p>Phone: </p>
            <p>Address: </p>
            <p>City:</p>
            <p>Post Code: </p>
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
            {/* <tbody>
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
            </tbody> */}
          </table>
        </div>
        {/* Summary Section */}
        <div className="flex justify-end mt-8">
          <div className="w-full md:w-1/3">
            <p className="flex justify-between">
              <span>Subtotal (excl. tax):</span>
              <span>Sub total €</span>
            </p>
            <p className="flex justify-between">
              <span>VAT Amount:</span>
              <span>Tex am €</span>
            </p>
            <p className="flex justify-between font-bold">
              <span>Total (incl. VAT):</span>
              <span>total €</span>
            </p>
          </div>
        </div>
      </div>
      {/* Print Button */}
      <Button
        type="default"
        className="text-white bg-PrimaryColor p-5 font-semibold mt-6"
      >
        <PrinterOutlined /> Multiple Print Invoice
      </Button>
    </div>
  );
}
export default MultiOrderInvoice;