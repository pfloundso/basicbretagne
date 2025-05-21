    const playground = document.body;
    const sizes = [140,160,180];
    const movables = [];

    // Create and show attractor in center
    const attractor = {
      x: window.innerWidth / 2,
      y: window.innerHeight - 100,
      radius: 200,
      strength: 0.05
    };

    for (let i = 0; i < 20; i++) {
      let rnd = Math.floor(Math.random() * 3);
      const img = document.createElement('img');
      img.src = 'images/kreis'+(rnd+1)+'.png'; // Make sure this path is correct
      img.classList.add('movable');
      img.style.position = 'absolute';

      const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
      img.style.width = `${randomSize}px`;
      img.style.height = `${randomSize}px`;
      img.style.cursor = 'grab';

      const maxTop = window.innerHeight - randomSize;
      const maxLeft = window.innerWidth - randomSize;
      let top, left;
let isInsideAttractor = true;
let attempts = 0;
const maxAttempts = 100;



do {
  top = Math.random() * maxTop;
  left = Math.random() * maxLeft;

  const centerX = left + randomSize / 2;
  const centerY = top + randomSize / 2;

  const dx = centerX - attractor.x;
  const dy = centerY - attractor.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  isInsideAttractor = distance < attractor.radius + randomSize / 2;

  attempts++;
} while (isInsideAttractor && attempts < maxAttempts);

img.style.top = `${top}px`;
img.style.left = `${left}px`;


      const randomRotation = 45 * Math.floor(Math.random() * 360);
      img.dataset.rotation = randomRotation;

      img._base = { x: left, y: top }; // Store absolute base position
      img._pos = {
  currentX: 0,
  currentY: 0,
  targetX: 0,
  targetY: 0,
  settled: false,
  vx: (Math.random() - 0.5) * 0.2, // random initial drift velocity
  vy: (Math.random() - 0.5) * 0.2,
  driftTimer: 0
};

      img.style.transform = `translate(0px, 0px) rotate(${randomRotation}deg)`;

      movables.push(img);
      playground.appendChild(img);
    }

    

    const attractorEl = document.createElement('div');
    attractorEl.className = 'attractor';
    attractorEl.style.left = `${attractor.x}px`;
    attractorEl.style.top = `${attractor.y}px`;
    playground.appendChild(attractorEl);

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      movables.forEach((el) => {
        const pos = el._pos;
        const base = el._base;

        // Calculate current screen position of circle center
        const centerX = base.x + pos.currentX + el.offsetWidth / 2;
        const centerY = base.y + pos.currentY + el.offsetHeight / 2;

        const dx = attractor.x - centerX;
const dy = attractor.y - centerY;
const distance = Math.sqrt(dx * dx + dy * dy);

if (distance < attractor.radius) {
  const settleThreshold = 4;

  if (distance > settleThreshold) {
    pos.targetX += dx * attractor.strength;
    pos.targetY += dy * attractor.strength;
    pos.settled = false;
  } else {
    pos.settled = true;
  }
}

// If not being dragged or attracted, apply subtle drifting
if (!pos.settled) {
  // Change direction occasionally
  pos.driftTimer--;
  if (pos.driftTimer <= 0) {
    pos.vx = (Math.random() - 0.5) * 0.2;
    pos.vy = (Math.random() - 0.5) * 0.2;
    pos.driftTimer = Math.floor(Math.random() * 120 + 60); // change every 1–2 seconds
  }

  pos.targetX += pos.vx;
  pos.targetY += pos.vy;
}


// Only interpolate if not settled
if (!pos.settled) {
  pos.currentX = lerp(pos.currentX, pos.targetX, 0.1);
  pos.currentY = lerp(pos.currentY, pos.targetY, 0.1);
}


        // Smoothly interpolate toward target
        pos.currentX = lerp(pos.currentX, pos.targetX, 0.1);
        pos.currentY = lerp(pos.currentY, pos.targetY, 0.1);

        const rotation = el.dataset.rotation;
        el.style.transform = `translate(${pos.currentX}px, ${pos.currentY}px) rotate(${rotation}deg)`;
      });

      requestAnimationFrame(animate);
    }
    animate();

    // Interact.js drag handling
    interact('.movable').draggable({
      listeners: {
        start(event) {
          event.target.classList.add('dragging');
        },
        move(event) {
          const target = event.target;
          const pos = target._pos;
          pos.targetX += event.dx;
          pos.targetY += event.dy;
        },
        end(event) {
          event.target.classList.remove('dragging');
        }
      }
    });