import React, { useState, useRef, useEffect } from 'react';
import VisionCard from './VisionCard';
import AddVisionModal from './AddVisionModal';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './VisionBoard.css';

const VisionBoard = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: 'Look after my body',
      type: 'image',
      image: '/smoothie.jpeg',
      backgroundColor: '#f8f9fa'
    },
    {
      id: 2,
      title: 'Cherish friends & family',
      type: 'image',
      image: '/friends.jpeg',
      backgroundColor: '#f8f9fa'
    },
    {
      id: 3,
      title: 'Do the things I love',
      type: 'text',
      backgroundColor: '#4a6741'
    },
    {
      id: 4,
      title: 'Build a stronger mind',
      type: 'image',
      image: '/meditation.jpeg',
      backgroundColor: '#f8f9fa'
    },
    {
      id: 5,
      title: 'Never compare yourself to anyone else!',
      type: 'quote',
      backgroundColor: '#ffffff'
    },
    {
      id: 6,
      title: 'Wild & Free',
      type: 'text',
      backgroundColor: '#4a6741'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [layout, setLayout] = useState('wall'); // 'wall', 'grid', 'masonry', 'carousel'
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [boardTitle, setBoardTitle] = useState('My Vision Board');
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  useEffect(() => {
    if (layout === 'wall') {
      randomizePositions();
    }
  }, [layout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas.parentElement;
    canvas.width = container.offsetWidth * 2;
    canvas.height = container.offsetHeight * 2;
    canvas.style.width = `${container.offsetWidth}px`;
    canvas.style.height = `${container.offsetHeight}px`;

    const context = canvas.getContext('2d');
    context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = drawingColor;
    context.lineWidth = lineWidth;
    contextRef.current = context;
  }, []);

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = drawingColor;
      contextRef.current.lineWidth = lineWidth;
    }
  }, [drawingColor, lineWidth]);

  const randomizePositions = () => {
    const updatedCards = cards.map(card => ({
      ...card,
      rotation: Math.random() * 10 - 5, // Random rotation between -5 and 5 degrees
      positionX: Math.random() * 50 - 25, // Random X offset
      positionY: Math.random() * 50 - 25  // Random Y offset
    }));
    setCards(updatedCards);
  };

  const startDrawing = ({ nativeEvent }) => {
    if (!drawingMode) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    
    // Save the canvas state before starting new line
    const canvas = canvasRef.current;
    const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory(prev => [...prev, imageData]);
  };

  const finishDrawing = () => {
    if (!drawingMode) return;
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawingMode || !isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const undoLastDraw = () => {
    if (drawingHistory.length === 0) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Remove the last state from history
    const newHistory = [...drawingHistory];
    const lastState = newHistory.pop();
    setDrawingHistory(newHistory);
    
    // Clear canvas and restore the previous state
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (newHistory.length > 0) {
      context.putImageData(newHistory[newHistory.length - 1], 0, 0);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    setDrawingHistory([]);
  };

  const handleAddVision = (newVision) => {
    setCards([...cards, { ...newVision, id: cards.length + 1 }]);
    setIsModalOpen(false);
  };

  const handleRemoveVision = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const downloadAsPDF = async () => {
    const board = document.querySelector('.vision-board');
    const canvas = await html2canvas(board);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('l', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('my-vision-board.pdf');
  };

  return (
    <div className="vision-board-container">
      <div className="board-header">
        {isEditingTitle ? (
          <input
            type="text"
            value={boardTitle}
            onChange={(e) => setBoardTitle(e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                setIsEditingTitle(false);
              }
            }}
            autoFocus
            className="board-title-input"
          />
        ) : (
          <h1 
            className="board-title"
            onClick={() => setIsEditingTitle(true)}
          >
            {boardTitle}
            <i className="fa-solid fa-pencil edit-title-icon"></i>
          </h1>
        )}
      </div>

      <canvas
        ref={canvasRef}
        className={`drawing-canvas ${drawingMode ? 'active' : ''}`}
        onMouseDown={startDrawing}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onMouseMove={draw}
      />

      <div className="vision-board-controls">
        <div className="layout-switcher">
          <button 
            className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => setLayout('grid')}
          >
            <i className="fa-solid fa-grid-2"></i>
            Grid
          </button>
          <button 
            className={`layout-button ${layout === 'masonry' ? 'active' : ''}`}
            onClick={() => setLayout('masonry')}
          >
            <i className="fa-solid fa-table-cells-large"></i>
            Masonry
          </button>
          <button 
            className={`layout-button ${layout === 'carousel' ? 'active' : ''}`}
            onClick={() => setLayout('carousel')}
          >
            <i className="fa-solid fa-film"></i>
            Carousel
          </button>
          <button 
            className={`layout-button ${layout === 'wall' ? 'active' : ''}`}
            onClick={() => setLayout('wall')}
          >
            <i className="fa-solid fa-thumbtack"></i>
            Wall
          </button>
        </div>
        
        <div className="drawing-controls">
          <button
            className={`drawing-button ${drawingMode ? 'active' : ''}`}
            onClick={() => setDrawingMode(!drawingMode)}
            title="Toggle drawing mode"
          >
            <i className="fa-solid fa-pencil"></i>
          </button>
          <input
            type="color"
            value={drawingColor}
            onChange={(e) => setDrawingColor(e.target.value)}
            disabled={!drawingMode}
            title="Select drawing color"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            disabled={!drawingMode}
            title="Adjust line width"
            className="line-width-slider"
          />
          <button
            className="undo-button"
            onClick={undoLastDraw}
            disabled={!drawingMode || drawingHistory.length === 0}
            title="Undo last draw"
          >
            <i className="fa-solid fa-undo"></i>
          </button>
          <button
            className="clear-button"
            onClick={clearCanvas}
            disabled={!drawingMode}
            title="Clear all drawings"
          >
            <i className="fa-solid fa-eraser"></i>
          </button>
        </div>
      </div>

      <div className={`vision-board ${layout}`}>
        {cards.map((card) => (
          <div 
            key={card.id} 
            className="vision-card-wrapper"
            style={layout === 'wall' ? {
              transform: `rotate(${card.rotation}deg) translate(${card.positionX}px, ${card.positionY}px)`,
            } : {}}
          >
            <VisionCard {...card} onRemove={() => handleRemoveVision(card.id)} />
          </div>
        ))}
      </div>
      
      <button 
        className="add-vision-button"
        onClick={() => setIsModalOpen(true)}
        title="Add new vision"
      >
        <i className="fa-solid fa-plus"></i>
      </button>
      
      <button 
        className="download-button"
        onClick={downloadAsPDF}
      >
        Download Vision Board
      </button>

      {isModalOpen && (
        <AddVisionModal 
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddVision}
        />
      )}
    </div>
  );
};

export default VisionBoard; 