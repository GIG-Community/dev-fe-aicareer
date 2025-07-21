import React, { useState, useRef, useEffect } from 'react';
import { 
  Square, Circle, Type, Image, Smartphone, Monitor, 
  Tablet, Palette, Layers, Grid, Undo, Redo 
} from 'lucide-react';

const DesignCanvas = ({ onDesignChange, initialElements = [] }) => {
  const [elements, setElements] = useState(initialElements);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedElement, setSelectedElement] = useState(null);
  const [deviceView, setDeviceView] = useState('desktop');
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  const tools = [
    { id: 'select', icon: '🔗', name: 'Select' },
    { id: 'rectangle', icon: Square, name: 'Rectangle' },
    { id: 'circle', icon: Circle, name: 'Circle' },
    { id: 'text', icon: Type, name: 'Text' },
    { id: 'image', icon: Image, name: 'Image' }
  ];

  const devices = [
    { id: 'mobile', icon: Smartphone, name: 'Mobile', width: '375px' },
    { id: 'tablet', icon: Tablet, name: 'Tablet', width: '768px' },
    { id: 'desktop', icon: Monitor, name: 'Desktop', width: '1024px' }
  ];

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#EC4899', '#6B7280', '#000000', '#FFFFFF', '#F3F4F6'
  ];

  useEffect(() => {
    onDesignChange?.(elements);
  }, [elements, onDesignChange]);

  const handleCanvasClick = (e) => {
    if (selectedTool === 'select') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = {
      id: Date.now(),
      type: selectedTool,
      x,
      y,
      width: 100,
      height: selectedTool === 'circle' ? 100 : selectedTool === 'text' ? 'auto' : 100,
      color: '#3B82F6',
      content: selectedTool === 'text' ? 'Sample Text' : '',
      selected: true
    };

    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement);
  };

  const handleElementClick = (e, element) => {
    e.stopPropagation();
    setSelectedElement(element);
    setElements(prev => prev.map(el => ({ ...el, selected: el.id === element.id })));
  };

  const updateElement = (id, updates) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const deleteElement = (id) => {
    setElements(prev => prev.filter(el => el.id !== id));
    setSelectedElement(null);
  };

  const renderElement = (element) => {
    const style = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      backgroundColor: element.type === 'rectangle' ? element.color : 'transparent',
      color: element.type === 'text' ? element.color : 'transparent',
      border: element.selected ? '2px solid #3B82F6' : element.type === 'circle' ? `2px solid ${element.color}` : 'none',
      borderRadius: element.type === 'circle' ? '50%' : '0',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      fontWeight: '500'
    };

    if (element.type === 'image') {
      return (
        <div
          key={element.id}
          style={style}
          onClick={(e) => handleElementClick(e, element)}
          className="bg-gray-200 border-2 border-dashed border-gray-400"
        >
          <Image className="w-8 h-8 text-gray-400" />
        </div>
      );
    }

    return (
      <div
        key={element.id}
        style={style}
        onClick={(e) => handleElementClick(e, element)}
      >
        {element.type === 'text' && element.content}
        {element.type === 'circle' && <div className="w-full h-full rounded-full" style={{ backgroundColor: element.color }}></div>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            {tools.map(tool => {
              const IconComponent = typeof tool.icon === 'string' ? null : tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`p-2 rounded transition-colors ${
                    selectedTool === tool.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                  title={tool.name}
                >
                  {IconComponent ? <IconComponent className="w-5 h-5" /> : tool.icon}
                </button>
              );
            })}
            
            <div className="w-px h-6 bg-gray-300 mx-2"></div>
            
            {/* Device Views */}
            {devices.map(device => {
              const IconComponent = device.icon;
              return (
                <button
                  key={device.id}
                  onClick={() => setDeviceView(device.id)}
                  className={`p-2 rounded transition-colors ${
                    deviceView === device.id 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white hover:bg-gray-100 text-gray-700'
                  }`}
                  title={device.name}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              );
            })}
          </div>

          {/* Color Palette */}
          <div className="flex items-center space-x-1">
            <Palette className="w-4 h-4 text-gray-600 mr-2" />
            {colors.map(color => (
              <button
                key={color}
                onClick={() => selectedElement && updateElement(selectedElement.id, { color })}
                className="w-6 h-6 rounded border-2 border-white shadow-sm hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex justify-center p-8 bg-gray-100 min-h-96">
        <div 
          className="bg-white shadow-lg overflow-hidden transition-all duration-300"
          style={{ 
            width: devices.find(d => d.id === deviceView)?.width,
            minHeight: '500px',
            maxWidth: '100%'
          }}
        >
          <div
            ref={canvasRef}
            className="relative w-full h-full min-h-[500px] cursor-crosshair"
            onClick={handleCanvasClick}
            style={{ position: 'relative' }}
          >
            {elements.map(renderElement)}
            
            {/* Grid overlay */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedElement && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-800">
              Element Properties ({selectedElement.type})
            </h4>
            <button
              onClick={() => deleteElement(selectedElement.id)}
              className="text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {selectedElement.type === 'text' && (
              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Content</label>
                <input
                  type="text"
                  value={selectedElement.content}
                  onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Width</label>
              <input
                type="number"
                value={selectedElement.width}
                onChange={(e) => updateElement(selectedElement.id, { width: parseInt(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Height</label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) => updateElement(selectedElement.id, { height: parseInt(e.target.value) })}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignCanvas;
