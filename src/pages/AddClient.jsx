import { useState } from "react";
import { Input, Select, DatePicker, Button, message } from "antd";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const AddClient = () => {
  const [profile, setProfile] = useState("Restoration");
  const [loading, setLoading] = useState();
  const navigate = useNavigate();
  const handleProfileChange = (value) => {
    setProfile(value);
  };

  const handleClientAdd = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    const email = form.get("email");
    const company = form.get("company_name");
    const siret = form.get("siret_number");
    const contract_facturation = form.get("billing_address");
    const taught = form.get("taught");
    const post_code = form.get("postal_code");
    const contract_comptabilité = form.get("billing_contact");
    const account_phone = form.get("mobile");
    const creation_date = form.get("creation_date");
    const name = form.get("client_name");
    const city = form.get("city");
    const account_type = profile;

    const password = "12345678";
    const account_email = "account.johndoe@example.com";
    const brand = "Doe Enterprises";

    const data = {
      email,
      account_type,
      siret,
      company,
      contract_facturation,
      post_code,
      account_phone,
      contract_comptabilité,
      password,
      name,
      account_email,
      city,
      brand,
      taught,
      creation_date,
    };

    try {
      setLoading(true);
      const response = await API.post("/user/signup", data);
      if (response.status == 200) {
        message.success("Postal Code add Successfully");
        navigate("/customers");
      }
      console.log(response, "resposne");
      setLoading(false);
    } catch (error) {
      console.error(error);
      message.error("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h1 className="text-pink-500 text-2xl font-bold mb-6 text-center">
          Add a Client
        </h1>

        <div className="flex gap-4 mb-6">
          <Button
            type={profile === "Restauration" ? "primary" : "default"}
            onClick={() => handleProfileChange("Restauration")}
          >
            Restauration
          </Button>
          <Button
            type={profile === "Revendeur" ? "primary" : "default"}
            onClick={() => handleProfileChange("Revendeur")}
          >
            Revendeur
          </Button>
          <Button
            type={profile === "Grossiste" ? "primary" : "default"}
            onClick={() => handleProfileChange("Grossiste")}
          >
            Grossiste
          </Button>
          <Button
            type={profile === "Supper Marcent" ? "primary" : "default"}
            onClick={() => handleProfileChange("Supper Marcent")}
          >
            Supper Marcent
          </Button>
        </div>

        <form onSubmit={handleClientAdd}>
          {/* Form Inputs */}
          <div className="space-y-5">
            <div>
              <h4>Client Name:</h4>
              <Input
                placeholder="Client Name *"
                name="client_name"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Email:</h4>
              <Input
                placeholder="Email *"
                name="email"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Company Name *</h4>
              <Input
                name="company_name"
                placeholder="Company Name *"
                className="border-gray-300 py-2"
              />
            </div>

            <div>
              <h4>Siret Number *</h4>
              <Input
                name="siret_number"
                placeholder="Siret Number *"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Taught *</h4>
              <Input
                placeholder="Taught *"
                name="taught"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Type City *</h4>
              <Input
                name="city"
                placeholder="Type City *"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Billing Address *</h4>
              <Input
                name="billing_address"
                placeholder="Billing Address *"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Postal Code *</h4>
              <Input
                name="postal_code"
                placeholder="Postal Code *"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Billing Contact Name *</h4>
              <Input
                name="billing_contact"
                placeholder="Billing Contact Name *"
                className="border-gray-300 py-2"
              />
            </div>

            <div>
              <h4>Mobile / Direct Line *</h4>
              <Input
                name="mobile"
                placeholder="Mobile / Direct Line *"
                className="border-gray-300 py-2"
              />
            </div>
            <div>
              <h4>Account Creation Date *</h4>
              <DatePicker
                name="creation_date"
                className="w-full border-gray-300 py-2"
                placeholder="Account Creation Date *"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            loading={loading}
            disabled={loading}
            htmlType="submit"
            className="bg-PrimaryColor py-6 p-4 text-white font-semibold rounded w-full mt-5 cursor-pointer"
          >
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
