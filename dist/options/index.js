import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import Options from './Options';
const container = document.getElementById('root');
const root = createRoot(container);
root.render(_jsx(React.StrictMode, { children: _jsx(Theme, { appearance: "dark", children: _jsx(Options, {}) }) }));
