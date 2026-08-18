/* Will I Get Offlined? v1 */
/* Brand: XSANE Rust Mobile */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* ==========================================================================
       1. Global Helper Utilities & Toast Notifications
       ========================================================================== */
    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('rust-toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'rust-toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                pointer-events: none;
                max-width: 90vw;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        const bgColor = type === 'hazard' || type === 'danger' ? '#CD412B' : (type === 'success' ? '#10B981' : '#1F242A');
        const borderColor = type === 'hazard' || type === 'danger' ? '#FFA596' : (type === 'success' ? '#34D399' : '#3B424C');

        toast.style.cssText = `
            background: ${bgColor};
            color: #FFFFFF;
            padding: 10px 20px;
            border-radius: 8px;
            border: 1px solid ${borderColor};
            font-family: 'Rajdhani', sans-serif;
            font-size: 1.05rem;
            font-weight: 700;
            box-shadow: 0 8px 24px rgba(0,0,0,0.6);
            opacity: 0;
            transform: translateY(16px);
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: auto;
            text-align: center;
        `;
        toast.textContent = message;
        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(16px)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3200);
    }

    function copyToClipboard(text, successMsg = 'Copied to clipboard!') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg, 'success');
            }).catch(() => {
                showToast(text, 'info');
            });
        } else {
            showToast(text, 'info');
        }
    }

    /* ==========================================================================
       2. Mobile Menu Toggle & Navigation
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
    const mobileNavDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileMenuBtn && mobileNavDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNavDrawer.classList.toggle('open');
        });

        const drawerLinks = mobileNavDrawer.querySelectorAll('a');
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNavDrawer.classList.remove('open');
            });
        });
    }

    /* ==========================================================================
       3. Back To Top Button & Floating Action
       ========================================================================== */
    let backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top-btn';
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.innerHTML = '▲';
        backToTopBtn.setAttribute('aria-label', 'Back to top of page');
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================================
       4. Wipe Ticker Dynamic Updates
       ========================================================================== */
    const tickerMsg = document.getElementById('ticker-message');
    const tickerFeed = [
        "⚠️ HIGH THREAT DETECTED: 8-Man Zerg spotted crafting 48 Rockets in Grid G7 • Force Wipe Approaching • Keep TC Stocked!",
        "🔥 RADAR ALERT: Heli down at Launch Site • 6 different groups contesting with HV rockets!",
        "📡 XSANE TRANSMISSION: Air-lock open at Grid M12 • Bush grub spotted with Double Barrel shotgun!",
        "🚨 CODE RED: Oil Rig crate hacked 4 minutes ago • Torpedo subs circling water perimeter • Stay alert!"
    ];
    let tickerIndex = 0;
    if (tickerMsg) {
        setInterval(() => {
            tickerIndex = (tickerIndex + 1) % tickerFeed.length;
            tickerMsg.style.opacity = '0';
            setTimeout(() => {
                tickerMsg.textContent = tickerFeed[tickerIndex];
                tickerMsg.style.opacity = '1';
            }, 300);
        }, 7000);
    }

    /* ==========================================================================
       5. Will I Get Offlined? Checker
       ========================================================================== */
    const offlineForm = document.getElementById('offline-form');
    const offlinePlaceholder = document.getElementById('offline-placeholder-state');
    const offlineCalculated = document.getElementById('offline-calculated-state');
    const riskPercentEl = document.getElementById('risk-percent');
    const verdictTitleEl = document.getElementById('verdict-title');
    const verdictDescEl = document.getElementById('verdict-desc');
    const timeToBoomEl = document.getElementById('time-to-boom');
    const sulfurCostEl = document.getElementById('sulfur-cost');
    const weakestPointEl = document.getElementById('weakest-point');
    const survivalRecEl = document.getElementById('survival-rec');
    const offlineQuoteEl = document.getElementById('offline-quote');

    const offlineQuotes = [
        "\"The only safe base in Rust is the one you haven't built yet.\" — XSANE",
        "\"If you have 100 high qual in the core, the clan already knows.\" — Rust proverb",
        "\"Sleep is just an invitation for sulfur enthusiasts to visit your loot room.\" — Server Veteran",
        "\"They didn't raid you for profit; they raided you because you made a 1x1 too close to their compound.\" — XSANE"
    ];

    if (offlineForm) {
        offlineForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const baseTier = document.getElementById('base-tier').value;
            const honeycomb = parseInt(document.getElementById('honeycomb-count').value, 10) || 0;
            const doorPath = document.getElementById('door-path').value;
            const compound = document.getElementById('compound-type').value;
            const turrets = parseInt(document.getElementById('turrets-count').value, 10) || 0;
            const offlineHours = parseInt(document.getElementById('offline-hours').value, 10) || 8;
            const upkeepHours = parseInt(document.getElementById('upkeep-hours').value, 10) || 24;
            const neighborThreat = document.getElementById('neighbor-threat').value;
            const pissedZerg = document.getElementById('pissed-zerg').checked;

            // Base Risk Math
            let risk = 35;

            // Base tier modifications
            if (baseTier === 'wood') risk += 50;
            else if (baseTier === 'stone') risk += 20;
            else if (baseTier === 'sheet') risk -= 5;
            else if (baseTier === 'armored') risk -= 20;
            else if (baseTier === 'bunker') risk -= 30;
            else if (baseTier === 'cave') risk -= 15;

            // Honeycomb
            risk -= (honeycomb * 8);

            // Door Path
            if (doorPath === 'wood_doors') risk += 30;
            else if (doorPath === 'single_sheet') risk += 15;
            else if (doorPath === 'garage_doors') risk -= 15;
            else if (doorPath === 'armored_doors') risk -= 25;

            // Compound
            if (compound === 'none') risk += 15;
            else if (compound === 'wood_walls') risk += 5;
            else if (compound === 'stone_walls') risk -= 10;
            else if (compound === 'double_compound') risk -= 20;

            // Turrets
            risk -= Math.min(turrets * 4, 25);

            // Offline hours factor
            risk += Math.min(offlineHours * 2.5, 30);

            // Upkeep danger (decay)
            if (upkeepHours < offlineHours) risk += 45;

            // Neighbor threat
            if (neighborThreat === 'low') risk -= 15;
            else if (neighborThreat === 'high') risk += 20;
            else if (neighborThreat === 'zerg') risk += 35;
            else if (neighborThreat === 'beef') risk += 45;

            // Global chat trash talk factor
            if (pissedZerg) risk += 40;

            // Random variance factor (+/- 5%)
            risk += Math.floor(Math.random() * 11) - 5;
            risk = Math.max(5, Math.min(99, Math.round(risk)));

            // Compute Sulfur cost & weak point
            let sulfur = 2200;
            let weakPoint = "Sheet Metal Doors";
            let rec = "Add a bunker airlock and place shotty traps";

            if (baseTier === 'wood' || doorPath === 'wood_doors') {
                sulfur = 600;
                weakPoint = "Wooden Exterior / Front Door";
                rec = "Upgrade everything to Stone immediately or lose all loot";
            } else if (doorPath === 'garage_doors' && honeycomb >= 2) {
                sulfur = 9800;
                weakPoint = "Top-down Splash via Roof";
                rec = "Build roof shooting floor peaks with auto turrets";
            } else if (baseTier === 'armored' || baseTier === 'bunker') {
                sulfur = 15600;
                weakPoint = "Splash rockets through external frame";
                rec = "Hide your sulfur in an external 1x1 stash base";
            } else if (compound === 'none') {
                sulfur = 3200;
                weakPoint = "Direct Doorcamp and Air-lock rush";
                rec = "Erect stone high external walls and external TCs";
            }

            // Estimate Time Until Boom
            let hoursRemaining = Math.max(0.5, (100 - risk) / 12).toFixed(1);

            // Populate UI
            if (offlinePlaceholder) offlinePlaceholder.classList.add('hidden');
            if (offlineCalculated) offlineCalculated.classList.remove('hidden');

            riskPercentEl.textContent = `${risk}%`;
            timeToBoomEl.textContent = `~ ${hoursRemaining} hours`;
            sulfurCostEl.textContent = `~ ${sulfur.toLocaleString()} Sulfur`;
            weakestPointEl.textContent = weakPoint;
            survivalRecEl.textContent = rec;
            offlineQuoteEl.textContent = offlineQuotes[Math.floor(Math.random() * offlineQuotes.length)];

            if (risk >= 80) {
                verdictTitleEl.textContent = "100% WAKING UP ON THE BEACH";
                verdictDescEl.textContent = "Your base is practically public property. Despawn your loot or kiss it goodbye.";
                verdictTitleEl.style.color = "#EF4444";
            } else if (risk >= 50) {
                verdictTitleEl.textContent = "HIGH SEVERITY THREAT";
                verdictDescEl.textContent = "Neighbors are actively counting your doors. Log off with high-tier gear on your body.";
                verdictTitleEl.style.color = "#F59E0B";
            } else {
                verdictTitleEl.textContent = "SURVIVAL LIKELY (FOR NOW)";
                verdictDescEl.textContent = "Raiders will likely bypass you for an easier 2x1 target nearby. Sleep tight!";
                verdictTitleEl.style.color = "#10B981";
            }

            showToast(`Offline Raid Risk calculated: ${risk}%`, risk > 70 ? 'hazard' : 'info');
        });
    }

    /* ==========================================================================
       6. What Kind Of Rust Player Are You? (Archetypes)
       ========================================================================== */
    const playerQuizForm = document.getElementById('player-quiz-form');
    const archetypeResultCard = document.getElementById('player-archetype-result');
    const quizResetBtn = document.getElementById('quiz-reset-btn');

    const archetypes = [
        {
            type: "Sulfur Farmer",
            badge: "⛏️ THE COMPULSIVE MINER",
            title: "The 24/7 Sulfur Farmer",
            desc: "You log in solely to smack glowing nodes with a jackhammer until your inventory overflows with 60,000 sulfur. You don't even craft rockets; you just hoard sulfur in the TC until a zerg offlines you for it.",
            naked: "10% (Harmless)",
            morals: "Saintly",
            sound: "*Clink clink clink*",
            comment: "Raiders thank you for your voluntary resource donation service."
        },
        {
            type: "Chad PvPer",
            badge: "🎯 LASER BEAM MASTER",
            title: "The Ak-47 Spray God",
            desc: "You have 3,400 hours on aim-train servers and can triple-headshot someone at 200 meters. You never farm, you roam 5 minutes after wipe, and you treat every naked as a threat to national security.",
            naked: "100% (Instant Kill)",
            morals: "Ruthless",
            sound: "*Dink dink dink*",
            comment: "Spends 90% of your time inspecting your weapon skin."
        },
        {
            type: "Professional Grub",
            badge: "🐀 CERTIFIED BUSH GOBLIN",
            title: "The Double Barrel Grub",
            desc: "You carry nothing more than burlap shoes, a craftable eoka, and a dream. You sit silently in hemp bushes for 45 real-time minutes waiting to snatch a full metal kit from an unsuspecting farmer.",
            naked: "80%",
            morals: "Non-existent",
            sound: "*Eoka click click BOOM*",
            comment: "Zero kits invested, maximum salt harvested."
        },
        {
            type: "Roof Camper",
            badge: "🔭 TOWER WARLORD",
            title: "The L96 Roof Goblin",
            desc: "You haven't touched the grass outside your base since wipe day. You sit 8 stories up on your sniper turret plinking nakeds running by Outpost with an 8x scope and HV rockets.",
            naked: "100% (From 400m away)",
            morals: "Sub-zero",
            sound: "*L96 supersonic crack*",
            comment: "Expect 12 ladders and 4 C4s stuck to your roof tonight."
        },
        {
            type: "Base Builder",
            badge: "📐 ARCHITECTURAL GENIUS",
            title: "The Suicide Bunker Architect",
            desc: "You spent 4 hours in a creative build server designing a 3-floor pixel bunker with 14 door airlocks and roof drop-downs. Your teammates get lost inside your own base every single wipe.",
            naked: "20%",
            morals: "Orderly",
            sound: "*Rotating triangle floor frame*",
            comment: "Takes your team 15 minutes just to leave the front door."
        },
        {
            type: "Loot Goblin",
            badge: "🎒 HOARDER SUPREME",
            title: "The Recycler Vacuum",
            desc: "You cannot pass a single road barrel without hitting it. Your chests are filled with 40 guitar kits, 80 empty tuna cans, and 500 horse dung that you refuse to throw away.",
            naked: "50%",
            morals: "Greedy",
            sound: "*Inventory full beep*",
            comment: "Will die carrying 1,200 scrap because you wanted one more road sign."
        },
        {
            type: "Solo Warrior",
            badge: "🐺 LONE WOLF SURVIVOR",
            title: "The Paranoid Solo",
            desc: "You live in a secluded 1x2 in the snowy mountains. Every twig snapping sound gives you a minor cardiac arrest. You don't have friends; you have temporary truces with neighboring nakeds.",
            naked: "40%",
            morals: "Guarded",
            sound: "*Creeping crouch-walk footsteps*",
            comment: "Plays with game volume at 150% and Discord muted."
        }
    ];

    if (playerQuizForm) {
        playerQuizForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const selected = archetypes[Math.floor(Math.random() * archetypes.length)];

            document.getElementById('archetype-badge').textContent = selected.badge;
            document.getElementById('archetype-title').textContent = selected.title;
            document.getElementById('archetype-desc').textContent = `${selected.desc} "${selected.comment}"`;
            document.getElementById('trait-naked').textContent = selected.naked;
            document.getElementById('trait-morals').textContent = selected.morals;
            document.getElementById('trait-sound').textContent = selected.sound;

            playerQuizForm.classList.add('hidden');
            archetypeResultCard.classList.remove('hidden');

            showToast(`Player Archetype Diagnosed: ${selected.type}!`, 'hazard');
        });
    }

    if (quizResetBtn) {
        quizResetBtn.addEventListener('click', () => {
            archetypeResultCard.classList.add('hidden');
            playerQuizForm.classList.remove('hidden');
            playerQuizForm.reset();
        });
    }

    /* ==========================================================================
       7. Wheel Of Misfortune (Canvas & Physics Animation)
       ========================================================================== */
    const canvas = document.getElementById('misfortune-wheel');
    const spinBtn = document.getElementById('spin-wheel-btn');
    const misfortuneText = document.getElementById('misfortune-text');
    const misfortuneTip = document.getElementById('misfortune-tip');

    const wheelSlices = [
        { label: "Find AK Today", color: "#1E293B", textCol: "#38BDF8", tip: "A wandering naked drops a full durability assault rifle right in front of you!" },
        { label: "Offline Raid Incoming", color: "#CD412B", textCol: "#FFFFFF", tip: "Your base has been scouted by an 8-man zerg. Start packing the bunker." },
        { label: "Trust No One", color: "#16181B", textCol: "#CBD5E1", tip: "The friendly naked offering you cooked bear meat has an eoka in his sash." },
        { label: "Lucky Day", color: "#F59E0B", textCol: "#111315", tip: "Bandit wheel hits 20x for you twice in a row. Cash out and run!" },
        { label: "Door Camper Energy", color: "#7C2D12", textCol: "#FFFFFF", tip: "Someone with a waterpipe has been sitting outside your airlock for 22 minutes." },
        { label: "Airfield Adventure", color: "#1E293B", textCol: "#38BDF8", tip: "You loot the red room completely uncontested with 5 minutes before crate despawns." },
        { label: "Sulfur Jackpot", color: "#F59E0B", textCol: "#111315", tip: "14 pristine sulfur nodes spawn grouped together in your snow valley." },
        { label: "Start Naked", color: "#CD412B", textCol: "#FFFFFF", tip: "Spawn on the beach. Hear a minicopter 5 seconds later. RIP." },
        { label: "Roof Camper", color: "#16181B", textCol: "#EF4444", tip: "An L96 sniper tags you from two mountain ridges away. Keep moving!" },
        { label: "Base Destroyed", color: "#7C2D12", textCol: "#FFFFFF", tip: "Log in to find nothing left but a wooden triangle foundation and sorrow." },
        { label: "Rare Loot", color: "#059669", textCol: "#FFFFFF", tip: "Military crate yields an Armored Door and C4 blueprint on run 1." },
        { label: "Nothing Happens", color: "#27272A", textCol: "#A1A1AA", tip: "A surprisingly quiet evening of smelting metal and sorting storage boxes." }
    ];

    let isSpinning = false;
    let currentAngle = 0;

    function drawWheel(angle) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const numSlices = wheelSlices.length;
        const arc = (2 * Math.PI) / numSlices;
        const radius = canvas.width / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw Slices
        for (let i = 0; i < numSlices; i++) {
            const sliceAngle = angle + (i * arc);
            ctx.beginPath();
            ctx.fillStyle = wheelSlices[i].color;
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius - 6, sliceAngle, sliceAngle + arc);
            ctx.lineTo(radius, radius);
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#2D333B';
            ctx.stroke();

            // Text Rendering
            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(sliceAngle + (arc / 2));
            ctx.textAlign = "right";
            ctx.fillStyle = wheelSlices[i].textCol;
            ctx.font = "bold 13px Rajdhani, sans-serif";
            ctx.fillText(wheelSlices[i].label, radius - 24, 5);
            ctx.restore();
        }

        // Outer Ring
        ctx.beginPath();
        ctx.arc(radius, radius, radius - 4, 0, 2 * Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#CD412B';
        ctx.stroke();
    }

    if (canvas) {
        drawWheel(0);
    }

    if (spinBtn && canvas) {
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            isSpinning = true;
            spinBtn.disabled = true;
            spinBtn.style.opacity = '0.6';

            const spins = 5 + Math.floor(Math.random() * 5); // 5 to 9 rotations
            const targetSliceIndex = Math.floor(Math.random() * wheelSlices.length);
            const numSlices = wheelSlices.length;
            const arc = (2 * Math.PI) / numSlices;

            // Pointer is at the top (angle = 3 * PI / 2)
            const targetOffset = (3 * Math.PI / 2) - (targetSliceIndex * arc) - (arc / 2);
            const totalTargetRotation = (spins * 2 * Math.PI) + targetOffset;

            const startAngle = currentAngle % (2 * Math.PI);
            const deltaAngle = totalTargetRotation - startAngle;
            const duration = 4000;
            const startTime = performance.now();

            function animateSpin(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out cubic
                const easeOut = 1 - Math.pow(1 - progress, 3);
                currentAngle = startAngle + (deltaAngle * easeOut);

                drawWheel(currentAngle);

                if (progress < 1) {
                    requestAnimationFrame(animateSpin);
                } else {
                    isSpinning = false;
                    spinBtn.disabled = false;
                    spinBtn.style.opacity = '1';

                    const winning = wheelSlices[targetSliceIndex];
                    misfortuneText.textContent = winning.label;
                    misfortuneTip.textContent = winning.tip;
                    showToast(`Misfortune Result: ${winning.label}!`, 'hazard');
                }
            }

            requestAnimationFrame(animateSpin);
        });
    }

    /* ==========================================================================
       8. Today's Rust Prophecy (Tarot Card Drawing)
       ========================================================================== */
    const drawProphecyBtn = document.getElementById('draw-prophecy-btn');
    const tarotCard = document.getElementById('active-tarot-card');
    const cardRune = document.getElementById('card-rune');
    const cardName = document.getElementById('card-name');
    const cardSub = document.getElementById('card-sub');
    const omenLevel = document.getElementById('omen-level');
    const omenHeadline = document.getElementById('omen-headline');
    const omenNarrative = document.getElementById('omen-narrative');
    const omenMonument = document.getElementById('omen-monument');
    const omenGrid = document.getElementById('omen-grid');
    const omenWeapon = document.getElementById('omen-weapon');
    const omenSalt = document.getElementById('omen-salt');

    const prophecies = [
        {
            symbol: "⚡",
            name: "THE ROCKET RAID",
            sub: "Arcana VIII • Destruction",
            level: "CATASTROPHIC OMEN",
            headline: "\"Trust no naked near your air-lock\"",
            narrative: "The spirits whisper that your neighbors have spotted your furnace smoke. Today is NOT the day to transport all your high quality metal in a minicopter. Keep your doors doubled and your compound locked.",
            monument: "Water Treatment",
            grid: "Grid H14",
            weapon: "Python Revolver",
            salt: "98 / 100"
        },
        {
            symbol: "🛢️",
            name: "THE OIL CONTEST",
            sub: "Arcana IV • Fortune",
            level: "FAVORABLE COMBAT OMEN",
            headline: "\"The Hackable Crate holds an M249 for the bold\"",
            narrative: "Heavy scientists will miss their shots today. Take a RHIB with 20 low grade and contest Large Oil Rig before the server zerg awakens. Glory awaits.",
            monument: "Large Oil Rig",
            grid: "Grid T2",
            weapon: "Custom SMG",
            salt: "45 / 100"
        },
        {
            symbol: "🐀",
            name: "THE BUSH GRUB",
            sub: "Arcana XII • Stealth",
            level: "MALICIOUS OMEN",
            headline: "\"A single DB shot will change your wipe\"",
            narrative: "Do not leave base with gear today. Creep into the dense swamp bushes with a waterpipe and wait for two geared teams to wipe each other out.",
            monument: "Oxum's Gas Station",
            grid: "Grid D8",
            weapon: "Double Barrel Shotgun",
            salt: "88 / 100"
        },
        {
            symbol: "🛡️",
            name: "THE IRON FORTRESS",
            sub: "Arcana I • Protection",
            level: "SERENE DEFENSE OMEN",
            headline: "\"Your honeycomb holds firm against the storm\"",
            narrative: "The raid alarm may ring, but raiders will run out of boom on your second garage door. Keep 50 high qual in TC and rest easily tonight.",
            monument: "Outpost Safe Zone",
            grid: "Grid J10",
            weapon: "Pump Shotgun",
            salt: "15 / 100"
        }
    ];

    if (drawProphecyBtn && tarotCard) {
        drawProphecyBtn.addEventListener('click', () => {
            tarotCard.style.transform = "rotateY(180deg) scale(0.9)";
            
            setTimeout(() => {
                const picked = prophecies[Math.floor(Math.random() * prophecies.length)];
                cardRune.textContent = picked.symbol;
                cardName.textContent = picked.name;
                cardSub.textContent = picked.sub;
                omenLevel.textContent = picked.level;
                omenHeadline.textContent = picked.headline;
                omenNarrative.textContent = picked.narrative;
                omenMonument.textContent = picked.monument;
                omenGrid.textContent = picked.grid;
                omenWeapon.textContent = picked.weapon;
                omenSalt.textContent = picked.salt;

                tarotCard.style.transform = "rotateY(0deg) scale(1)";
                showToast("Today's Prophecy Divined!", 'hazard');
            }, 300);
        });
    }

    /* ==========================================================================
       9. How Will I Die Today? (Death Simulator)
       ========================================================================== */
    const deathForm = document.getElementById('death-sim-form');
    const deathCauseTitle = document.getElementById('death-cause-title');
    const logLine1 = document.getElementById('log-line-1');
    const logLine2 = document.getElementById('log-line-2');
    const logLine3 = document.getElementById('log-line-3');
    const rageMeterFill = document.getElementById('rage-meter-fill');
    const ragePercentVal = document.getElementById('rage-percent-val');

    const deathScenarios = [
        {
            title: "FATAL HEADSHOT FROM UNRENDERED BUSH",
            attacker: "xX_DoorCamper_Xx",
            dmg: "100.0 dmg",
            weapon: "Waterpipe Shotgun (Handmade Shell)",
            lost: "Tier 2 Kit + 600 Scrap + 1 Red Keycard",
            rage: 94
        },
        {
            title: "LANDMINE IN HIGH GRASS OUTSIDE COMPOUND",
            attacker: "World Entity [Landmine]",
            dmg: "125.0 dmg",
            weapon: "Explosive Landmine",
            lost: "Full Metal Kit + AK-47 + 4 Syringes",
            rage: 99
        },
        {
            title: "MINICOPTER CRASH INTO HIGH VOLTAGE TOWER",
            attacker: "Physics Engine [Gravity]",
            dmg: "240.0 dmg",
            weapon: "High External Power Lines",
            lost: "2,000 Low Grade + 400 High Qual Metal",
            rage: 88
        },
        {
            title: "SNIPED BY ROOFCAMPER WHILE OPENING AIRLOCK",
            attacker: "Tower_Sniper_8x",
            dmg: "95.5 dmg",
            weapon: "L96 Sniper (High Velocity 5.56)",
            lost: "Entire base loot room due to open airlock",
            rage: 100
        },
        {
            title: "BEAR SPAWNED INSIDE YOUR RECYCLER ROOM",
            attacker: "Hostile Fauna [Giant Bear]",
            dmg: "110.0 dmg",
            weapon: "Bear Claws",
            lost: "30 Gears + 150 High Qual from recycling",
            rage: 76
        }
    ];

    if (deathForm) {
        deathForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const scenario = deathScenarios[Math.floor(Math.random() * deathScenarios.length)];

            deathCauseTitle.textContent = scenario.title;
            logLine1.textContent = `Attacker [${scenario.attacker}] hit player (${scenario.dmg})`;
            logLine2.textContent = `Weapon: ${scenario.weapon}`;
            logLine3.textContent = `Loot Lost: ${scenario.lost}`;

            rageMeterFill.style.width = `${scenario.rage}%`;
            ragePercentVal.textContent = `${scenario.rage}% Chance of Desk Slam`;

            showToast("Combat Autopsy Generated!", 'danger');
        });
    }

    /* ==========================================================================
       10. How Cooked Am I? (Cooked Meter)
       ========================================================================== */
    const calcCookedBtn = document.getElementById('calculate-cooked-btn');
    const cookedChecks = document.querySelectorAll('.cooked-check');
    const cookedScoreDisplay = document.getElementById('cooked-score-display');
    const cookedTitle = document.getElementById('cooked-title');
    const cookedBarFill = document.getElementById('cooked-bar-fill');
    const evalTitle = document.getElementById('eval-title');
    const evalText = document.getElementById('eval-text');
    const evalPrescription = document.getElementById('eval-prescription');

    if (calcCookedBtn) {
        calcCookedBtn.addEventListener('click', () => {
            let totalWeight = 0;
            let checkedCount = 0;

            cookedChecks.forEach(cb => {
                if (cb.checked) {
                    totalWeight += parseInt(cb.getAttribute('data-weight'), 10) || 10;
                    checkedCount++;
                }
            });

            // Add slight randomness
            if (checkedCount > 0) {
                totalWeight += Math.floor(Math.random() * 10);
            }
            const finalScore = Math.min(100, totalWeight);

            cookedScoreDisplay.textContent = `${finalScore}%`;
            cookedBarFill.style.width = `${finalScore}%`;

            if (finalScore >= 80) {
                cookedTitle.textContent = "DEEP FRIED & BURNT TO ASH";
                evalTitle.textContent = "Terminal Severity Level";
                evalText.textContent = "You made every single mistake in the survival handbook. Your base coordinates are already circulating on Discord. Expect no mercy.";
                evalPrescription.innerHTML = "<strong>Survival Prescription:</strong> Stash your guns in a bush and prepare to switch servers.";
                cookedScoreDisplay.style.color = "#EF4444";
            } else if (finalScore >= 45) {
                cookedTitle.textContent = "WELL DONE (HIGH HEAT)";
                evalTitle.textContent = "Moderate Severity Danger";
                evalText.textContent = "You're slipping up. A few careless moments are giving neighbors the exact angle they need to raid you.";
                evalPrescription.innerHTML = "<strong>Survival Prescription:</strong> Upgrade internal door frames and check TC upkeep immediately.";
                cookedScoreDisplay.style.color = "#F59E0B";
            } else if (finalScore > 0) {
                cookedTitle.textContent = "MEDIUM RARE";
                evalTitle.textContent = "Minor Vulnerability";
                evalText.textContent = "Manageable blunders. Fix your locks, avoid unnecessary beef in chat, and you should make it to tomorrow.";
                evalPrescription.innerHTML = "<strong>Survival Prescription:</strong> Put code locks on all outer containers and keep airlocks shut.";
                cookedScoreDisplay.style.color = "#38BDF8";
            } else {
                cookedTitle.textContent = "RAW & CHILLING";
                evalTitle.textContent = "Immaculate Discipline";
                evalText.textContent = "Zero blunders committed. You are playing like a calculated survivor.";
                evalPrescription.innerHTML = "<strong>Survival Prescription:</strong> Keep your head down and let other bases get raided first.";
                cookedScoreDisplay.style.color = "#10B981";
            }

            showToast(`Cooked Index: ${finalScore}%!`, finalScore > 60 ? 'hazard' : 'info');
        });
    }

    /* ==========================================================================
       11. Share & Copy Quick Actions
       ========================================================================== */
    const brandLogo = document.getElementById('brand-logo');
    if (brandLogo) {
        brandLogo.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            copyToClipboard(window.location.href, "App link copied to clipboard!");
        });
    }

    console.log("Will I Get Offlined? v1 - Engine Initialized for XSANE Rust Mobile.");
});