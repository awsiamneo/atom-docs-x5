import * as LucideIcons from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  iconColor?: string;
  iconSize?: string;
  className?: string;
}

export function IconRenderer({ iconName, iconColor, iconSize = '16', className = '' }: IconRendererProps) {
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    return <span className={`inline-flex items-center ${className}`}>[{iconName}]</span>;
  }
  
  return (
    <IconComponent 
      className={`inline-flex items-center ${className}`}
      style={{ 
        color: iconColor || 'currentColor',
        width: `${iconSize}px`,
        height: `${iconSize}px`
      }}
    />
  );
}