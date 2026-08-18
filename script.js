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
        { label: "Roof Camper", co
