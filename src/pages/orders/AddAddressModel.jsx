import { Modal } from "antd";
import { useState } from "react";
import { BiLocationPlus } from "react-icons/bi";

const AddAddressModel = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div>
      <span className="flex items-center gap-1 font-semibold" onClick={showModal}>
        <BiLocationPlus /> Add Address
      </span>
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        
      </Modal>
    </div>
  );
};

export default AddAddressModel;
