import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../utils/api.js";
import Post from "./Post.jsx"; // Adjust path if needed
import { useAuth } from "../../contexts/AuthContext.jsx";
import { ThumbsUp, MessageSquare } from "lucide-react"; // Adjust path if needed

const PostDetail = () => {
  const navigate = useNavigate();
  const token = useParams().token;
  const { user } = useAuth();
  const currentUserId = user?._id || null;

  const [post, setPost] = useState(null);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/share/${token}`);
      const { postId } = res.data;
      console.log("Post ID from token:", postId);

      const postRes = await API.get(`/posts/fetchPostById/${postId}`);
      // setPost(JSON.stringify(postRes.data));
      setPost(postRes.data.data);
      console.log("Post data:", JSON.stringify(postRes.data));

    } catch (err) {
      console.error("Error fetching post by token:", err);
    }
  };

  useEffect(() => {
    if (token) fetchPost();
    else console.error("No token provided");
    
  }, [token]);
  useEffect(() => {
  if (post) {
    console.log("Fetched post:", post);
  }
}, [post]);


  if (!post) return <div className="text-white p-4">Loading post...</div>;

  return (
    <div className="flex justify-center mt-8 px-4">
      <Post
        _id={post._id}
        userName={post.userName}
        userPic={post.userPic}
        description={post.description}
        file={post.file}
        fileType={post.fileType}
        likes={post.likes}
        comments={post.comments}
        userId={post.userId}
        createdAt={post.createdAt}
        shareToken={token}
      />
      

    </div>
  );
};

export default PostDetail;
