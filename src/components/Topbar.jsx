import React from "react";
import logo from "../assets/images/LOGO-COMMANDES-PRO.png";
import { FaRegUserCircle } from "react-icons/fa";
import { signOutAdmin, useAdminProfile } from "../api/api";
import { Button } from "antd";
import { Link } from "react-router-dom";

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
          <Link to="/admin-profile"><div className="mt-[-4px] mx-1"> Hi, ({admin?.role_name})</div></Link>
          <Button type="primary" danger onClick={handleSignOut}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
