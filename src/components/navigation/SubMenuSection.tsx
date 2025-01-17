import React from 'react';
import { Link } from 'react-router-dom';

interface SubMenuSectionProps {
  title: string;
  items: Array<{
    href: string;
    title: string;
    description: string;
    image?: string;
  }>;
}

const ListItem = ({ href, title, image }: { href: string; title: string; image?: string }) => (
  <li className="text-left text-black group relative">
    <Link 
      to={href} 
      className="block text-sm py-1 hover:underline flex items-center gap-2"
    >
      {image && (
        <div className="w-8 h-8 overflow-hidden rounded opacity-0 group-hover:opacity-100 absolute left-[-2rem] transition-opacity duration-200">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}
      {title}
    </Link>
  </li>
);

const SubMenuSection = ({ title, items }: SubMenuSectionProps) => {
  return (
    <div className="mb-2">
      <h4 className="text-lg font-medium leading-none mb-2 text-[#700100] text-left">{title}</h4>
      <ul className="grid gap-0.5"> 
        {items.map((item, index) => (
          <ListItem 
            key={`${item.href}-${index}`}
            href={item.href}
            title={item.title}
            image={item.image}
          />
        ))}
      </ul>
    </div>
  );
};

export default SubMenuSection;