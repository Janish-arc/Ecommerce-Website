import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'


const images = [
    "https://plus.unsplash.com/premium_photo-1683121716061-3faddf4dc504?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1201&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1682141878168-5dace8e1785d?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
]

export const ImageSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length-1 : (prev - 1)))
  }
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length )
  }
  return (
    <div className="position-relative" style={{ width: "100%", overflow: "hidden" }}>
      <div
        style={{ display: "flex", transform: `translateX(-${current * 100}%)`, transition: "transform 1s ease-in-out" }}>
        {images.map((image, index) => (
          <img key={index} src={image} alt={`slide-${index}`}
            style={{ width: "100%", height: "50vh", objectFit: "cover", flexShrink: 0 }}/>
        ))}
      </div>

      <button onClick={prevSlide} className='position-absolute bg-secondary text-white rounded-circle border border-none d-flex justify-content-center align-items-center' style={{width:'30px', height: '30px', fontSize: '33px', top:'50%', left:'10px'}}><ChevronLeft/></button>
      <button onClick={nextSlide} className='position-absolute bg-secondary text-white rounded-circle border border-none d-flex justify-content-center align-items-center ' style={{width:'30px', height: '30px', fontSize: '33px', top:'50%', right:'10px'}}><ChevronRight/></button>

      <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-1">
        {images.map((_, index) => (
            <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`rounded-circle border-0 ${
                current === index ? "bg-white active-dot" : "bg-white opacity-50"
                }`}
                style={{
                width: current === index ? "25px" : "0px",
                height: "4px",
                transition: "all 0.3s ease"
                }}
            ></button>
        ))}
    </div>
    </div>
  );
};