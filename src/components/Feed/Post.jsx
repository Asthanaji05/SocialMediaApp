import React from "react";
import { ThumbsUp, MessageSquare } from "lucide-react";

const Post = ({ userName, userPic, description, file, likes, comments }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={userPic}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="font-semibold">{userName}</h2>
        </div>
        <p className="mt-2 text-gray-700 break-words">{description}</p>
      </div>
      {file && (
        <div className="w-full">
          <img
            src={file}
            alt="Post"
            className="w-full object-cover"
          />
        </div>
      )}
      <div className="p-4 border-t border-gray-200 flex justify-between text-gray-500 text-sm">
        <span className="flex items-center gap-1">
          <ThumbsUp size={16} />
          {likes?.length || 0}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare size={16} />
          {comments?.length || 0}
        </span>
      </div>
    </div>
  );
};

export default Post;
