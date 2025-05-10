import React from "react";

const Story = ({ userName, userPic, file }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-1">
        <img src={userPic} alt={userName} className="w-full h-full rounded-full" />
      </div>
      <p className="text-sm mt-1">{userName}</p>
    </div>
  );
};

export default Story;
