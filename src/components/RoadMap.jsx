import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

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
  subtopics,
  selectedCourse,
  change,
  setIsHidden,
}) => {
  const [hovered, setHovered] = useState(false);
  const [completedSubtopics, setCompletedSubtopics] = useState(new Set());

  const updateCompletedSubtopics = () => {
    const completedFromStorage = new Set(
      JSON.parse(localStorage.getItem('completed') || '{}')?.[
        selectedCourse.value
      ]?.[text] || []
    );
    setCompletedSubtopics(completedFromStorage);
  };

  useEffect(() => {
    updateCompletedSubtopics();
  }, [selectedCourse.value, text, change]);

  const allCompleted = Object.keys(subtopics).every((subtopic) =>
    completedSubtopics.has(subtopic)
  );

  return (
    <motion.button
      className={`w-32 py-1.5 my-2 mx-2 rounded-xl body-bold shadow-md transition font-semibold items-center justify-center text-xl
        ${
          allCompleted
            ? 'text-white bg-green-500'
            : isDarkTheme
            ? 'bg-light-background text-dark-background'
            : 'bg-third-background text-light-background'
        }
        
      `}
      animate={{
        x: hovered || !isHoveringRoadmap ? 0 : randomFloat(-7, 7),
        y: hovered || !isHoveringRoadmap ? 0 : randomFloat(-7, 7),
      }}
      transition={{
        x: { repeat: Infinity, duration: randomFloat(0.5, 1), ease: 'linear' },
        y: { repeat: Infinity, duration: randomFloat(0.5, 1), ease: 'linear' },
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{
        scale: 1.15,
        transition: {
          duration: 0.05,
          ease: 'linear',
        },
      }}
      onClick={() => (onClick(text), setShowWelcome(false), setIsHidden(false))}
    >
      {text}

      <div className="flex flex-wrap px-5 mt-0.5 items-center justify-center">
        {Object.keys(subtopics).length > 0 &&
          Object.keys(subtopics).map((subtopic) => (
            <div
              key={subtopic}
              className={`w-3 h-3 rounded-full mx-0.5 my-0.5 ${
                completedSubtopics.has(subtopic)
                  ? 'bg-green-700'
                  : 'bg-gray-400'
              }`}
            />
          ))}
      </div>
    </motion.button>
  );
};

const RoadMap = ({
  isDarkTheme,
  setSelectedTopic,
  returnToCenter,
  setShowWelcome,
  isDraggable,
  setIsHidden,
  selectedCourse,
  change,
}) => {
  const [scale, setScale] = useState(0.85);
  const [translate, setTranslate] = useState({
    x: 0,
    y: window.innerHeight / 5,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [topics, setTopics] = useState([]);
  const panStart = useRef({ x: 0, y: 0 });
  const [isHoveringRoadmap, setIsHoveringRoadmap] = useState(false);
  const lastTouchY = useRef(0);
  const lastTouchX = useRef(0);
  const [levels, setLevels] = useState({});
  const updateScale = () => {
    const roadMapWidth = (window.innerWidth * 2) / 3;
    const initialScale = Math.min(
      roadMapWidth / 1050,
      window.innerHeight / 1200
    );
    setScale(Math.max(0.2, Math.min(1.1, initialScale)));
  };
  useEffect(() => {
    if (returnToCenter) {
      updateScale();
      setTranslate({
        x: 0,
        y: window.innerHeight / 5,
      });
    }
  }, [returnToCenter]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        const response = await fetch('/topics.json');
        const data = await response.json();
        if (selectedCourse.value) {
          const levelsData = getLevels(data[selectedCourse.value]);
          setLevels(levelsData);
        }
      } catch (error) {
        console.error('Error fetching content data:', error);
      }
      try {
        const response = await fetch('/contents.json');
        const data = await response.json();
        if (selectedCourse.value) {
          setTopics(data[selectedCourse.value]);
        }
      } catch (error) {
        console.error('Error fetching topic data:', error);
      }
    };

    fetchContentData();
  }, [selectedCourse]);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomAmount = e.deltaY * -0.001;
    setScale((prevScale) => Math.max(0.2, Math.min(2, prevScale + zoomAmount)));
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
      className="w-full h-full items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsHoveringRoadmap(true)}
      onMouseLeave={() => {
        setIsPanning(false);
        setIsHoveringRoadmap(false);
      }}
    >
      <div
        className={`w-full h-full ${isDraggable ? 'cursor-grab' : ''}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
          transition: isPanning ? 'none' : 'transform 0.2s ease',
        }}
      >
        <div className="grid gap-4">
          {Object.keys(levels).map((level) => (
            <div
              key={level}
              className="flex justify-center my-1 space-x-5"
              style={{
                textShadow: '10px 10px 10px rgba(0, 0, 0, 1)',
              }}
            >
              {levels[level].map((node) => (
                <RoadMapBubble
                  selectedCourse={selectedCourse}
                  change={change}
                  isDarkTheme={isDarkTheme}
                  setIsHidden={setIsHidden}
                  key={node}
                  text={node}
                  isHoveringRoadmap={isHoveringRoadmap}
                  onClick={setSelectedTopic}
                  setShowWelcome={setShowWelcome}
                  subtopics={topics[node] || {}}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

RoadMapBubble.propTypes = {
  text: PropTypes.string.isRequired,
  isHoveringRoadmap: PropTypes.bool.isRequired,
  isDarkTheme: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  setShowWelcome: PropTypes.func.isRequired,
  subtopics: PropTypes.object.isRequired,
  selectedCourse: PropTypes.object.isRequired,
  change: PropTypes.any.isRequired,
  setIsHidden: PropTypes.func.isRequired,
};
RoadMap.propTypes = {
  isDarkTheme: PropTypes.bool.isRequired,
  setSelectedTopic: PropTypes.func.isRequired,
  returnToCenter: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.bool.isRequired,
  ]).isRequired,
  setShowWelcome: PropTypes.func.isRequired,
  isDraggable: PropTypes.bool.isRequired,
  setIsHidden: PropTypes.func.isRequired,
  selectedCourse: PropTypes.object.isRequired,
  change: PropTypes.any.isRequired,
};
export default RoadMap;
