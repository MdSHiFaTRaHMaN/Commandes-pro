import {  Layout } from "antd";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
const { Footer } = Layout;


const Main = () => {
 
  return (
    <Layout>
      <Navbar />
     <Outlet />
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default Main;
