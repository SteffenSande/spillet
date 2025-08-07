import { useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";

interface IProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const ExpandableCard: React.FC<IProps> = ({ title, children, icon }) => {
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
    <motion.div
      className="w-full">
      <div
        className={`p-4 bg-teal-700 rounded-t-lg shadow-lg cursor-pointer ${!isOpen && "rounded-b-lg"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-4">
            {icon && icon}
            <h2 className="font-bold">
              {title}</h2>
          </span>
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
        initial={false}
        transition={{ duration: 0.3 }}
        className="overflow-hidden bg-teal-800 rounded-b"
      >
        <div ref={contentRef} className="p-4 flex flex-col gap-4 relative">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};
