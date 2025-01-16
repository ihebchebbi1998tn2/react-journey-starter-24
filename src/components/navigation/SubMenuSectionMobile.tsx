import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubMenuSectionMobileProps {
  title: string;
  items: Array<{
    href: string;
    title: string;
    description: string;
  }>;
  onClick?: () => void;
}

const SubMenuSectionMobile = ({ title, items, onClick }: SubMenuSectionMobileProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleItemClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="py-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
      >
        <span className="text-lg">{title}</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-6 pr-4 py-2 space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="block p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                  onClick={handleItemClick}
                >
                  <div className="text-white/90 text-sm">{item.title}</div>
                  <div className="text-white/60 text-xs mt-1">{item.description}</div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubMenuSectionMobile;