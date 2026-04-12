import { Star } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export const Rating = ({value=0, onRatingChange, disabled = false, showValue = true}) => {
    const [hover, setHover] = useState(0)
    const [rating, setRating] = useState(value)

    useEffect(() => {
        setRating(value)
    }, [value])

    const handleClick = (star) => {
        if (disabled) return
        setRating(star)
        onRatingChange?.(star)
    }
  return (
    <div>
    <div className=''>
        {[1,2,3,4,5].map((star) => {
            const filled = hover ? star <= hover : star <= rating
            return (<Star key={star} size={20} fill={filled ? "currentColor" : "none"}
                className={`
                    ${filled ? "text-warning" : "text-secondary"}
                    ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
                onMouseEnter={() => !disabled && setHover(star)}
                onMouseLeave={() => !disabled && setHover(0)}
                onClick={() => handleClick(star)}/>)
        })}
    </div>
    {/* <div className='mb-2'>
        {showValue && <span>{rating}/5</span>}
    </div> */}
    
    </div>
  )
}
