/**
 * Icon System
 *
 * 2,035 icons available as an optimized SVG sprite:
 * - 2,034 Lucide icons (https://lucide.dev)
 * - Custom Valiify icons (prefixed with 'custom-')
 *
 * See src/icons/README.md for full documentation.
 */

import type { Meta, StoryObj } from '@storybook/html';

// Sprite URL (served by Storybook)
const spriteUrl = '/sprite.svg';

// Load sprite (in a real app, this would be in your HTML once)
const loadSprite = () => {
  if (typeof document !== 'undefined' && !document.getElementById('icon-sprite')) {
    fetch(spriteUrl)
      .then(res => res.text())
      .then(svg => {
        const div = document.createElement('div');
        div.id = 'icon-sprite';
        div.style.display = 'none';
        div.innerHTML = svg;
        document.body.insertBefore(div, document.body.firstChild);
      });
  }
};

loadSprite();

const meta: Meta = {
  title: 'Foundations/Icons',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
# Icon System

Complete icon library with **2,035 icons** delivered as an optimized SVG sprite.

## Usage

\`\`\`html
<svg class="icon" width="24" height="24" aria-hidden="true">
  <use href="#search" />
</svg>
\`\`\`

## Features

- ✅ 2,034 Lucide icons
- ✅ Custom Valiify icons (prefixed with \`custom-\`)
- ✅ SVG sprite (optimized, cacheable)
- ✅ Uses \`currentColor\` (inherits text color)
- ✅ Scales with font-size
- ✅ Framework-agnostic

See **src/icons/README.md** for full documentation.
        `
      }
    }
  }
};

export default meta;
type Story = StoryObj;

// Helper to create icon grid
const createIconGrid = (icons: Array<{ name: string; label: string }>) => {
  return `
    <style>
      .icon-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 1rem;
        padding: 1rem;
      }
      .icon-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        transition: all 0.2s;
      }
      .icon-item:hover {
        border-color: #3b82f6;
        background: #f8fafc;
      }
      .icon {
        display: inline-block;
        stroke-width: 2;
        fill: none;
        stroke: currentColor;
      }
      .icon-name {
        font-size: 11px;
        color: #64748b;
        text-align: center;
        word-break: break-word;
      }
    </style>
    <div class="icon-grid">
      ${icons.map(icon => `
        <div class="icon-item">
          <svg class="icon" width="24" height="24" aria-hidden="true">
            <use href="#${icon.name}" />
          </svg>
          <span class="icon-name">${icon.label}</span>
        </div>
      `).join('')}
    </div>
  `;
};

/**
 * Common icons used throughout the dashboard interface.
 */
export const CommonIcons: Story = {
  render: () => createIconGrid([
    { name: 'search', label: 'search' },
    { name: 'filter', label: 'filter' },
    { name: 'settings', label: 'settings' },
    { name: 'menu', label: 'menu' },
    { name: 'more-horizontal', label: 'more-horizontal' },
    { name: 'more-vertical', label: 'more-vertical' },
    { name: 'user', label: 'user' },
    { name: 'users', label: 'users' },
    { name: 'bell', label: 'bell' },
    { name: 'home', label: 'home' },
    { name: 'calendar', label: 'calendar' },
    { name: 'mail', label: 'mail' },
  ])
};

/**
 * Navigation and directional icons.
 */
export const NavigationIcons: Story = {
  render: () => createIconGrid([
    { name: 'arrow-left', label: 'arrow-left' },
    { name: 'arrow-right', label: 'arrow-right' },
    { name: 'arrow-up', label: 'arrow-up' },
    { name: 'arrow-down', label: 'arrow-down' },
    { name: 'chevron-left', label: 'chevron-left' },
    { name: 'chevron-right', label: 'chevron-right' },
    { name: 'chevron-up', label: 'chevron-up' },
    { name: 'chevron-down', label: 'chevron-down' },
    { name: 'x', label: 'x (close)' },
    { name: 'check', label: 'check' },
    { name: 'minus', label: 'minus' },
    { name: 'plus', label: 'plus' },
  ])
};

/**
 * Status and feedback icons.
 */
export const StatusIcons: Story = {
  render: () => `
    <style>
      .status-demo {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
      .status-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        border-radius: 6px;
        background: #f8fafc;
      }
      .icon { stroke-width: 2; fill: none; stroke: currentColor; }
      .icon-success { color: oklch(0.5269 0.0996 169.13); }
      .icon-error { color: oklch(0.5458 0.1847 21.87); }
      .icon-warning { color: oklch(0.6765 0.1352 72.89); }
      .icon-info { color: oklch(0.4234 0.1163 256.9); }
    </style>
    <div class="status-demo">
      <div class="status-item">
        <svg class="icon icon-success" width="20" height="20" aria-hidden="true">
          <use href="#check-circle" />
        </svg>
        <span>Success: Operation completed</span>
      </div>
      <div class="status-item">
        <svg class="icon icon-error" width="20" height="20" aria-hidden="true">
          <use href="#x-circle" />
        </svg>
        <span>Error: Something went wrong</span>
      </div>
      <div class="status-item">
        <svg class="icon icon-warning" width="20" height="20" aria-hidden="true">
          <use href="#alert-circle" />
        </svg>
        <span>Warning: Please review</span>
      </div>
      <div class="status-item">
        <svg class="icon icon-info" width="20" height="20" aria-hidden="true">
          <use href="#info" />
        </svg>
        <span>Info: Additional information available</span>
      </div>
    </div>
  `
};

/**
 * File and document icons.
 */
export const FileIcons: Story = {
  render: () => createIconGrid([
    { name: 'file', label: 'file' },
    { name: 'file-text', label: 'file-text' },
    { name: 'file-plus', label: 'file-plus' },
    { name: 'folder', label: 'folder' },
    { name: 'folder-open', label: 'folder-open' },
    { name: 'download', label: 'download' },
    { name: 'upload', label: 'upload' },
    { name: 'save', label: 'save' },
    { name: 'trash-2', label: 'trash-2' },
    { name: 'edit-3', label: 'edit-3' },
    { name: 'copy', label: 'copy' },
    { name: 'paperclip', label: 'paperclip' },
  ])
};

/**
 * Custom Valiify icons (prefixed with 'custom-').
 */
export const CustomIcons: Story = {
  render: () => createIconGrid([
    { name: 'custom-valiify-logo', label: 'custom-valiify-logo' },
  ])
};

/**
 * Icon sizes demonstrate how icons scale.
 */
export const IconSizes: Story = {
  render: () => `
    <style>
      .size-demo {
        display: flex;
        align-items: center;
        gap: 2rem;
        padding: 2rem;
      }
      .size-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .icon { stroke-width: 2; fill: none; stroke: currentColor; }
      .size-label {
        font-size: 11px;
        color: #64748b;
      }
    </style>
    <div class="size-demo">
      <div class="size-item">
        <svg class="icon" width="16" height="16" aria-hidden="true">
          <use href="#heart" />
        </svg>
        <span class="size-label">16px (sm)</span>
      </div>
      <div class="size-item">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#heart" />
        </svg>
        <span class="size-label">20px (md)</span>
      </div>
      <div class="size-item">
        <svg class="icon" width="24" height="24" aria-hidden="true">
          <use href="#heart" />
        </svg>
        <span class="size-label">24px (lg)</span>
      </div>
      <div class="size-item">
        <svg class="icon" width="32" height="32" aria-hidden="true">
          <use href="#heart" />
        </svg>
        <span class="size-label">32px (xl)</span>
      </div>
    </div>
  `
};

/**
 * Icons in buttons demonstrate real-world usage.
 */
export const IconsInButtons: Story = {
  render: () => `
    <style>
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: calc(0.25rem * 1.25);
        height: calc(0.25rem * 7);
        padding: 0 calc(0.25rem * 3);
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        line-height: normal;
        cursor: pointer;
        transition: all 0.15s;
      }
      .btn-primary {
        border: none;
        background: oklch(0.4234 0.1163 256.9);
        color: #ffffff;
      }
      .btn-primary:hover {
        background: oklch(0.3509 0.0948 257.07);
      }
      .btn-outline {
        border: 0.5px solid oklch(0.2027 0.0395 282.3 / 0.078);
        background: transparent;
        color: oklch(0.202 0.0079 285.67);
      }
      .btn-outline:hover {
        background: oklch(0.2027 0.0395 282.3 / 0.031);
      }
      .icon {
        stroke-width: 2;
        fill: none;
        stroke: currentColor;
      }
      .button-demo {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        padding: 1rem;
      }
    </style>
    <div class="button-demo">
      <button class="btn btn-primary">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#save" />
        </svg>
        Save Changes
      </button>
      <button class="btn btn-primary">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#download" />
        </svg>
        Download
      </button>
      <button class="btn btn-outline">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#search" />
        </svg>
        Search
      </button>
      <button class="btn btn-outline">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#filter" />
        </svg>
        Filter
      </button>
      <button class="btn btn-outline" aria-label="Settings">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#settings" />
        </svg>
      </button>
      <button class="btn btn-outline" aria-label="More options">
        <svg class="icon" width="20" height="20" aria-hidden="true">
          <use href="#more-horizontal" />
        </svg>
      </button>
    </div>
  `
};
