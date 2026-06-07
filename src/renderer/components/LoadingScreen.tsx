import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div
      className="loading-screen"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        zIndex: 9999,
      }}
    >
      <div
        className="spinner"
        style={{
          width: '48px',
          height: '48px',
          border: '4px solid #f1f3f4',
          borderTop: '4px solid #4285f4',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p
        style={{
          marginTop: '16px',
          fontSize: '16px',
          color: '#5f6368',
          fontWeight: '500',
        }}
      >
        読み込み中...
      </p>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
