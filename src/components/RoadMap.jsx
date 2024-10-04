import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const randomFloat = (min, max) => Math.random() * (max - min) + min;

const getLevels = (data) => {
  const levels = {};
  const nodeLevels = {};

  const findLevel = (node, level) => {
    if (!nodeLevels[node]) {
      nodeLevels[node] = level;
      if (!levels[level]) levels[level] = [];
      levels[level].push(node);
    }

    if (data[node]) {
      data[node].forEach((child) => findLevel(child, level + 1));
    }
  };

  Object.keys(data).forEach((node) => {
    if (Object.values(data).every((children) => !children.includes(node))) {
      findLevel(node, 0);
    }
  });
  return levels;
};

const RoadMapBubble = ({
  text,
  isHoveringRoadmap,
  isDarkTheme,
  onClick,
  setShowWelcome,
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      className={`w-32 py-1.5 my-2 mx-2 rounded-xl body-bold shadow-md transition font-semibold text-xl
        ${
          isDarkTheme
            ? "bg-light-background text-dark-background"
            : "bg-dark-background text-light-background"
        } 
        ${
          hovered
            ? isDarkTheme
              ? "bg-light-background"
              : "bg-dark-background"
            : ""
        }`}
      animate={{
        x: hovered || !isHoveringRoadmap ? 0 : randomFloat(-7, 7),
        y: hovered || !isHoveringRoadmap ? 0 : randomFloat(-7, 7),
      }}
      transition={{
        x: { repeat: Infinity, duration: randomFloat(0.5, 1), ease: "linear" },
        y: { repeat: Infinity, duration: randomFloat(0.5, 1), ease: "linear" },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.15,
        transition: {
          duration: 0.05,
          ease: "linear",
        },
      }}
      onClick={() => (onClick(text), setShowWelcome(false))}
    >
      {text}
    </motion.button>
  );
};

const RoadMap = ({
  isDarkTheme,
  setSelectedTopic,
  setShowWelcome,
  isDraggable,
  selectedCourse,
}) => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({
    x: 0,
    y: window.innerHeight / 5,
  });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const [isHoveringRoadmap, setIsHoveringRoadmap] = useState(false);
  const lastTouchY = useRef(0);
  const lastTouchX = useRef(0);
  const [levels, setLevels] = useState({});
  const updateScale = () => {
    const roadMapWidth = (window.innerWidth * 2) / 3;
    const initialScale = Math.min(roadMapWidth / 850, window.innerHeight / 620);
    setScale(Math.max(0.5, Math.min(1.2, initialScale)));
  };

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await fetch("/topics.json");
        const data = await response.json();
        if (selectedCourse.value) {
          const levelsData = getLevels(data[selectedCourse.value]);
          setLevels(levelsData);
        }
      } catch (error) {
        console.error("Error fetching content data:", error);
      }
    };

    fetchContentData();
  }, [selectedCourse]);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomAmount = e.deltaY * -0.001;
    setScale((prevScale) => Math.max(0.5, Math.min(2, prevScale + zoomAmount)));
  };

  const handleTouchStart = (e) => {
    setIsPanning(true);
    lastTouchX.current = e.touches[0].clientX - translate.x;
    lastTouchY.current = e.touches[0].clientY - translate.y;
  };
  const handleTouchMove = (e) => {
    if (isPanning && isDraggable) {
      setTranslate({
        x: e.touches[0].clientX - lastTouchX.current,
        y: e.touches[0].clientY - lastTouchY.current,
      });
    }
  };

  const handleTouchEnd = () => setIsPanning(false);

  const handleMouseDown = (e) => {
    setIsPanning(true);
    panStart.current = {
      x: e.clientX - translate.x,
      y: e.clientY - translate.y,
    };
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleMouseMove = (e) => {
    if (isPanning && isDraggable) {
      setTranslate({
        x: e.clientX - panStart.current.x,
        y: e.clientY - panStart.current.y,
      });
    }
  };

  return (
    <div
      className="w-full h-full items-center justify-center"
      onMouseEnter={() => setIsHoveringRoadmap(true)}
      onMouseLeave={() => {
        setIsPanning(false);
        setIsHoveringRoadmap(false);
      }}
    >
      <div
        className={`w-full h-full ${isDraggable ? "cursor-grab" : ""}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: isPanning ? "none" : "transform 0.2s ease",
        }}
      >
        <div className="grid gap-4" style={{ overflow: "hidden" }}>
          {Object.keys(levels).map((level) => (
            <div key={level} className="flex justify-center">
              {levels[level].map((node) => (
                <RoadMapBubble
                  isDarkTheme={isDarkTheme}
                  key={node}
                  text={node}
                  isHoveringRoadmap={isHoveringRoadmap}
                  onClick={setSelectedTopic}
                  setShowWelcome={setShowWelcome}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoadMap;