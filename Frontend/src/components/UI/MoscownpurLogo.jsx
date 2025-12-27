import React from 'react';

const MoscownpurLogo = ({ className = "w-10 h-10", ...props }) => {
    return (
        <svg
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            {/* Left Circle */}
            <circle
                cx="80"
                cy="100"
                r="50"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
            />

            {/* Right Circle */}
            <circle
                cx="120"
                cy="100"
                r="50"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
            />

            {/* Top Circle */}
            <circle
                cx="100"
                cy="70"
                r="50"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
            />

            {/* Center Dot */}
            <circle
                cx="100"
                cy="100"
                r="10"
                fill="currentColor"
            />
        </svg>
    );
};

export default MoscownpurLogo;
