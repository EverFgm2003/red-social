import React from 'react';
import './PostCard.css';

interface Props {
  user: string;
  content: string;
  location: string;
  likes: number;
  comments: number;
  image?: string;
  time?: string;
}

const PostCard: React.FC<Props> = ({ 
  user, 
  content, 
  image, 
  time 
}) => {
  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <div className="avatar">
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <circle cx="12" cy="8" r="4"/>
              <path d="M20 21a8 8 0 1 0-16 0"/>
            </svg>
          </div>
          <div>
            <h4>{user}</h4>
          </div>
        </div>
        <span className="post-time">{time}</span>
      </div>
      
      <p className="post-content">{content}</p>
      
      {image && (
        <div className="post-image">
          <img src={image} alt="Post" />
        </div>
      )}
    </div>
  );
};

export default PostCard;