// "use client";

// import { useRef, useEffect } from "react";

// const WelcomeBackground = () => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     // Set canvas size to match window
//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     // City data points - representing districts/areas
//     const districts = [];
//     const districtCount = 12; // Major districts in Almaty

//     // Ensure districts are more evenly distributed across the screen
//     const gridCols = 4;
//     const gridRows = 3;
//     const cellWidth = canvas.width / gridCols;
//     const cellHeight = canvas.height / gridRows;

//     for (let i = 0; i < districtCount; i++) {
//       // Place districts in a grid pattern for better coverage
//       const gridCol = i % gridCols;
//       const gridRow = Math.floor(i / gridCols) % gridRows;

//       // Add some randomness within the cell
//       const centerX = (gridCol + 0.3 + Math.random() * 0.4) * cellWidth;
//       const centerY = (gridRow + 0.3 + Math.random() * 0.4) * cellHeight;
//       const pointCount = 5 + Math.floor(Math.random() * 10); // More points for visibility

//       districts.push({
//         x: centerX,
//         y: centerY,
//         radius: 60 + Math.random() * 100, // Larger radius
//         points: Array(pointCount)
//           .fill(0)
//           .map(() => ({
//             // More concentrated distribution around center
//             x: centerX + (Math.random() - 0.5) * 80,
//             y: centerY + (Math.random() - 0.5) * 80,
//             size: 3 + Math.random() * 6, // Larger points
//             speed: 0.3 + Math.random() * 0.7, // Faster movement
//             angle: Math.random() * Math.PI * 2,
//             pulseSpeed: 0.02 + Math.random() * 0.03, // Faster pulse
//           })),
//       });
//     }

//     // Data connection lines
//     const connections = [];

//     // Connect districts more comprehensively
//     for (let i = 0; i < districts.length; i++) {
//       const sourceDistrict = districts[i];

//       // Each district connects to 2-4 others - more connections
//       const connectionCount = 2 + Math.floor(Math.random() * 2);
//       for (let c = 0; c < connectionCount; c++) {
//         // Ensure good distribution of connections
//         const targetIndex =
//           (i + 1 + c + Math.floor(Math.random() * (districts.length - 3))) %
//           districts.length;
//         const targetDistrict = districts[targetIndex];

//         connections.push({
//           source: sourceDistrict,
//           target: targetDistrict,
//           // More data points on each connection
//           dataPoints: Array(3 + Math.floor(Math.random() * 5))
//             .fill(0)
//             .map(() => ({
//               progress: Math.random(),
//               speed: 0.005 + Math.random() * 0.008, // Faster data flow
//               size: 2 + Math.random() * 3, // Larger data points
//               color: Math.random() > 0.5 ? "#4285F4" : "#34A853", // Keep Google-esque colors
//             })),
//         });
//       }
//     }

//     // Map grid (city blocks)
//     const createGrid = () => {
//       // Offset for organic feel
//       const offset = canvas.width * 0.02;
//       const majorGridSize = canvas.width * 0.15; // Major roads
//       const minorGridSize = majorGridSize / 3; // Minor streets

//       // Store lines
//       const gridLines = [];

//       // Create major vertical lines
//       for (let x = 0; x < canvas.width; x += majorGridSize) {
//         const jitter = (Math.random() - 0.5) * offset;
//         gridLines.push({
//           x1: x + jitter,
//           y1: 0,
//           x2: x + jitter,
//           y2: canvas.height,
//           major: true,
//         });

//         // Add minor vertical lines between major ones
//         if (x < canvas.width - majorGridSize) {
//           for (let mx = 1; mx < 3; mx++) {
//             const minorX = x + minorGridSize * mx;
//             const minorJitter = (Math.random() - 0.5) * offset * 0.5;
//             gridLines.push({
//               x1: minorX + minorJitter,
//               y1: 0,
//               x2: minorX + minorJitter,
//               y2: canvas.height,
//               major: false,
//             });
//           }
//         }
//       }

//       // Create major horizontal lines
//       for (let y = 0; y < canvas.height; y += majorGridSize) {
//         const jitter = (Math.random() - 0.5) * offset;
//         gridLines.push({
//           x1: 0,
//           y1: y + jitter,
//           x2: canvas.width,
//           y2: y + jitter,
//           major: true,
//         });

//         // Add minor horizontal lines between major ones
//         if (y < canvas.height - majorGridSize) {
//           for (let my = 1; my < 3; my++) {
//             const minorY = y + minorGridSize * my;
//             const minorJitter = (Math.random() - 0.5) * offset * 0.5;
//             gridLines.push({
//               x1: 0,
//               y1: minorY + minorJitter,
//               x2: canvas.width,
//               y2: minorY + minorJitter,
//               major: false,
//             });
//           }
//         }
//       }

//       return gridLines;
//     };

//     const gridLines = createGrid();

//     // Animation loop
//     let animationId: number;
//     const animate = () => {
//       animationId = requestAnimationFrame(animate);

//       // Use a more opaque background for stronger contrast
//       ctx.fillStyle = "rgba(255, 255, 255, 0.12)"; // Less transparent - slower trail effect
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Draw grid with more contrast
//       gridLines.forEach((line) => {
//         ctx.beginPath();
//         ctx.moveTo(line.x1, line.y1);
//         ctx.lineTo(line.x2, line.y2);
//         ctx.strokeStyle = line.major
//           ? "rgba(180, 180, 220, 0.25)" // More visible major lines
//           : "rgba(180, 180, 220, 0.1)"; // More visible minor lines
//         ctx.lineWidth = line.major ? 1.5 : 0.7; // Thicker lines
//         ctx.stroke();
//       });

//       // Draw district point clusters with more vibrant colors
//       districts.forEach((district) => {
//         district.points.forEach((point) => {
//           // Move points in a circular pattern within their district
//           point.angle += point.speed * 0.01;
//           const radius = district.radius * 0.4; // Larger movement radius
//           point.x = district.x + Math.cos(point.angle) * radius;
//           point.y = district.y + Math.sin(point.angle) * radius;

//           // Pulse size
//           const pulse = Math.sin(Date.now() * point.pulseSpeed) * 0.5 + 0.5;
//           const currentSize = point.size * (0.7 + pulse * 0.5); // More pronounced pulse

//           // Draw point with more vibrant color
//           ctx.beginPath();
//           ctx.arc(point.x, point.y, currentSize, 0, Math.PI * 2);
//           ctx.fillStyle = "rgba(66, 133, 244, 0.85)"; // More opaque blue
//           ctx.fill();

//           // Add stronger glow
//           const gradient = ctx.createRadialGradient(
//             point.x,
//             point.y,
//             0,
//             point.x,
//             point.y,
//             currentSize * 4 // Larger glow
//           );
//           gradient.addColorStop(0, "rgba(66, 133, 244, 0.5)"); // More visible gradient
//           gradient.addColorStop(1, "rgba(66, 133, 244, 0)");

//           ctx.beginPath();
//           ctx.arc(point.x, point.y, currentSize * 4, 0, Math.PI * 2);
//           ctx.fillStyle = gradient;
//           ctx.fill();
//         });
//       });

//       // Draw connections with more visibility
//       connections.forEach((connection) => {
//         const sourceX = connection.source.x;
//         const sourceY = connection.source.y;
//         const targetX = connection.target.x;
//         const targetY = connection.target.y;

//         // Draw connection line with more opacity
//         ctx.beginPath();
//         ctx.moveTo(sourceX, sourceY);
//         ctx.lineTo(targetX, targetY);
//         ctx.strokeStyle = "rgba(220, 220, 235, 0.25)"; // More visible connection
//         ctx.lineWidth = 1.2; // Thicker line
//         ctx.stroke();

//         // Calculate line length for data point positioning
//         const dx = targetX - sourceX;
//         const dy = targetY - sourceY;

//         // Update and draw data points with stronger colors
//         connection.dataPoints.forEach((point) => {
//           point.progress += point.speed;
//           if (point.progress > 1) point.progress = 0;

//           // Position on line
//           const x = sourceX + dx * point.progress;
//           const y = sourceY + dy * point.progress;

//           // Draw data point with glow
//           ctx.beginPath();
//           ctx.arc(x, y, point.size, 0, Math.PI * 2);
//           ctx.fillStyle = point.color;
//           ctx.fill();

//           // Add glow to data points
//           const glow = ctx.createRadialGradient(x, y, 0, x, y, point.size * 3);
//           glow.addColorStop(
//             0,
//             point.color.replace(")", ", 0.4)").replace("rgb", "rgba")
//           );
//           glow.addColorStop(
//             1,
//             point.color.replace(")", ", 0)").replace("rgb", "rgba")
//           );

//           ctx.beginPath();
//           ctx.arc(x, y, point.size * 3, 0, Math.PI * 2);
//           ctx.fillStyle = glow;
//           ctx.fill();
//         });
//       });
//     };

//     // Start animation
//     animate();

//     // Cleanup function
//     return () => {
//       cancelAnimationFrame(animationId);
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       className="fixed top-0 left-0 w-full h-full -z-10"
//       style={{ opacity: 1 }} // Increased from 0.7 to 1 for more visibility
//     />
//   );
// };

// export default WelcomeBackground;
