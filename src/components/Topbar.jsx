import React from "react";
import logo from "../assets/images/LOGO-COMMANDES-PRO.png";
import { FaRegUserCircle } from "react-icons/fa";
import { signOutAdmin, useAdminProfile } from "../api/api";
import { Button } from "antd";

function Topbar() {
  const { admin, isLoading, isError, error } = useAdminProfile();

  const handleSignOut = () => {
    signOutAdmin();
  };

  return (
    <div className="flex justify-between m-4">
      <img src={logo} />
      <div>
        <div className="flex text-2xl my-6">
          <FaRegUserCircle />
          <div className="mt-[-4px] mx-1"> Hi, ({admin?.role_name})</div>
          <Button type="primary" danger onClick={handleSignOut}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
