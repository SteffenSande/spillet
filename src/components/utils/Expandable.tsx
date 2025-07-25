import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface IProps {
  title: string;
  children: React.ReactNode;
}

export const ExpandableCard: React.FC<IProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure height only when expanding or content changes
  useLayoutEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen, children]);

  return (
    <div className="w-full">
      <div
        className="p-4 bg-blue-100 rounded-lg shadow-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <h2 className="font-bold">{title}</h2>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaChevronDown className="w-5 h-5 ml-2" />
          </motion.div>
        </div>
      </div>

      <motion.div
        animate={{ height }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-blue-50 rounded-b"
      >
        <div ref={contentRef} className="p-4">
          {children}
        </div>
      </motion.div>
    </div>
  );
};
