import { useRef, useEffect, useState } from "react";

// TODO(2026-02-18 22:12): make a function that does invLerp and lerp at once
function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function invLerp(start: number, end: number, value: number) {
  console.log(`invLerp: ${(value - start) / (end - start)}`);
  return (value - start) / (end - start);
}

// They're glogal, so we don't reload them on each resize
const map = new Image();
let loadedMap: HTMLImageElement | undefined;

const carro = new Image();
let loadedCarro: HTMLImageElement | undefined;

export default function Map() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let [canvasHeight, _setCanvasHeight] = useState<number>(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width: number;
    let height: number;

    let lastClick: { x: number; y: number } | null = null;

    // TODO(2026-02-18 22:17): load different images for different locations based on progress
    if (!map.src) {
      map.src = "/map-locations/0.svg";
      map.onload = () => {
        loadedMap = map;
        draw();
      };
    }

    // TODO(2026-02-18 22:34:53): make Carro animated
    // deps: (2026-02-18 22:17)
    if (!carro.src) {
      carro.src = "/carros/on-map/0/normal.svg";
      carro.onload = () => {
        loadedCarro = carro;
        draw();
      };
    }

    function resizeCanvas() {
      if (!canvas) return;
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    }

    function draw() {
      if (!canvas) return;
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (loadedMap && loadedCarro) {
        let mapWidth: number, mapHeight: number;

        if (width < loadedMap.width) {
          mapWidth = width;
          mapHeight = loadedMap.height / (loadedMap.width / width);
        } else {
          mapWidth = loadedMap.width / (loadedMap.height / height);
          mapHeight = height;
        }

        const mapX = (width - mapWidth) / 2;
        const carroScale = 6;

        ctx.drawImage(loadedMap, mapX, 0, mapWidth, mapHeight);

        // TODO(2026-02-18 22:15): download milestones from a json
        // deps: (2026-02-18 22:17)
        const milestones: { [key: number]: {x: number, y: number} } = {
          0: { x: 51.64372469635627, y: 74.97975708502024 },
          10: { x: 66.20242914979757, y: 58.13765182186235 },
          20: {x: 37.78947368421052, y: 42.91497975708502},
          30: {x: 75.12550607287449, y: 35.62753036437247},
          40: {x: 56.10526315789473, y: 28.825910931174086},
          50: {x: 36.61538461538461, y: 14.251012145748987},
        };

        // TODO(2026-02-18 22:23): get rid of isRecording in `Map.tsx`
        // make it a separate tool
        const isRecording = 0;

        if (!isRecording) {
          // TODO(2026-02-18 22:21): use actual user's progress in `Map.tsx`
          const progress = 0;

          let carroPosition: {x: number, y: number} | undefined;
          if (progress in milestones) {
            carroPosition = milestones[progress];
          } else {
            let previous = Object.entries(milestones)
              .filter(m => Number(m[0]) < progress)
              .reduce((accumulator, current) => {
                return current[0] > accumulator[0] ? current : accumulator;
              });

            let next = Object.entries(milestones)
              .filter(m => Number(m[0]) > progress)
              .reduce((accumulator, current) => {
                return current[0] < accumulator[0] ? current : accumulator;
              });

            // TODO(2026-02-18 22:39:47): store the previous progress in a global variable and animate carro movement
            carroPosition = {
              x: lerp(previous[1].x, next[1].x, invLerp(Number(previous[0]), Number(next[0]), progress)),
              y: lerp(previous[1].y, next[1].y, invLerp(Number(previous[0]), Number(next[0]), progress)),
            };
          }

          ctx.drawImage(
            loadedCarro,
            carroPosition.x / 100 * mapWidth + mapX - loadedCarro.width / 2,
            carroPosition.y / 100 * mapHeight - loadedCarro.height / 2,
            mapWidth / carroScale,
            mapHeight / carroScale
          );
        }

        if (lastClick && isRecording) {
          ctx.drawImage(
            loadedCarro,
            lastClick.x - loadedCarro.width / 2,
            lastClick.y - loadedCarro.height / 2,
            mapWidth / carroScale,
            mapHeight / carroScale
          );

          const clickOnMapX = (lastClick.x - mapX) / mapWidth * 100;
          const clickOnMapY = lastClick.y / mapHeight * 100;

          console.log(`Carro's position: {x: ${clickOnMapX}, y: ${clickOnMapY}}`);
        }
      }
    }

    function handleClick(e: MouseEvent) {
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Convert mouse position to canvas coordinates
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      lastClick = { x, y };
      draw();
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    canvas.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("click", handleClick);
    };
  }, [canvasHeight]);

  return (
    <div className="w-full h-screen">
      <canvas
        ref={canvasRef}
        className="w-full block"
        // TODO(2026-02-17 19:26:22): get rid of canvasHeight hack and use aspectRatio hack instead :)
        style={{height: `${canvasHeight}%`}}
      />
    </div>
  );
}

