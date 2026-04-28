import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  reviewCount?: number;
}

export default function StarRating({ rating, size = 'sm', showValue = true, reviewCount }: StarRatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-4 h-4', lg: 'w-5 h-5' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={`${sizes[size]} ${i <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
      {showValue && (
        <span className={`${textSizes[size]} font-semibold text-slate-700 ml-0.5`}>{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className={`${textSizes[size]} text-slate-400`}>({reviewCount.toLocaleString()})</span>
      )}
    </div>
  );
}
