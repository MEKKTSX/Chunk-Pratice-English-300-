const { useState, useEffect, useRef, useMemo } = React;

// --- ICONS ---
const IconBase = ({ children, size = 24, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{children}</svg>
);
const BookOpen = (p) => <IconBase {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></IconBase>;
const ToggleLeft = (p) => <IconBase {...p}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="8" cy="12" r="2"/></IconBase>;
const ToggleRight = (p) => <IconBase {...p}><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></IconBase>;
const ChevronDown = (p) => <IconBase {...p}><path d="m6 9 6 6 6-6"/></IconBase>;
const ChevronUp = (p) => <IconBase {...p}><path d="m18 15-6-6-6 6"/></IconBase>;
const ArrowRightLeft = (p) => <IconBase {...p}><path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/></IconBase>;
const Brain = (p) => <IconBase {...p}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></IconBase>;
const Circle = (p) => <IconBase {...p}><circle cx="12" cy="12" r="10"/></IconBase>;
const CheckCircle = (p) => <IconBase {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></IconBase>;
const X = (p) => <IconBase {...p}><path d="M18 6 6 18"/><path d="m6 6 18 18"/></IconBase>;
const RotateCcw = (p) => <IconBase {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12"/><path d="M3 3v9h9"/></IconBase>;
const Play = (p) => <IconBase {...p}><polygon points="5 3 19 12 5 21 5 3"/></IconBase>;
const Folder = (p) => <IconBase {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></IconBase>;
const FolderOpen = (p) => <IconBase {...p}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path><line x1="2" y1="12" x2="22" y2="12"></line></IconBase>;
const BarChart2 = (p) => <IconBase {...p}><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></IconBase>;
const Download = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></IconBase>;
const Upload = (p) => <IconBase {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></IconBase>;

// --- HELPER FUNCTIONS ---
function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// SRS Algorithm (SM-2 Inspired)
const calculateSRS = (cardData, rating) => {
    let { interval = 0, ease = 2.5, step = 0 } = cardData || {};
    if (rating === 'again') {
        step = 0; interval = 0; ease = Math.max(1.3, ease - 0.2);
    } else if (rating === 'good') {
        if (step === 0) { interval = 1; step = 1; } 
        else { interval = Math.max(1, Math.round(interval * ease)); }
    } else if (rating === 'easy') {
        if (step === 0) { interval = 4; step = 1; } 
        else { ease += 0.15; interval = Math.max(4, Math.round(interval * ease * 1.3)); }
    }
    
    const now = new Date();
    let nextReview;
    if (interval === 0) {
        nextReview = now.getTime() + 10 * 60 * 1000;
    } else {
        const nextDate = new Date(now.getTime());
        nextDate.setDate(nextDate.getDate() + interval);
        nextDate.setHours(4, 0, 0, 0); 
        nextReview = nextDate.getTime();
    }
    return { interval, ease, step, nextReview };
};

const getProjectedIntervals = (cardData) => {
    const { ease = 2.5, step = 0, interval = 0 } = cardData || {};
    const againStr = "< 10 นาที";
    let goodInt = step === 0 ? 1 : Math.round(interval * ease);
    const goodStr = goodInt === 1 ? "พรุ่งนี้" : `${goodInt} วัน`;
    let easyInt = step === 0 ? 4 : Math.round(interval * (ease + 0.15) * 1.3);
    const easyStr = `${easyInt} วัน`;
    return { againStr, goodStr, easyStr };
};

// --- COMPONENTS ---
const SentenceCard = ({ sentence, globalShow, primaryLang, index, resetCount, selectionMode, isSelected, onToggleSelect }) => {
    const [localShow, setLocalShow] = useState(false);
    const show = globalShow || localShow;
    useEffect(() => { setLocalShow(false); }, [resetCount]);

    const isEnPrimary = primaryLang === 'en';
    const mainText = isEnPrimary ? sentence.en : sentence.th;
    const hiddenText = isEnPrimary ? sentence.th : sentence.en;
    const hintText = isEnPrimary ? "Tap to translate" : "แตะเพื่อดูภาษาอังกฤษ";

    const handleClick = () => { selectionMode ? onToggleSelect() : setLocalShow(!localShow); };

    return (
        <div className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer card-tap-active ${show && !selectionMode ? 'bg-white border-blue-200 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`} onClick={handleClick}>
            {selectionMode && (
                <div className="absolute top-4 right-4 text-blue-600">
                    {isSelected ? <CheckCircle size={24} className="fill-blue-100" /> : <Circle size={24} className="text-gray-300" />}
                </div>
            )}
            <div className="flex items-start pr-8">
                <span className="text-xs font-bold opacity-50 mr-2 mt-1.5 min-w-[24px] text-right">{index + 1}.</span>
                <div className={`font-semibold text-gray-800 text-lg mb-2 leading-tight flex-1 ${selectionMode ? 'select-none' : ''}`}>{mainText}</div>
            </div>
            <div className={`text-base text-blue-600 transition-opacity duration-300 font-medium leading-tight pl-8 ${show && !selectionMode ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {hiddenText}
            </div>
            {!show && !selectionMode && <div className="text-xs text-gray-400 mt-2 font-light italic flex items-center gap-1 pl-8"><span className="w-1 h-1 bg-gray-400 rounded-full inline-block"></span> {hintText}</div>}
        </div>
    );
};

const CategorySection = ({ category, globalShow, primaryLang, resetCount, startOffset, selectionMode, selectedIds, onToggleItem, onSelectAll }) => {
    const [isOpen, setIsOpen] = useState(true);
    const categorySentenceIds = category.sentences.map((_, idx) => startOffset + idx);
    const isAllSelected = categorySentenceIds.every(id => selectedIds.has(id));

    return (
        <div className="mb-8">
            <div className={`sticky top-[135px] z-10 flex items-center justify-between p-3 rounded-lg shadow-sm mb-4 cursor-pointer select-none backdrop-blur-sm bg-opacity-95 ${category.color} transition-all`} onClick={() => setIsOpen(!isOpen)}>
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold flex items-center"><span className="mr-2 opacity-70 text-xs">#{category.id}</span>{category.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                    {selectionMode && isOpen && (
                        <button onClick={(e) => { e.stopPropagation(); onSelectAll(categorySentenceIds, !isAllSelected); }} className="text-xs font-bold bg-white/50 hover:bg-white/80 px-2 py-1 rounded text-current border border-current/20">
                            {isAllSelected ? 'Unselect' : 'Select All'}
                        </button>
                    )}
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
            </div>
            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 px-1">
                    {category.sentences.map((s, idx) => {
                        const globalId = startOffset + idx;
                        return <SentenceCard key={idx} index={globalId} sentence={s} globalShow={globalShow} primaryLang={primaryLang} resetCount={resetCount} selectionMode={selectionMode} isSelected={selectedIds.has(globalId)} onToggleSelect={() => onToggleItem(globalId)} />;
                    })}
                </div>
            )}
        </div>
    );
};

const SessionGroup = ({ session, globalShow, primaryLang, resetCount, startOffset, selectionMode, selectedIds, onToggleItem, onSelectAll }) => {
    const [isOpen, setIsOpen] = useState(session.defaultOpen);
    let localCounter = 0;
    return (
        <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
            <div onClick={() => setIsOpen(!isOpen)} className="p-5 flex items-center justify-between cursor-pointer bg-gray-50 hover:bg-gray-100 border-b border-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>{isOpen ? <FolderOpen size={24} /> : <Folder size={24} />}</div>
                    <div><h2 className="text-xl font-bold text-gray-800">{session.title}</h2><p className="text-sm text-gray-500">{session.data.length} Categories</p></div>
                </div>
                {isOpen ? <ChevronUp size={24} className="text-gray-400" /> : <ChevronDown size={24} className="text-gray-400" />}
            </div>
            {isOpen && (
                <div className="p-4 bg-white/50">
                    {session.data.map((category) => {
                        const currentCategoryOffset = startOffset + localCounter;
                        localCounter += category.sentences.length;
                        return <CategorySection key={category.id} category={category} globalShow={globalShow} primaryLang={primaryLang} resetCount={resetCount} startOffset={currentCategoryOffset} selectionMode={selectionMode} selectedIds={selectedIds} onToggleItem={onToggleItem} onSelectAll={onSelectAll} />;
                    })}
                </div>
            )}
        </div>
    )
}

// --- QUIZ VIEW (พร้อมระบบ TTS ลำโพง) ---
const QuizView = ({ quizQueue, onClose, quizLang, quizMode, onSaveSRS, srsData }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const startXRef = useRef(0);
    const cardRef = useRef(null);

    // 💡 ดึงปลั๊กอินลำโพงมาใช้ (ถ้าโหลดไฟล์ไว้แล้ว)
    const Speaker = window.ESB_Features?.Speaker;

    const currentCard = quizQueue[currentIndex];
    const nextCard = quizQueue[currentIndex + 1] || null;

    const isEnPrimary = quizLang === 'en';
    const question = isEnPrimary ? currentCard.en : currentCard.th;
    const answer = isEnPrimary ? currentCard.th : currentCard.en;

    const currentCardSRS = srsData[currentCard.uniqueId];
    const { againStr, goodStr, easyStr } = getProjectedIntervals(currentCardSRS);

    const getFontSizeClass = (text, isPrimary) => {
        const length = text.length;
        if (isPrimary) {
            if (length > 120) return "text-lg md:text-xl";
            if (length > 80) return "text-xl md:text-2xl";
            if (length > 40) return "text-2xl md:text-3xl";
            return "text-3xl md:text-4xl";
        } else {
            if (length > 120) return "text-base md:text-lg";
            if (length > 80) return "text-lg md:text-xl";
            if (length > 40) return "text-xl md:text-2xl";
            return "text-2xl md:text-3xl";
        }
    };

    const handleNext = () => {
        if (currentIndex < quizQueue.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setShowAnswer(false);
            setDragX(0);
        } else {
            onClose(); 
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setShowAnswer(false);
            setDragX(0);
        }
    };

    const handleSRSRating = (e, rating) => {
        e.stopPropagation();
        onSaveSRS(currentCard.uniqueId, rating);
        handleNext();
    };

    const onStart = (e) => { setIsDragging(true); startXRef.current = e.touches ? e.touches[0].clientX : e.clientX; };
    const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        setDragX(clientX - startXRef.current);
    };
    const onEnd = () => {
        setIsDragging(false);
        if (quizMode === 'srs') { setDragX(0); return; }
        if (dragX < -100) { if (currentIndex < quizQueue.length - 1) handleNext(); else setDragX(0); } 
        else if (dragX > 100) { if (currentIndex > 0) handlePrev(); else setDragX(0); } 
        else { setDragX(0); }
    };

    const cardStyle = isDragging ? { transform: `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`, opacity: 1, cursor: 'grabbing' } : { transform: `translateX(0) rotate(0)`, cursor: 'grab' };
    
    let bgHint = "";
    if (isDragging && quizMode === 'drill') {
        if (dragX < -50) bgHint = "bg-gray-100"; if (dragX > 50) bgHint = "bg-gray-100"; 
    }

    return (
        <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col h-full w-full overflow-hidden">
            <div className="bg-white px-4 py-3 shadow-sm flex items-center justify-between z-10 shrink-0">
                <div className={`flex items-center gap-2 font-bold ${quizMode === 'srs' ? 'text-indigo-700' : 'text-blue-600'}`}>
                    <Brain size={24} />
                    <span>{quizMode === 'srs' ? 'SRS Assessment' : 'Daily Drill'}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 border border-gray-200 ml-2 font-bold uppercase">{quizLang}</span>
                </div>
                <div className="text-sm font-medium text-gray-500">{currentIndex + 1} / {quizQueue.length}</div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
            </div>

            <div className={`flex-1 flex items-center justify-center p-4 md:p-6 relative ${bgHint} transition-colors duration-300 overflow-hidden`}>
                {nextCard && (
                    <div className="absolute w-[85%] md:w-[60%] lg:w-[40%] h-[75%] bg-white rounded-2xl shadow-sm border border-gray-200 card-stack-effect flex items-center justify-center">
                        <span className="text-gray-300 font-bold text-4xl">...</span>
                    </div>
                )}
                <div 
                    ref={cardRef}
                    className={`quiz-card bg-white w-[95%] sm:w-[90%] md:w-[65%] lg:w-[45%] h-[75%] max-h-[600px] rounded-2xl shadow-xl border flex flex-col select-none overflow-hidden ${quizMode === 'srs' ? 'border-indigo-100 shadow-indigo-100/50' : 'border-gray-100'}`}
                    style={cardStyle}
                    onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
                    onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
                    onClick={() => { if(!isDragging) setShowAnswer(!showAnswer); }}
                >
                    <div className="w-full pt-4 pb-2 text-center shrink-0">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${quizMode === 'srs' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'}`}>
                            #{currentCard.originalIndex + 1}
                        </span>
                    </div>

                    <div className="flex-1 w-full overflow-y-auto px-4 md:px-8 flex flex-col" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        <div className="my-auto py-2 flex flex-col items-center justify-center">
                            
                            {/* --- โซนคำถาม --- */}
                            <div className="flex items-center justify-center gap-2">
                                <h3 className={`${getFontSizeClass(question, true)} text-center font-bold text-gray-800 leading-snug break-words transition-all duration-300`}>
                                    {question}
                                </h3>
                                {/* ลำโพงสำหรับคำถาม (ถ้าเป็น EN) */}
                                {isEnPrimary && Speaker && <Speaker text={question} />}
                            </div>

                            {/* --- โซนคำตอบ --- */}
                            <div className={`transition-all duration-300 w-full flex flex-col items-center justify-center ${showAnswer ? 'opacity-100 mt-6' : 'opacity-0 h-0 overflow-hidden mt-0'}`}>
                                <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 shrink-0"></div>
                                <div className="flex items-center justify-center gap-2">
                                    <p className={`${getFontSizeClass(answer, false)} text-center ${quizMode === 'srs' ? 'text-indigo-600' : 'text-blue-600'} font-medium break-words`}>
                                        {answer}
                                    </p>
                                    {/* ลำโพงสำหรับคำตอบ (ถ้าเป็น EN) */}
                                    {!isEnPrimary && Speaker && <Speaker text={answer} />}
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="w-full shrink-0 px-4 pb-4 pt-2 bg-gradient-to-t from-white via-white to-transparent">
                        {quizMode === 'srs' && showAnswer ? (
                            <div className="grid grid-cols-3 gap-1.5 md:gap-2 w-full">
                                <button onClick={(e) => handleSRSRating(e, 'again')} className="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-xl bg-rose-50 text-rose-600 active:bg-rose-100 transition-colors border border-rose-100">
                                    <span className="text-xs md:text-sm font-bold leading-none">ลืม/ยาก</span>
                                    <span className="text-[10px] opacity-70 mt-1.5 leading-none">{againStr}</span>
                                </button>
                                <button onClick={(e) => handleSRSRating(e, 'good')} className="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-xl bg-emerald-50 text-emerald-600 active:bg-emerald-100 transition-colors border border-emerald-100">
                                    <span className="text-xs md:text-sm font-bold leading-none">พอจำได้</span>
                                    <span className="text-[10px] opacity-70 mt-1.5 leading-none">{goodStr}</span>
                                </button>
                                <button onClick={(e) => handleSRSRating(e, 'easy')} className="flex flex-col items-center justify-center py-2.5 md:py-3 rounded-xl bg-blue-50 text-blue-600 active:bg-blue-100 transition-colors border border-blue-100">
                                    <span className="text-xs md:text-sm font-bold leading-none">ง่ายมาก</span>
                                    <span className="text-[10px] opacity-70 mt-1.5 leading-none">{easyStr}</span>
                                </button>
                            </div>
                        ) : (
                            <div className="text-gray-300 text-sm animate-pulse h-12 flex items-center justify-center pointer-events-none">
                                {showAnswer ? "Swipe Left/Right" : "Tap to Flip"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {quizMode === 'drill' && (
                <div className="bg-white p-6 pb-10 border-t flex items-center justify-center gap-8 z-10 shrink-0">
                    <button onClick={handlePrev} disabled={currentIndex === 0} className="p-4 rounded-full bg-gray-100 text-gray-600 disabled:opacity-30 active:scale-95 transition-transform"><RotateCcw size={24} /></button>
                    <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Swipe or Click</div>
                    <button onClick={handleNext} disabled={currentIndex === quizQueue.length - 1} className="p-4 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 disabled:opacity-50 active:scale-95 transition-transform"><Play size={24} className="ml-1" /></button>
                </div>
            )}
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
    const SessionData = window.ESB_Sessions || [];
    
    const ResetFeatureButton = window.ESB_Features?.ResetButton || null;
    const NotificationToggle = window.ESB_Features?.NotificationToggle || null;
    
    const [srsData, setSrsData] = useState(() => {
        const saved = localStorage.getItem('esb_srs_data');
        return saved ? JSON.parse(saved) : {};
    });

    useEffect(() => {
        localStorage.setItem('esb_srs_data', JSON.stringify(srsData));
    }, [srsData]);

    const [globalShow, setGlobalShow] = useState(false);
    const [primaryLang, setPrimaryLang] = useState('th'); 
    const [resetCount, setResetCount] = useState(0); 
    const [showStats, setShowStats] = useState(false); 

    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [quizQueue, setQuizQueue] = useState(null); 
    const [quizLang, setQuizLang] = useState('th'); 
    const [quizMode, setQuizMode] = useState('drill'); 
    
    const allSentencesFlat = useMemo(() => {
        const flat = [];
        let globalIndex = 0;
        SessionData.forEach(session => {
            session.data.forEach(cat => {
                cat.sentences.forEach((s, idx) => {
                    const uniqueId = `${cat.id}-${idx}`; 
                    flat.push({ ...s, originalIndex: globalIndex, uniqueId });
                    globalIndex++;
                });
            });
        });
        return flat;
    }, [SessionData]);

    const dueCards = useMemo(() => {
        const now = Date.now();
        return allSentencesFlat.filter(card => {
            const data = srsData[card.uniqueId];
            return data && data.nextReview <= now;
        });
    }, [allSentencesFlat, srsData]);

    const memoryStats = useMemo(() => {
        let total = allSentencesFlat.length;
        let unseen = total;
        let learning = 0;
        let mastered = 0;
        
        Object.values(srsData).forEach(card => {
            unseen--;
            if (card.interval >= 21) mastered++; 
            else learning++;
        });
        return { total, unseen, learning, mastered };
    }, [allSentencesFlat, srsData]);

    const toggleLang = () => { setPrimaryLang(prev => prev === 'en' ? 'th' : 'en'); setGlobalShow(false); setResetCount(prev => prev + 1); };
    const handleGlobalToggle = () => { const newShowState = !globalShow; setGlobalShow(newShowState); if (!newShowState) setResetCount(prev => prev + 1); };
    const toggleSelectionMode = () => { setSelectionMode(!selectionMode); setGlobalShow(false); setResetCount(prev => prev + 1); };
    
    const toggleItemSelection = (globalId) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(globalId)) newSet.delete(globalId); else newSet.add(globalId);
        setSelectedIds(newSet);
    };

    const handleSelectAllCategory = (ids, shouldSelect) => {
        const newSet = new Set(selectedIds);
        ids.forEach(id => { if (shouldSelect) newSet.add(id); else newSet.delete(id); });
        setSelectedIds(newSet);
    };

    const startQuiz = (cardsArray, mode) => {
        if (!cardsArray || cardsArray.length === 0) return;
        const shuffled = shuffleArray(cardsArray);
        setQuizQueue(shuffled);
        setQuizMode(mode);
    };

    const handleSaveSRS = (uniqueId, rating) => {
        setSrsData(prev => {
            const cardData = prev[uniqueId] || {};
            const newSRS = calculateSRS(cardData, rating);
            return { ...prev, [uniqueId]: newSRS };
        });
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(srsData));
        const dlNode = document.createElement('a');
        dlNode.setAttribute("href", dataStr);
        dlNode.setAttribute("download", `ESB_Backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(dlNode);
        dlNode.click();
        dlNode.remove();
    };

    const fileInputRef = useRef(null);
    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            try {
                const importedData = JSON.parse(evt.target.result);
                if (window.confirm("การนำเข้าข้อมูลจะเขียนทับข้อมูลเดิมทั้งหมด คุณแน่ใจหรือไม่?")) {
                    setSrsData(importedData);
                    alert("✅ นำเข้าข้อมูลสำเร็จ!");
                }
            } catch (err) {
                alert("❌ ไฟล์ไม่ถูกต้อง กรุณาอัปโหลดไฟล์ JSON ที่ได้จากการ Export เท่านั้น");
            }
        };
    };

    let globalOffset = 0;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
            {quizQueue && (
                <QuizView 
                    quizQueue={quizQueue} 
                    onClose={() => setQuizQueue(null)} 
                    quizLang={quizLang}
                    quizMode={quizMode}
                    onSaveSRS={handleSaveSRS}
                    srsData={srsData}
                />
            )}

            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between h-[64px]">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
                    <BookOpen className="text-indigo-600" size={24} />
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden md:block">English Sentence Bank</h1>
                    <h1 className="text-xl font-bold tracking-tight text-gray-900 md:hidden">ESB Thai</h1>
                </div>

                <div className="flex gap-2 items-center">
                    <button onClick={toggleSelectionMode} className={`p-2 rounded-full transition-all border ${selectionMode ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-100'}`} title="Quiz Selection Mode">
                        <Brain size={20} />
                    </button>
                    <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-2 rounded-full font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-100 border border-gray-200">
                        <ArrowRightLeft size={16} /> <span className="font-bold">{primaryLang === 'en' ? 'EN' : 'TH'}</span>
                    </button>
                    <button onClick={handleGlobalToggle} disabled={selectionMode} className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all text-sm md:text-base border ${globalShow ? 'bg-indigo-600 text-white border-transparent shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'} ${selectionMode ? 'opacity-30 cursor-not-allowed' : ''}`}>
                        {globalShow ? (<> <ToggleRight size={20} /> <span className="hidden xs:inline">Hide</span> </>) : (<> <ToggleLeft size={20} /> <span className="hidden xs:inline">Show All</span> <span className="xs:hidden">Show</span> </>)}
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 pt-6 pb-32">
                
                {!selectionMode && (
                    <div className="mb-8">
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-lg relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none"><Brain size={140} /></div>
                            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                                        <span className="text-yellow-300">☀️</span> Daily SRS Review
                                    </h2>
                                    <p className="text-indigo-100 text-sm">
                                        {dueCards.length > 0 
                                            ? `มี ${dueCards.length} ประโยคที่ถึงเวลาทบทวนเพื่อย้ายเข้าสู่ความจำระยะยาว` 
                                            : `คุณทบทวนของวันนี้ครบหมดแล้ว ยอดเยี่ยมมาก!`}
                                    </p>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button onClick={() => setShowStats(!showStats)} className="p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/20">
                                        <BarChart2 size={20} />
                                    </button>
                                    <button 
                                        onClick={() => startQuiz(dueCards, 'srs')}
                                        disabled={dueCards.length === 0}
                                        className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold shadow-md transition-all whitespace-nowrap ${dueCards.length > 0 ? 'bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95' : 'bg-white/20 text-white/50 cursor-not-allowed border border-white/20 shadow-none'}`}
                                    >
                                        {dueCards.length > 0 ? `Start Review (${dueCards.length})` : 'All Cleared! 🎉'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className={`transition-all duration-300 overflow-hidden ${showStats ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <BarChart2 size={18} className="text-indigo-500"/> ความก้าวหน้าของคุณ (Progress)
                                </h3>
                                
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                                        <div className="text-2xl font-bold text-gray-400">{memoryStats.unseen}</div>
                                        <div className="text-xs text-gray-500 font-medium mt-1">ยังไม่เริ่ม (Unseen)</div>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                                        <div className="text-2xl font-bold text-blue-600">{memoryStats.learning}</div>
                                        <div className="text-xs text-blue-600 font-medium mt-1">กำลังเรียน (Learning)</div>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                                        <div className="text-2xl font-bold text-emerald-600">{memoryStats.mastered}</div>
                                        <div className="text-xs text-emerald-600 font-medium mt-1">จำได้ขึ้นใจ (Mastered)</div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 border-t border-gray-100 pt-4">
                                    <button onClick={handleExport} className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors">
                                        <Download size={16} /> สำรองข้อมูล (Export JSON)
                                    </button>
                                    <label className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer">
                                        <Upload size={16} /> กู้คืนข้อมูล (Import)
                                        <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
                                    </label>
                    
                                        {/* ดึงปุ่มแจ้งเตือนมาแสดง พร้อมส่งข้อมูลจำนวนการ์ดที่ค้างอยู่ไปให้มัน */}
                                        {NotificationToggle && <NotificationToggle dueCount={dueCards.length} />}
                                        {/* ปุ่ม Reset เดิม */}
                                        {ResetFeatureButton && <ResetFeatureButton />}
                    

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {selectionMode && (
                    <div className="mb-6 p-4 rounded-xl border text-center shadow-sm backdrop-blur-md bg-opacity-95 bg-indigo-50 border-indigo-200">
                        <p className="text-indigo-800 font-bold mb-1">โหมดเลือกข้อสอบเพื่อฝึกฝน</p>
                        <p className="text-indigo-600 text-sm">ติ๊กเลือกประโยคใหม่ๆ เพื่อทำ Daily Drill หรือเพิ่มเข้าสู่ระบบ SRS</p>
                    </div>
                )}

                {SessionData.map((session) => {
                    const sessionStartOffset = globalOffset;
                    session.data.forEach(cat => globalOffset += cat.sentences.length);
                    return <SessionGroup key={session.id} session={session} globalShow={globalShow} primaryLang={primaryLang} resetCount={resetCount} startOffset={sessionStartOffset} selectionMode={selectionMode} selectedIds={selectedIds} onToggleItem={toggleItemSelection} onSelectAll={handleSelectAllCategory} />;
                })}
            </div>
            
            {selectionMode && selectedIds.size > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-2 animate-bounce-in w-max max-w-[95vw]">
                    <div className="flex items-center bg-white p-1.5 rounded-full shadow-2xl border border-gray-200">
                        <div className="flex bg-gray-100 rounded-full p-1 shrink-0 mr-1">
                            <button onClick={() => setQuizLang('en')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${quizLang === 'en' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>EN</button>
                            <button onClick={() => setQuizLang('th')} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${quizLang === 'th' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>TH</button>
                        </div>
                        <button onClick={() => startQuiz(Array.from(selectedIds).map(id => allSentencesFlat[id]), 'drill')} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-gray-600 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors whitespace-nowrap">
                            Drill (Swipe)
                        </button>
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                        <button onClick={() => startQuiz(Array.from(selectedIds).map(id => allSentencesFlat[id]), 'srs')} className="bg-indigo-600 text-white px-3 sm:px-5 py-2 rounded-full font-bold flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-indigo-700 active:scale-95 transition-all whitespace-nowrap shadow-md shadow-indigo-200">
                            <Brain size={16} /> <span>Assess (SRS)</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
