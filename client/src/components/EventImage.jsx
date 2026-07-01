import { useState } from 'react';

const CATEGORY_GRADIENTS = {
  Music: 'from-purple-600 via-indigo-700 to-slate-900',
  Tech: 'from-blue-600 via-indigo-700 to-slate-900',
  Sports: 'from-emerald-600 via-teal-700 to-slate-900',
  Arts: 'from-rose-600 via-orange-600 to-slate-900',
  Food: 'from-amber-500 via-orange-600 to-red-800',
};

const EventImage = ({
  src,
  alt = 'Event',
  category = 'Event',
  className = 'h-full w-full',
  imageClassName = 'h-full w-full object-cover',
}) => {
  const [hasError, setHasError] = useState(false);
  const gradient =
    CATEGORY_GRADIENTS[category] || 'from-indigo-600 via-indigo-700 to-slate-900';

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}
        role="img"
        aria-label={alt}
      >
        <span className="px-4 text-center text-lg font-bold tracking-wide text-white uppercase sm:text-xl">
          {category}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={imageClassName}
      loading="lazy"
      decoding="async"
      onError={() => setHasError(true)}
    />
  );
};

export default EventImage;
