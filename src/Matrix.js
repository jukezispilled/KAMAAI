import React, { useState, useEffect, useRef, useCallback } from 'react';

const MatrixBackground = React.memo(() => {
    const canvasRef = useRef(null);
    const animationFrameId = useRef(null);
    const dropsRef = useRef([]);
    const matrixRef = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const fontSize = 14;

    const draw = useCallback((ctx, canvas) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00AEF3';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < dropsRef.current.length; i++) {
        const text = matrixRef[Math.floor(Math.random() * matrixRef.length)];
        ctx.fillText(text, i * fontSize, dropsRef.current[i] * fontSize);

        if (dropsRef.current[i] * fontSize > canvas.height && Math.random() > 0.975) {
          dropsRef.current[i] = 0;
        }

        dropsRef.current[i]++;
      }

      animationFrameId.current = requestAnimationFrame(() => draw(ctx, canvas));
    }, []);

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      const initializeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        dropsRef.current = Array(Math.floor(canvas.width / fontSize)).fill(1);
      };

      initializeCanvas();
      draw(ctx, canvas);

      window.addEventListener('resize', initializeCanvas);

      return () => {
        cancelAnimationFrame(animationFrameId.current);
        window.removeEventListener('resize', initializeCanvas);
      };
    }, [draw]);

    return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" style={{ zIndex: -30 }} />;
});

export default MatrixBackground;