// ไฟล์: features/notificationFeature.js
const { useState, useEffect } = React;

const NotificationService = {
    requestPermission: async () => {
        if (!("Notification" in window)) {
            alert("อุปกรณ์หรือบราวเซอร์นี้ไม่รองรับการแจ้งเตือนครับ");
            return false;
        }
        const permission = await Notification.requestPermission();
        return permission === "granted";
    },
    checkPermission: () => {
        if (!("Notification" in window)) return false;
        return Notification.permission === "granted";
    },
    notifyUser: (title, body) => {
        if (Notification.permission === "granted" && navigator.serviceWorker) {
            navigator.serviceWorker.ready.then(registration => {
                registration.active.postMessage({
                    type: 'SHOW_NOTIFICATION',
                    title: title,
                    body: body
                });
            });
        }
    }
};

const NotificationToggle = ({ dueCount }) => {
    const [isGranted, setIsGranted] = useState(NotificationService.checkPermission());

    const handleToggle = async () => {
        if (!isGranted) {
            const granted = await NotificationService.requestPermission();
            setIsGranted(granted);
            if (granted) {
                NotificationService.notifyUser("✅ เปิดแจ้งเตือนสำเร็จ!", "แอปจะคอยเตือนให้คุณมาทบทวนประโยค 3 เวลา (เช้า เที่ยง เย็น) ครับ");
            } else {
                alert("คุณปฏิเสธการแจ้งเตือน (สามารถเปิดได้ในตั้งค่าบราวเซอร์)");
            }
        } else {
            alert("✅ คุณเปิดการแจ้งเตือนไว้แล้วครับ");
        }
    };

    // Logic กระตุ้นแจ้งเตือน 3 เวลา (08:00, 13:00, 20:00)
    useEffect(() => {
        if (!isGranted || dueCount === 0) return;

        const checkTime = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            // ถ้าถึงเวลาเป๊ะๆ ให้เด้งเตือน
            if ((h === 8 || h === 13 || h === 20) && m === 0) {
                NotificationService.notifyUser("⏰ ถึงเวลาทบทวนแล้ว!", `เมฆ! คุณมี ${dueCount} ประโยคที่รอทบทวนอยู่ เข้ามาเคลียร์กันเลย!`);
            }
        };

        const interval = setInterval(checkTime, 60000); // เช็คเวลาทุกๆ 1 นาที
        return () => clearInterval(interval);
    }, [isGranted, dueCount]);

    return (
        <button 
            onClick={handleToggle} 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition-colors border ${isGranted ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'}`}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            {isGranted ? "แจ้งเตือนทำงาน 🔔" : "เปิดแจ้งเตือน"}
        </button>
    );
};

window.ESB_Features = window.ESB_Features || {};
window.ESB_Features.NotificationToggle = NotificationToggle;

