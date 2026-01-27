import React from 'react';
import Sidebar from '../components/SideBar';
import PostCreator from '../components/PostCreator';
import PostFeed from '../components/PostFeed';
import './HomeView.css';

const HomeView: React.FC = () => {
  return (
    <div className="home-container">
      <div className="home-box">
        <Sidebar />
        <main className="main-content">
          <PostCreator />
          <PostFeed />
        </main>
      </div>
    </div>
  );
};

export default HomeView;
