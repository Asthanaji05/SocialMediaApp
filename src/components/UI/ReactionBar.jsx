import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface ReactionBarProps {
  likes: number;
  comments: number;
}

const ReactionBar = ({ likes, comments }: ReactionBarProps) => {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500">
        <Heart className="h-5 w-5" />
        <span>{likes}</span>
      </button>
      
      <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500">
        <MessageCircle className="h-5 w-5" />
        <span>{comments}</span>
      </button>
      
      <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500">
        <Share2 className="h-5 w-5" />
        <span>Share</span>
      </button>
    </div>
  );
};

export default ReactionBar;