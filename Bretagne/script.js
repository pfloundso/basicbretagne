const playground = document.body;

const sizes = [100, 140, 180];  // Drei verschiedene Größen

for (let i = 0; i < 26; i++) {
  const img = document.createElement('img');
  img.src = 'images/kreis.png';
  img.classList.add('movable');
  img.style.position = 'absolute';

  // ZUERST Größe festlegen
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  img.style.width = `${randomSize}px`;
  img.style.height = `${randomSize}px`;
  img.style.cursor = 'grab';

  // DANN Position berechnen
  const maxTop = window.innerHeight - randomSize;
  const maxLeft = window.innerWidth - randomSize;
  img.style.top = Math.random() * maxTop + 'px';
  img.style.left = Math.random() * maxLeft + 'px';

  // Rotation setzen
  const randomRotation = Math.floor(Math.random() * 360);
  img.dataset.rotation = randomRotation;
  img.dataset.x = 0;
  img.dataset.y = 0;
  img.style.transform = `rotate(${randomRotation}deg)`;

  playground.appendChild(img);
}


// Interact.js mit Rotation und Bewegung kombinieren
interact('.movable').draggable({
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent', // 'body' ist das Parent-Element
      endOnly: true
    })
  ],
  
  listeners: {
    move(event) {
      const target = event.target;
      const x = (parseFloat(target.dataset.x) || 0) + event.dx;
      const y = (parseFloat(target.dataset.y) || 0) + event.dy;
      const rotation = target.dataset.rotation || 0;

      // Bewegung und Rotation zusammen anwenden
      target.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

      target.dataset.x = x;
      target.dataset.y = y;
    }
  }
});

