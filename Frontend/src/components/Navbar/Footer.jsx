import React from 'react'

function Footer() {
  return (
    <footer className="border-t border-gray-300 pt-6 text-center text-sm text-gray-400 bg-black">
      © {new Date().getFullYear()} Moscownpur Circles. All rights reserved.
    </footer>
  )
}

export default Footer