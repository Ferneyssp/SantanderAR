/*
 * Santander AR — modelos 3D procedurales (Three.js).
 * Se construyen en código para no depender de modelos con licencias de terceros.
 * El mismo constructor lo usan la escena de RA (A-Frame + MindAR, THREE de A-Frame)
 * y la vista 3D sin cámara (three.module). También se exportan a GLB (tools/).
 *
 * Sistema de coordenadas: Y hacia arriba, 1 unidad = ancho del marcador.
 * Huella aproximada: x ∈ [-0.48, 0.48], z ∈ [-0.34, 0.34] (marcador 4:3).
 *
 * build(THREE, id) -> { root, hotspots: {id: Vector3}, update(dt), setAction(bool) }
 */
(function () {
  function rng(seed) {
    let s = seed >>> 0;
    return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  }
  const std = (THREE, color, extra) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.85, metalness: 0, flatShading: true }, extra || {}));

  function gableRoof(THREE, w, h, d, mat) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false });
    g.translate(0, 0, -d / 2);
    return new THREE.Mesh(g, mat);
  }

  // ───────────────────────── Barichara ─────────────────────────
  function barichara(THREE) {
    const r = rng(1978);
    const root = new THREE.Group(); root.name = 'Barichara';
    const piedra = std(THREE, 0xD6A854);
    const teja = std(THREE, 0xB0542C);
    const blanco = std(THREE, 0xF4EEE0);
    const oscuro = std(THREE, 0x3A2616);
    const verde = std(THREE, 0x2E5C52);

    // Plaza empedrada
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.02, 0.7), std(THREE, 0xBF9C62));
    base.position.y = -0.01; root.add(base);
    const adoquin = new THREE.CylinderGeometry(0.018, 0.02, 0.008, 6);
    const nAdo = 260;
    const ado = new THREE.InstancedMesh(adoquin, std(THREE, 0xffffff), nAdo);
    const m4 = new THREE.Matrix4(); const col = new THREE.Color(); const q = new THREE.Quaternion();
    for (let i = 0; i < nAdo; i++) {
      const x = (r() - 0.5) * 0.92, z = 0.06 + r() * 0.28;
      q.setFromEuler(new THREE.Euler(0, r() * Math.PI, 0));
      m4.compose(new THREE.Vector3(x, 0.004, z), q, new THREE.Vector3(1, 1, 0.7 + r() * 0.5));
      ado.setMatrixAt(i, m4);
      col.setHSL(0.09 + r() * 0.03, 0.35 + r() * 0.2, 0.5 + r() * 0.15); ado.setColorAt(i, col);
    }
    root.add(ado);

    // Templo: nave + fachada de sillares + dos torres
    const templo = new THREE.Group(); templo.position.set(0, 0, -0.08); root.add(templo);
    const muroMat = std(THREE, 0xD2A350, { transparent: true, opacity: 1 });
    const nave = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.36), muroMat);
    nave.position.set(0, 0.1, -0.08); templo.add(nave);
    const techoNave = gableRoof(THREE, 0.32, 0.08, 0.38, std(THREE, 0xA34E2A, { transparent: true, opacity: 1 }));
    techoNave.position.set(0, 0.2, -0.08); templo.add(techoNave);

    // Fachada de sillares (InstancedMesh con variación de tono)
    const fachada = new THREE.Group(); fachada.position.set(0, 0, 0.105); templo.add(fachada);
    const muroF = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.24, 0.016), piedra); muroF.position.set(0, 0.12, -0.01); fachada.add(muroF);
    const fr = new THREE.Shape(); fr.moveTo(-0.15, 0); fr.lineTo(0.15, 0); fr.lineTo(0, 0.09); fr.closePath();
    const front = new THREE.Mesh(new THREE.ExtrudeGeometry(fr, { depth: 0.016, bevelEnabled: false }), piedra); front.position.set(0, 0.24, -0.018); fachada.add(front);
    const sill = [];
    for (let y = 0; y < 0.26; y += 0.022) {
      let x = -0.15 + (r() * 0.02);
      while (x < 0.15) {
        const w = 0.025 + r() * 0.025;
        const cx = Math.min(x + w / 2, 0.15 - 0.005);
        const inDoor = Math.abs(cx) < 0.045 && y < 0.12;
        const inGable = y > 0.235;
        if (!inDoor && !inGable) sill.push([cx, y + 0.011, w - 0.003]);
        x += w;
      }
    }
    const sMesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 0.019, 0.006), std(THREE, 0xffffff), sill.length);
    sill.forEach(([x, y, w], i) => {
      m4.compose(new THREE.Vector3(x, y, 0), new THREE.Quaternion(), new THREE.Vector3(w, 1, 1));
      sMesh.setMatrixAt(i, m4);
      col.setHSL(0.1 + r() * 0.025, 0.5 + r() * 0.15, 0.5 + r() * 0.14); sMesh.setColorAt(i, col);
    });
    fachada.add(sMesh);
    const puerta = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, 0.012), oscuro);
    puerta.position.set(0, 0.06, 0.003); fachada.add(puerta);
    const arco = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.012, 20, 1, false, 0, Math.PI), oscuro);
    arco.rotation.set(Math.PI / 2, 0, Math.PI / 2); arco.position.set(0, 0.12, 0.004); fachada.add(arco);
    const oculo = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.014, 20), std(THREE, 0xEFE3C4));
    oculo.rotation.x = Math.PI / 2; oculo.position.set(0, 0.275, 0.0); fachada.add(oculo);

    for (const sx of [-1, 1]) {
      const torre = new THREE.Group(); torre.position.set(sx * 0.19, 0, 0.07); templo.add(torre);
      const cuerpo = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.34, 0.08), piedra); cuerpo.position.y = 0.17; torre.add(cuerpo);
      const cupula = new THREE.Mesh(new THREE.ConeGeometry(0.065, 0.1, 4), teja); cupula.position.y = 0.39; cupula.rotation.y = Math.PI / 4; torre.add(cupula);
      for (const [dx, dz, ry] of [[0, 0.041, 0], [0.041, 0, Math.PI / 2], [-0.041, 0, Math.PI / 2], [0, -0.041, 0]]) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.004), oscuro);
        v.position.set(dx, 0.29, dz); v.rotation.y = ry; torre.add(v);
      }
      const cruz = new THREE.Group(); cruz.position.y = 0.46; torre.add(cruz);
      cruz.add(new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.04, 0.006), oscuro));
      const cb = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.006, 0.006), oscuro); cb.position.y = 0.006; cruz.add(cb);
    }

    // 10 columnas interiores (2 filas de 5), visibles al volver translúcidos los muros
    const columnas = new THREE.Group(); columnas.position.set(0, 0, -0.08); templo.add(columnas);
    const colGeo = new THREE.CylinderGeometry(0.012, 0.014, 0.19, 10);
    const colMat = std(THREE, 0xE9C27A, { flatShading: false });
    for (let i = 0; i < 10; i++) {
      const c = new THREE.Mesh(colGeo, colMat);
      c.position.set(i < 5 ? -0.07 : 0.07, 0.095, -0.13 + (i % 5) * 0.065);
      columnas.add(c);
    }

    // Casas con techo de teja
    function casa(x, z, w, d, ry) {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; root.add(g);
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.1, d), blanco); m.position.y = 0.05; g.add(m);
      const t = gableRoof(THREE, w + 0.02, 0.05, d + 0.02, teja); t.position.y = 0.1; g.add(t);
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.06, 0.004), oscuro); p.position.set(0, 0.03, d / 2 + 0.002); g.add(p);
      for (const sx of [-1, 1]) {
        const v = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.032, 0.004), verde); v.position.set(sx * w * 0.3, 0.06, d / 2 + 0.002); g.add(v);
      }
      return g;
    }
    casa(-0.36, -0.08, 0.18, 0.12, 0.08);
    casa(0.36, -0.06, 0.18, 0.12, -0.1);
    casa(-0.38, 0.17, 0.14, 0.1, 0.25);

    const hotspots = {
      piedra: new THREE.Vector3(0.09, 0.2, 0.05),
      columnas: new THREE.Vector3(0, 0.32, -0.17),
      monumento: new THREE.Vector3(0.24, 0.05, 0.22),
      nombre: new THREE.Vector3(-0.36, 0.2, -0.08),
    };
    let abierto = false;
    return {
      root, hotspots,
      update() {},
      setAction(on) {
        abierto = on;
        muroMat.opacity = on ? 0.18 : 1; muroMat.depthWrite = !on;
        techoNave.material.opacity = on ? 0.1 : 1; techoNave.material.depthWrite = !on;
        colMat.color.set(on ? 0xFFD27A : 0xE9C27A);
        colMat.emissive = new THREE.Color(on ? 0x3A2400 : 0x000000);
      },
      get actionOn() { return abierto; },
    };
  }

  // ───────────────────────── Chicamocha ─────────────────────────
  function chicamocha(THREE) {
    const root = new THREE.Group(); root.name = 'Chicamocha';
    const W = 0.96, D = 0.7, SX = 120, SZ = 88;
    const meander = (x) => 0.06 * Math.sin(x * 6.2) + 0.02 * Math.sin(x * 15 + 1);
    const height = (x, z) => {
      const d = Math.abs(z - meander(x));
      const valle = Math.exp(-Math.pow(d / 0.16, 2.6));
      let h = 0.27 - 0.26 * valle;
      h = Math.round(h / 0.022) * 0.022 * 0.7 + h * 0.3; // terrazas = estratos
      h += 0.008 * Math.sin(x * 40 + z * 23) + 0.006 * Math.sin(x * 71 - z * 37);
      return Math.max(0.012, h);
    };
    const bandas = [0x7A8A4A, 0xB06A3A, 0xC98E52, 0x9C5A36, 0xD7A86A, 0x8E4E30, 0xC7804A];
    const geo = new THREE.PlaneGeometry(W, D, SX, SZ);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position; const colors = []; const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i), h = height(x, z);
      pos.setY(i, h);
      if (h > 0.235) c.set(0x8C8F55); else c.set(bandas[Math.floor(h / 0.03) % bandas.length]);
      if (h < 0.05) c.set(0x9C9A5A);
      colors.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    root.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 })));

    // Faldón lateral (cierra la maqueta como un bloque)
    const skirtPos = [];
    const edge = (pts) => {
      for (let i = 0; i < pts.length - 1; i++) {
        const [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
        const h0 = height(x0, z0), h1 = height(x1, z1);
        skirtPos.push(x0, 0, z0, x1, 0, z1, x1, h1, z1, x0, 0, z0, x1, h1, z1, x0, h0, z0);
      }
    };
    const N = 120, xs = [...Array(N + 1)].map((_, i) => -W / 2 + (W * i) / N), zs = [...Array(N + 1)].map((_, i) => -D / 2 + (D * i) / N);
    edge(xs.map((x) => [x, D / 2]));
    edge(xs.slice().reverse().map((x) => [x, -D / 2]));
    edge(zs.slice().reverse().map((z) => [W / 2, z]));
    edge(zs.map((z) => [-W / 2, z]));
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(skirtPos, 3));
    sg.computeVertexNormals();
    root.add(new THREE.Mesh(sg, new THREE.MeshStandardMaterial({ color: 0x8A5534, side: THREE.DoubleSide, roughness: 1 })));

    // Río
    const rioPts = [];
    for (let i = 0; i <= 60; i++) { const x = -W / 2 + 0.01 + (W - 0.02) * i / 60; rioPts.push(new THREE.Vector3(x, height(x, meander(x)) + 0.006, meander(x))); }
    const rio = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rioPts), 160, 0.014, 6), std(THREE, 0x3E8FA8, { flatShading: false, roughness: 0.3, metalness: 0.1 }));
    root.add(rio);

    // Teleférico: dos estaciones en las mesetas, cable con catenaria y cabina animada
    const a = new THREE.Vector3(0.12, height(0.12, -0.3) + 0.09, -0.3);
    const b = new THREE.Vector3(-0.08, height(-0.08, 0.3) + 0.09, 0.3);
    for (const p of [a, b]) {
      const est = new THREE.Group(); est.position.set(p.x, p.y - 0.09, p.z); root.add(est);
      const torre = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.09, 0.018), std(THREE, 0x5A5A64)); torre.position.y = 0.045; est.add(torre);
      const casita = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.05), std(THREE, 0xEDE6D6)); casita.position.y = 0.015; est.add(casita);
    }
    const mid = a.clone().add(b).multiplyScalar(0.5); mid.y -= 0.05;
    const curva = new THREE.QuadraticBezierCurve3(a, mid, b);
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 60, 0.0025, 5), std(THREE, 0x1F1A14)));
    const cabina = new THREE.Group(); root.add(cabina);
    const caja = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, 0.03), std(THREE, 0xC62828)); caja.position.y = -0.03; cabina.add(caja);
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.012, 0.024), std(THREE, 0xCFE8F0)); vent.position.y = -0.024; cabina.add(vent);
    const brazo = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.012, 0.003), std(THREE, 0x1F1A14)); brazo.position.y = -0.007; cabina.add(brazo);

    // Arbustos dispersos
    const rr = rng(632);
    const arb = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.008, 0), std(THREE, 0x5E6E34), 140);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 140; i++) {
      const x = (rr() - 0.5) * 0.92, z = (rr() - 0.5) * 0.66;
      m4.makeTranslation(x, height(x, z) + 0.005, z); arb.setMatrixAt(i, m4);
    }
    root.add(arb);

    let t = 0.15, dir = 1, pausado = false;
    const place = () => { const p = curva.getPoint(t); cabina.position.copy(p); };
    place();
    return {
      root,
      hotspots: {
        teleferico: curva.getPoint(0.5).add(new THREE.Vector3(0, 0.06, 0)),
        profundidad: new THREE.Vector3(-0.3, 0.2, meander(-0.3) + 0.02),
        rio: new THREE.Vector3(0.32, 0.07, meander(0.32)),
        parque: new THREE.Vector3(0.3, 0.33, -0.24),
      },
      update(dt) {
        if (pausado) return;
        t += dir * dt * 0.08;
        if (t > 0.98) { t = 0.98; dir = -1; } else if (t < 0.02) { t = 0.02; dir = 1; }
        place();
      },
      setAction(on) { pausado = on; },
      get actionOn() { return pausado; },
    };
  }

  // ───────────────────────── San Gil · El Gallineral ─────────────────────────
  function sangil(THREE) {
    const r = rng(1689);
    const root = new THREE.Group(); root.name = 'SanGil_ElGallineral';
    // Lecho de agua (río Fonce al frente y brazos de la quebrada alrededor de la isla)
    const agua = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.02, 0.7), std(THREE, 0x3F8C9A, { flatShading: false, roughness: 0.25, metalness: 0.1 }));
    agua.position.y = -0.01; root.add(agua);
    // Orillas al fondo
    for (const sx of [-1, 1]) {
      const orilla = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 0.14), std(THREE, 0x6F8F4E));
      orilla.position.set(sx * 0.38, 0.005, -0.28); root.add(orilla);
    }
    // Isla (forma orgánica extruida)
    const s = new THREE.Shape();
    for (let i = 0; i <= 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const rad = 1 + 0.08 * Math.sin(a * 3 + 0.5) + 0.05 * Math.sin(a * 5);
      const x = Math.cos(a) * 0.34 * rad, y = Math.sin(a) * 0.17 * rad;
      i === 0 ? s.moveTo(x, y) : s.lineTo(x, y);
    }
    const isla = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.01, bevelSegments: 1 }), std(THREE, 0x7C9C56));
    isla.rotation.x = -Math.PI / 2; isla.position.set(0, -0.01, -0.03); root.add(isla);

    // Árboles con "barba de viejo"
    const barbas = [];
    const troncoMat = std(THREE, 0x5A3E26);
    const copaMats = [std(THREE, 0x3A7040), std(THREE, 0x4A8048), std(THREE, 0x2F5E38)];
    const barbaMat = std(THREE, 0xB9C2A6, { flatShading: false });
    const hebra = new THREE.CylinderGeometry(0.0016, 0.0008, 1, 4); hebra.translate(0, -0.5, 0);
    const posArboles = [];
    while (posArboles.length < 14) {
      const x = (r() - 0.5) * 0.58, z = (r() - 0.5) * 0.26 - 0.03;
      if ((x * x) / (0.3 * 0.3) + (z + 0.03) * (z + 0.03) / (0.14 * 0.14) > 1) continue;
      if (posArboles.some(([px, pz]) => Math.hypot(px - x, pz - z) < 0.08)) continue;
      posArboles.push([x, z]);
    }
    posArboles.forEach(([x, z], i) => {
      const g = new THREE.Group(); g.position.set(x, 0.026, z); root.add(g);
      const alto = 0.14 + r() * 0.08;
      const tronco = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.01, alto, 6), troncoMat); tronco.position.y = alto / 2; g.add(tronco);
      for (let k = 0; k < 4; k++) {
        const copa = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035 + r() * 0.02, 0), copaMats[k % 3]);
        copa.position.set((r() - 0.5) * 0.06, alto + (r() - 0.3) * 0.03, (r() - 0.5) * 0.05); copa.scale.y = 0.7; g.add(copa);
      }
      const barba = new THREE.Group(); barba.position.y = alto - 0.01; g.add(barba);
      for (let k = 0; k < 14; k++) {
        const h = new THREE.Mesh(hebra, barbaMat);
        const ang = r() * Math.PI * 2, rad = 0.02 + r() * 0.035;
        h.position.set(Math.cos(ang) * rad, 0, Math.sin(ang) * rad);
        h.scale.y = 0.05 + r() * 0.08; barba.add(h);
      }
      barbas.push({ g: barba, fase: r() * Math.PI * 2, amp: 0.12 + r() * 0.1 });
    });

    // Espuma que corre por el río Fonce (animada)
    const espumas = [];
    const espumaMat = std(THREE, 0xE8F4F4, { flatShading: false });
    for (let i = 0; i < 18; i++) {
      const e = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.003, 10), espumaMat);
      e.scale.set(1.8 + r(), 1, 0.6);
      e.position.set((r() - 0.5) * 0.94, 0.002, 0.2 + r() * 0.13); root.add(e);
      espumas.push({ m: e, v: 0.04 + r() * 0.04 });
    }
    // Piedras en el río
    const piedras = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.014, 0), std(THREE, 0x8E877A), 22);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 22; i++) {
      m4.compose(new THREE.Vector3((r() - 0.5) * 0.9, 0.002, 0.18 + r() * 0.15), new THREE.Quaternion(), new THREE.Vector3(1 + r(), 0.5, 1 + r() * 0.5));
      piedras.setMatrixAt(i, m4);
    }
    root.add(piedras);

    let tiempo = 0, calma = false;
    return {
      root,
      hotspots: {
        arboles: new THREE.Vector3(posArboles[0][0], 0.28, posArboles[0][1]),
        isla: new THREE.Vector3(-0.36, 0.06, 0.05),
        fundacion: new THREE.Vector3(0.38, 0.08, -0.28),
        aventura: new THREE.Vector3(0.1, 0.05, 0.27),
      },
      update(dt) {
        tiempo += dt;
        const f = calma ? 0.15 : 1;
        for (const b of barbas) {
          b.g.rotation.z = Math.sin(tiempo * 1.6 + b.fase) * b.amp * f;
          b.g.rotation.x = Math.cos(tiempo * 1.1 + b.fase) * b.amp * 0.5 * f;
        }
        for (const e of espumas) {
          e.m.position.x += e.v * dt;
          if (e.m.position.x > 0.47) e.m.position.x = -0.47;
        }
      },
      setAction(on) { calma = on; },
      get actionOn() { return calma; },
    };
  }

  const builders = { barichara, chicamocha, sangil };

  /** Crea un "pin" numerado como Sprite (textura de canvas, sin fuentes externas). */
  function hotspotSprite(THREE, numero, color) {
    const cv = document.createElement('canvas'); cv.width = cv.height = 128;
    const g = cv.getContext('2d');
    g.beginPath(); g.arc(64, 64, 58, 0, Math.PI * 2); g.fillStyle = '#F4EDE1'; g.fill();
    g.lineWidth = 10; g.strokeStyle = color; g.stroke();
    g.fillStyle = '#1F1A14'; g.font = 'bold 64px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(numero), 64, 68);
    const tex = new THREE.CanvasTexture(cv);
    if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    sp.scale.set(0.055, 0.055, 0.055); sp.renderOrder = 10;
    return sp;
  }

  window.SantanderModels = {
    ids: Object.keys(builders),
    build(THREE, id) {
      const fn = builders[id];
      if (!fn) throw new Error('Modelo desconocido: ' + id);
      return fn(THREE);
    },
    /** Añade los pines de información al modelo. Devuelve la lista de sprites (para raycasting). */
    addHotspots(THREE, model, puntos, color) {
      const sprites = [];
      puntos.forEach((p, i) => {
        const pos = model.hotspots[p.id];
        if (!pos) return;
        const sp = hotspotSprite(THREE, i + 1, color);
        sp.position.copy(pos); sp.userData.puntoId = p.id; sp.name = 'pin-' + p.id;
        model.root.add(sp); sprites.push(sp);
      });
      return sprites;
    },
  };
})();
