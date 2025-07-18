import React from "react";

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void }[];
  onBack?: () => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onBack }) => {
  return (
    <nav
      className="flex items-center text-sm text-gray-600 mb-6"
      aria-label="Breadcrumb"
    >
      {onBack && (
        <button
          className="mr-3 px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700 font-medium"
          onClick={onBack}
        >
          &larr; Back
        </button>
      )}
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center">
          {item.onClick ? (
            <button className="hover:underline" onClick={item.onClick}>
              {item.label}
            </button>
          ) : (
            <span className="font-semibold text-gray-800">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-2">/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
