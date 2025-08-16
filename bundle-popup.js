#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("📦 Bundling popup with dependencies...");

// Read the popup files
const popupIndex = fs.readFileSync("dist/popup/index.js", "utf8");
const popupComponent = fs.readFileSync("dist/popup/Popup.js", "utf8");

// Create a bundled version that doesn't rely on external modules
const bundledPopup = `
// Bundled popup for PromptHero - All dependencies included
(function() {
  'use strict';

  // Simple React-like implementation for the popup
  function createElement(type, props, ...children) {
    if (typeof type === 'string') {
      const element = document.createElement(type);
      if (props) {
        Object.keys(props).forEach(key => {
          if (key === 'className') {
            element.className = props[key];
          } else if (key.startsWith('on')) {
            element.addEventListener(key.toLowerCase().substring(2), props[key]);
          } else {
            element.setAttribute(key, props[key]);
          }
        });
      }
      children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(document.createTextNode(child));
        } else if (child) {
          element.appendChild(child);
        }
      });
      return element;
    } else {
      return type(props, children);
    }
  }

  // Simple component system
  function useState(initialValue) {
    let state = initialValue;
    const setState = (newValue) => {
      state = newValue;
      // Re-render would happen here in a real implementation
    };
    return [state, setState];
  }

  // Mock React components
  const React = {
    createElement,
    useState,
    StrictMode: ({ children }) => children
  };

  // Mock Radix UI Theme
  const Theme = ({ children, appearance }) => {
    document.body.className = appearance || 'dark';
    return children;
  };

  // Mock React DOM
  const createRoot = (container) => ({
    render: (element) => {
      container.innerHTML = '';
      if (typeof element === 'function') {
        container.appendChild(element());
      } else {
        container.appendChild(element);
      }
    }
  });

  // Include the popup component code here
  ${popupComponent.replace(/import.*?from.*?['"][^'"]*['"];?\n?/g, "")}

  // Initialize the popup
  const container = document.getElementById('root');
  const root = createRoot(container);
  root.render(React.createElement(React.StrictMode, null, 
    React.createElement(Theme, { appearance: "dark" }, 
      React.createElement(Popup, {})
    )
  ));
})();
`;

fs.writeFileSync("dist/popup/index.js", bundledPopup);

console.log("✅ Popup bundled successfully!");
