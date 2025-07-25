'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import { Node } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useMemo } from 'react';
import { ConfirmDialog } from '@/components/confirm-dialog';
import * as LucideIcons from 'lucide-react';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Table as TableIcon,
  Heading1,
  Heading2,
  Heading3,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Trash2,
  Plus,
  Minus,
  Settings,
  Search,
  RectangleHorizontal,
} from 'lucide-react';

interface IconOptions {
  iconName: string;
  iconColor?: string | null;
  iconSize?: string | null;
}

interface ButtonOptions {
  text: string;
  url?: string;
  iconName?: string;
  iconColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  variant?: 'default' | 'outline' | 'accent';
  hasIcon?: boolean;
  hasShadow?: boolean;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customIcon: {
      insertIcon: (options: IconOptions) => ReturnType;
    };
    customButton: {
      insertButton: (options: ButtonOptions) => ReturnType;
    };
  }
}

const IconExtension = Node.create({
  name: 'customIcon',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      iconName: {
        default: null,
      },
      iconColor: {
        default: null,
      },
      iconSize: {
        default: '16',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-icon]',
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          return {
            iconName: element.getAttribute('data-icon'),
            iconColor: element.getAttribute('data-color'),
            iconSize: element.getAttribute('data-size') || '16',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        'data-icon': HTMLAttributes.iconName,
        'data-color': HTMLAttributes.iconColor,
        'data-size': HTMLAttributes.iconSize,
        style: `color: ${HTMLAttributes.iconColor || 'currentColor'}; display: inline-flex; align-items: center;`,
        class: 'inline-icon',
      },
      `[${HTMLAttributes.iconName}]`,
    ];
  },

  addCommands() {
    return {
      insertIcon: (options: IconOptions) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

const ButtonExtension = Node.create({
  name: 'customButton',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      text: {
        default: 'Button',
      },
      url: {
        default: '',
      },
      iconName: {
        default: null,
      },
      iconColor: {
        default: '#ffffff',
      },
      backgroundColor: {
        default: '#3b82f6',
      },
      textColor: {
        default: '#ffffff',
      },
      borderWidth: {
        default: 0,
      },
      borderColor: {
        default: '#3b82f6',
      },
      variant: {
        default: 'default',
      },
      hasIcon: {
        default: false,
      },
      hasShadow: {
        default: false,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-button]',
        getAttrs: (dom) => {
          const element = dom as HTMLElement;
          return {
            text: element.getAttribute('data-text'),
            url: element.getAttribute('data-url'),
            iconName: element.getAttribute('data-icon'),
            iconColor: element.getAttribute('data-icon-color'),
            backgroundColor: element.getAttribute('data-bg-color'),
            textColor: element.getAttribute('data-text-color'),
            borderWidth: parseInt(element.getAttribute('data-border-width') || '0'),
            borderColor: element.getAttribute('data-border-color'),
            variant: element.getAttribute('data-variant'),
            hasIcon: element.getAttribute('data-has-icon') === 'true',
            hasShadow: element.getAttribute('data-has-shadow') === 'true',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const {
      text,
      url,
      iconName,
      iconColor,
      backgroundColor,
      textColor,
      borderWidth,
      borderColor,
      variant,
      hasIcon,
      hasShadow,
    } = HTMLAttributes;

    const buttonStyle = {
      backgroundColor: variant === 'outline' ? 'transparent' : backgroundColor,
      color: variant === 'outline' ? borderColor || backgroundColor : textColor,
      border: borderWidth > 0 ? `${borderWidth}px solid ${borderColor || backgroundColor}` : 'none',
      boxShadow: hasShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
      padding: '8px 16px',
      borderRadius: '6px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      textDecoration: 'none',
      fontWeight: '500',
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    };

    const styleString = Object.entries(buttonStyle)
      .map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join('; ');

    const iconSvg = hasIcon && iconName ? `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${iconColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
        ${getIconSvgPath(iconName)}
      </svg>
    ` : '';

    const buttonContent = `${iconSvg}${text}`;

    if (url) {
      return [
        'div',
        {
          'data-button': 'true',
          'data-text': text,
          'data-url': url,
          'data-icon': iconName,
          'data-icon-color': iconColor,
          'data-bg-color': backgroundColor,
          'data-text-color': textColor,
          'data-border-width': borderWidth.toString(),
          'data-border-color': borderColor,
          'data-variant': variant,
          'data-has-icon': hasIcon.toString(),
          'data-has-shadow': hasShadow.toString(),
          class: 'custom-button-wrapper',
          style: 'margin: 8px 0;',
        },
        [
          'a',
          {
            href: url,
            target: '_blank',
            rel: 'noopener noreferrer',
            style: styleString,
          },
          buttonContent,
        ],
      ];
    }

    return [
      'div',
      {
        'data-button': 'true',
        'data-text': text,
        'data-url': url,
        'data-icon': iconName,
        'data-icon-color': iconColor,
        'data-bg-color': backgroundColor,
        'data-text-color': textColor,
        'data-border-width': borderWidth.toString(),
        'data-border-color': borderColor,
        'data-variant': variant,
        'data-has-icon': hasIcon.toString(),
        'data-has-shadow': hasShadow.toString(),
        class: 'custom-button-wrapper',
        style: 'margin: 8px 0;',
      },
      [
        'button',
        {
          style: styleString,
        },
        buttonContent,
      ],
    ];
  },

  addCommands() {
    return {
      insertButton: (options: ButtonOptions) => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});

const mostUsefulIcons = [
  'BarChart2',
  'Code',
  'Code2',
  'DownloadCloud',
  'Eye',
  'FileVideo',
  'FileDown',
  'FlaskConical',
  'Hexagon',
  'Key',
  'Layers',
  'LayoutDashboard',
  'LucideBarChartHorizontalBig',
  'Maximize',
  'Minimize',
  'Moon',
  'Settings',
  'Sun',
  'Package',
  'Pencil',
  'PieChart',
  'Power',
  'Puzzle',
  'ShieldCheck',
  'ShipWheel',
  'Star',
  'Scroll',
  'Trash',
  'UploadCloud',
  'Users',
  'ArrowRight',
  'Download',
  'ExternalLink',
  'Play',
  'ChevronRight',
];

const iconColors = [
  { name: 'Purple', value: '#7700ff' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Rose', value: '#f43f5e' },
];

const buttonColors = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Purple', value: '#7c3aed' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
];

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

// Helper function to get SVG path for icons
const getIconSvgPath = (iconName: string) => {
  const iconPaths: Record<string, string> = {
    ArrowRight: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>',
    Download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    ExternalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    Play: '<polygon points="5,3 19,12 5,21"/>',
    ChevronRight: '<polyline points="9,18 15,12 9,6"/>',
    BarChart2: '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    Code: '<polyline points="16,18 22,12 16,6"/><polyline points="8,6 2,12 8,18"/>',
    Code2: '<path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/>',
    DownloadCloud: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m8 17 4 4 4-4"/>',
    Eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    FileVideo: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m10 15.5 4-2.5-4-2.5v5z"/>',
    FileDown: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M12 18v-6"/><path d="m9 15 3 3 3-3"/>',
    FlaskConical: '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/>',
    Hexagon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
    Key: '<path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/><path d="m21 2-9.6 9.6"/><circle cx="7.5" cy="15.5" r="5.5"/>',
    Layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    LayoutDashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    LucideBarChartHorizontalBig: '<rect width="6" height="14" x="2" y="5" rx="2"/><rect width="6" height="10" x="12" y="7" rx="2"/><rect width="6" height="6" x="22" y="9" rx="2"/>',
    Maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',
    Minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',
    Moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    Package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    Pencil: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    PieChart: '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="m22 12A10 10 0 0 0 12 2v10z"/>',
    Power: '<path d="M12 2v10"/><path d="M18.4 6.6a9 9 0 1 1-12.77.04"/>',
    Puzzle: '<path d="M19.439 7.85c-.049.322-.059.648-.026.975.056.506.194.958.5 1.335.34.389.85.594 1.348.594.492 0 .98-.218 1.294-.687.154-.23.239-.497.239-.776 0-.408-.155-.796-.43-1.084-.275-.29-.634-.459-1.018-.459-.369 0-.714.178-.934.467-.16.211-.252.469-.252.735 0 .199.044.393.117.573"/>',
    ShieldCheck: '<path d="M20 13c0 5-3.5 7.5-8 7.5S4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    ShipWheel: '<circle cx="12" cy="12" r="8"/><path d="m12 2 3 10-3-1-3 1Z"/><path d="M12 22V12"/><path d="m17 20.5-5-8 5-3 5 8Z"/><path d="M2 12h10"/><path d="M22 12h-10"/><path d="m7 3.5 5 8-5 3-5-8Z"/>',
    Star: '<polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>',
    Scroll: '<path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v11a2 2 0 0 0 2 2z"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/>',
    Trash: '<polyline points="3,6 5,6 21,6"/><path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>',
    UploadCloud: '<path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>',
    Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 21-3.5-3.5a4 4 0 0 0-7 0L8 21"/>',
    Settings: '<circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17-4a4 4 0 0 1-8 0 4 4 0 0 1 8 0ZM7 12a4 4 0 0 1-8 0 4 4 0 0 1 8 0Z"/>',
  };

  return iconPaths[iconName] || '<circle cx="12" cy="12" r="2"/>';
};

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [deleteTableDialog, setDeleteTableDialog] = useState(false);
  const [tableWidth, setTableWidth] = useState([100]);
  const [tableHeight, setTableHeight] = useState([200]);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [buttonPickerOpen, setButtonPickerOpen] = useState(false);
  const [selectedIconColor, setSelectedIconColor] = useState('');
  const [iconSearchQuery, setIconSearchQuery] = useState('');
  
  // Button configuration state
  const [buttonConfig, setButtonConfig] = useState<ButtonOptions>({
    text: 'Button',
    url: '',
    iconName: '',
    iconColor: '#ffffff',
    backgroundColor: '#3b82f6',
    textColor: '#ffffff',
    borderWidth: 0,
    borderColor: '#3b82f6',
    variant: 'default',
    hasIcon: false,
    hasShadow: false,
  });

  const filteredIcons = useMemo(() => {
    if (!iconSearchQuery.trim()) {
      return mostUsefulIcons;
    }

    const query = iconSearchQuery.toLowerCase();
    return mostUsefulIcons.filter(iconName =>
      iconName.toLowerCase().includes(query) ||
      iconName.replace(/([A-Z])/g, ' $1').trim().toLowerCase().includes(query)
    );
  }, [iconSearchQuery]);

  const colors = [
    { name: 'Purple', value: '#7700ff' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Cyan', value: '#06b6d4' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Lime', value: '#84cc16' },
  ];

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: 'prose-heading',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4',
          },
        },
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-6 my-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-6 my-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: '',
          },
        },
      }),
      TextStyle,
      Color,
      IconExtension,
      ButtonExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline underline-offset-2 hover:text-blue-800',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Table.configure({
        resizable: true,
        lastColumnResizable: false,
        allowTableNodeSelection: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 bg-gray-50 font-medium p-3 text-left',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 p-3',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-neutral dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter URL:', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addTable = () => {
    const rows = parseInt(window.prompt('Enter number of rows:', '3') || '3');
    const cols = parseInt(window.prompt('Enter number of columns:', '3') || '3');

    if (rows > 0 && cols > 0) {
      editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    }
  };

  const deleteTable = () => {
    setDeleteTableDialog(true);
  };

  const confirmDeleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  const addColumnBefore = () => {
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    editor.chain().focus().deleteRow().run();
  };

  const insertIcon = (iconName: string) => {
    editor.chain().focus().insertIcon({
      iconName,
      iconColor: selectedIconColor || 'currentColor',
      iconSize: '16',
    }).run();
    setIconPickerOpen(false);
    setIconSearchQuery('');
  };

  const insertButton = () => {
    editor.chain().focus().insertButton(buttonConfig).run();
    setButtonPickerOpen(false);
    // Reset button config
    setButtonConfig({
      text: 'Button',
      url: '',
      iconName: '',
      iconColor: '#ffffff',
      backgroundColor: '#3b82f6',
      textColor: '#ffffff',
      borderWidth: 0,
      borderColor: '#3b82f6',
      variant: 'default',
      hasIcon: false,
      hasShadow: false,
    });
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const clearTextColor = () => {
    editor.chain().focus().unsetColor().run();
  };

  const updateTableSize = () => {
    const table = editor.view.dom.querySelector('table') as HTMLTableElement;
    if (table) {
      table.style.width = `${tableWidth[0]}%`;
      table.style.height = `${tableHeight[0]}px`;
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive('code') ? 'bg-accent' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-accent' : ''}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-accent' : ''}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-accent' : ''}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive({ textAlign: 'justify' }) ? 'bg-accent' : ''}
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button type="button" variant="ghost" size="sm" onClick={addLink}>
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addImage}>
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addTable}>
          <TableIcon className="h-4 w-4" />
        </Button>

        <Popover open={iconPickerOpen} onOpenChange={setIconPickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Insert Icon">
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <h4 className="font-medium text-sm mb-2">Insert Icon</h4>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={iconSearchQuery}
                  onChange={(e) => setIconSearchQuery(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Icon Color</Label>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant={selectedIconColor === '' ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs px-2 py-1 h-6"
                    onClick={() => setSelectedIconColor('')}
                  >
                    Default
                  </Button>
                  {iconColors.map((color) => (
                    <Button
                      key={color.value}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`h-6 w-6 p-0 rounded-full border-2 ${selectedIconColor === color.value ? 'border-foreground' : 'border-transparent'
                        } hover:border-muted-foreground`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedIconColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-1 p-3 max-h-64 overflow-y-auto">
              {filteredIcons.length > 0 ? (
                filteredIcons.map((iconName) => {
                  const IconComponent = (LucideIcons as any)[iconName];
                  if (!IconComponent) return null;

                  return (
                    <Button
                      key={iconName}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 p-0 hover:bg-accent flex flex-col items-center justify-center gap-1"
                      onClick={() => insertIcon(iconName)}
                      title={iconName}
                    >
                      <IconComponent
                        className="h-4 w-4"
                        style={{ color: selectedIconColor || 'currentColor' }}
                      />
                      <span className="text-xs truncate w-full text-center">
                        {iconName.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </Button>
                  );
                })
              ) : (
                <div className="col-span-6 text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No icons found</p>
                  <p className="text-xs">Try a different search term</p>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={buttonPickerOpen} onOpenChange={setButtonPickerOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" title="Insert Button">
              <RectangleHorizontal className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <div className="p-4 space-y-4">
              <h4 className="font-medium text-sm">Insert Button</h4>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Button Text</Label>
                  <Input
                    value={buttonConfig.text}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Button text"
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs">URL (Optional)</Label>
                  <Input
                    value={buttonConfig.url}
                    onChange={(e) => setButtonConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs">Button Style</Label>
                  <Select
                    value={buttonConfig.variant}
                    onValueChange={(value: 'default' | 'outline' | 'accent') => 
                      setButtonConfig(prev => ({ ...prev, variant: value }))
                    }
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                      <SelectItem value="accent">Accent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={buttonConfig.hasIcon}
                    onCheckedChange={(checked) => 
                      setButtonConfig(prev => ({ ...prev, hasIcon: checked }))
                    }
                  />
                  <Label className="text-xs">Include Icon</Label>
                </div>

                {buttonConfig.hasIcon && (
                  <div>
                    <Label className="text-xs">Select Icon</Label>
                    <Select
                      value={buttonConfig.iconName}
                      onValueChange={(value) => 
                        setButtonConfig(prev => ({ ...prev, iconName: value }))
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Choose an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {mostUsefulIcons.slice(0, 10).map((iconName) => (
                          <SelectItem key={iconName} value={iconName}>
                            {iconName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Background Color</Label>
                    <div className="flex gap-1 mt-1">
                      {buttonColors.slice(0, 5).map((color) => (
                        <Button
                          key={color.value}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 rounded-full border-2 ${buttonConfig.backgroundColor === color.value ? 'border-foreground' : 'border-transparent'
                            }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setButtonConfig(prev => ({ ...prev, backgroundColor: color.value }))}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Text Color</Label>
                    <div className="flex gap-1 mt-1">
                      {buttonColors.slice(5, 10).map((color) => (
                        <Button
                          key={color.value}
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 rounded-full border-2 ${buttonConfig.textColor === color.value ? 'border-foreground' : 'border-transparent'
                            }`}
                          style={{ backgroundColor: color.value }}
                          onClick={() => setButtonConfig(prev => ({ ...prev, textColor: color.value }))}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Border Width: {buttonConfig.borderWidth}px</Label>
                  <Slider
                    value={[buttonConfig.borderWidth]}
                    onValueChange={([value]) => 
                      setButtonConfig(prev => ({ ...prev, borderWidth: value }))
                    }
                    max={4}
                    min={0}
                    step={1}
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={buttonConfig.hasShadow}
                    onCheckedChange={(checked) => 
                      setButtonConfig(prev => ({ ...prev, hasShadow: checked }))
                    }
                  />
                  <Label className="text-xs">Add Shadow</Label>
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-xs mb-2 block">Preview</Label>
                  <div
                    style={{
                      backgroundColor: buttonConfig.variant === 'outline' ? 'transparent' : buttonConfig.backgroundColor,
                      color: buttonConfig.variant === 'outline' ? buttonConfig.borderColor || buttonConfig.backgroundColor : buttonConfig.textColor,
                      border: buttonConfig.borderWidth > 0 ? `${buttonConfig.borderWidth}px solid ${buttonConfig.borderColor || buttonConfig.backgroundColor}` : 'none',
                      boxShadow: buttonConfig.hasShadow ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                    }}
                  >
                    {buttonConfig.hasIcon && buttonConfig.iconName && (
                      <div style={{ width: '16px', height: '16px' }}>
                        {(() => {
                          const IconComponent = (LucideIcons as any)[buttonConfig.iconName];
                          return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
                        })()}
                      </div>
                    )}
                    {buttonConfig.text}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={insertButton}
                  className="w-full"
                  size="sm"
                >
                  Insert Button
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {editor.isActive('table') && (
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="bg-accent">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="start">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Table Width (%)</Label>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={tableWidth}
                      onValueChange={setTableWidth}
                      max={100}
                      min={20}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">{tableWidth[0]}%</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Table Height (px)</Label>
                  <div className="flex items-center space-x-3">
                    <Slider
                      value={tableHeight}
                      onValueChange={setTableHeight}
                      max={800}
                      min={100}
                      step={20}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-16">{tableHeight[0]}px</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={updateTableSize}
                  className="w-full"
                >
                  Apply Size
                </Button>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm mb-2">Columns</h4>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColumnBefore}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Before
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addColumnAfter}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      After
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deleteColumn}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Rows</h4>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRowBefore}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Before
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addRowAfter}
                      className="flex-1"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      After
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deleteRow}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={deleteTable}
                  className="w-full"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete Table
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}

        <Separator orientation="vertical" className="h-6" />

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-3" align="start">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Text Color</h4>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color) => (
                  <Button
                    key={color.value}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full border-2 border-transparent hover:border-muted-foreground"
                    style={{ backgroundColor: color.value }}
                    onClick={() => setTextColor(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={clearTextColor}
              >
                Clear Color
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <EditorContent editor={editor} />

      <ConfirmDialog
        open={deleteTableDialog}
        onOpenChange={setDeleteTableDialog}
        title="Delete Table"
        description="Are you sure you want to delete this table? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteTable}
      />
    </div>
  );
}