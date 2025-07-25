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
} from 'lucide-react';

interface IconOptions {
  iconName: string;
  iconColor?: string | null;
  iconSize?: string | null;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    customIcon: {
      insertIcon: (options: IconOptions) => ReturnType;
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

  // parseHTML() {
  //   return [
  //     {
  //       tag: 'span[data-icon]',
  //     },
  //   ];
  // },
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
  // renderHTML({ HTMLAttributes }) {
  //   return [
  //     'span',
  //     {
  //       'data-icon': HTMLAttributes.iconName,
  //       'data-color': HTMLAttributes.iconColor,
  //       'data-size': HTMLAttributes.iconSize,
  //       style: `color: ${HTMLAttributes.iconColor || 'currentColor'}; display: inline-flex; align-items: center;`,
  //       class: 'inline-icon',
  //     },
  //     `[${HTMLAttributes.iconName || 'icon'}]`,
  //   ];
  // },
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
      `[${HTMLAttributes.iconName}]`, // Always show the icon name, no fallback to 'icon'
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

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [deleteTableDialog, setDeleteTableDialog] = useState(false);
  const [tableWidth, setTableWidth] = useState([100]);
  const [tableHeight, setTableHeight] = useState([200]);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedIconColor, setSelectedIconColor] = useState('');
  const [iconSearchQuery, setIconSearchQuery] = useState('');

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