'use client';

function formatDisplay(str) {
  if (!str) return '';
  return String(str)
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export default function PantryItems({ items, onRemove }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-text">
        <p className="text-3xl mb-2">📦</p>
        <p className="font-medium">Your Store Room is empty</p>
        <p className="text-sm mt-2">Add what you have at home — we will match recipes to it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-dark-text mb-3">Stored ingredients ({items.length})</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="inline-flex items-center gap-2 bg-green-50 border-2 border-primary px-3 py-2 rounded-full hover:bg-green-100 transition-colors"
          >
            <span className="text-sm font-medium text-dark-text">
              {formatDisplay(item)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item)}
              className="text-primary hover:text-red-600 font-bold text-lg leading-none transition-colors"
              title="Remove item"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
