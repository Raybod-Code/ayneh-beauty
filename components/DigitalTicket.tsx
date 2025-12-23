"use client";

import { forwardRef } from "react";
import { Scissors, Calendar, Clock, User, MapPin, QrCode } from "lucide-react";

interface TicketProps {
  data: {
    name: string;
    service: string;
    date: string;
    time: string;
    stylist: string;
    bookingId: string;
  };
}

export const DigitalTicket = forwardRef<HTMLDivElement, TicketProps>(({ data }, ref) => {
  return (
    <div 
      ref={ref}
      id="digital-ticket-id"
      className="relative overflow-hidden font-sans"
      // ✅ استایل‌های حیاتی برای html2canvas
      style={{ 
        width: '800px', 
        height: '350px', 
        backgroundColor: '#050505', // پس‌زمینه مشکی خالص
        color: '#ffffff',           // ✅ اجبار رنگ متن به سفید
        borderRadius: '24px',
        display: 'flex',
        border: '1px solid #333',
        fontFamily: 'system-ui, sans-serif'
      }}
    >
      {/* بخش اصلی (چپ) */}
      <div style={{ flex: '1', padding: '30px', position: 'relative', borderRight: '2px dashed #333', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        
        {/* پس‌زمینه تزئینی */}
        <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: '#C6A87C', opacity: '0.05', borderRadius: '50%', filter: 'blur(50px)' }} />
        
        {/* هدر */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', background: '#C6A87C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Scissors size={20} color="black" />
              </div>
              <div>
                 <h2 style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '2px', lineHeight: '1', color: '#ffffff', margin: 0 }}>AYNEH</h2>
                 <p style={{ fontSize: '8px', color: '#C6A87C', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>Beauty Lounge</p>
              </div>
           </div>
           <div style={{ textAlign: 'right' }}>
              <span style={{ display: 'block', fontSize: '10px', color: '#888', letterSpacing: '1px' }}>BOOKING ID</span>
              <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#C6A87C', fontWeight: 'bold' }}>#{data.bookingId}</span>
           </div>
        </div>

        {/* اطلاعات اصلی */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
           <div>
              <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>GUEST NAME</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{data.name}</p>
           </div>
           <div>
              <p style={{ fontSize: '10px', color: '#888', textTransform: 'uppercase', marginBottom: '5px' }}>SERVICE</p>
              <p style={{ fontSize: '16px', color: '#C6A87C', fontWeight: 'bold', margin: 0 }}>{data.service}</p>
           </div>
        </div>

        {/* فوتر اطلاعات */}
        <div style={{ display: 'flex', gap: '30px', marginTop: 'auto', paddingTop: '20px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} color="#888" />
              <div>
                 <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>DATE</p>
                 <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{data.date}</p>
              </div>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="#888" />
              <div>
                 <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>TIME</p>
                 <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{data.time}</p>
              </div>
           </div>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={16} color="#888" />
              <div>
                 <p style={{ fontSize: '9px', color: '#888', margin: 0 }}>STYLIST</p>
                 <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{data.stylist}</p>
              </div>
           </div>
        </div>
      </div>

      {/* بخش جداکننده (Stub - راست) */}
      <div style={{ width: '220px', background: '#0a0a0a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', borderLeft: '2px dashed #333' }}>
         <div style={{ position: 'absolute', top: '-12px', left: '-12px', width: '24px', height: '24px', background: '#050505', borderRadius: '50%' }} />
         <div style={{ position: 'absolute', bottom: '-12px', left: '-12px', width: '24px', height: '24px', background: '#050505', borderRadius: '50%' }} />
         
         <div style={{ marginBottom: '20px', padding: '12px', background: 'white', borderRadius: '12px' }}>
            <QrCode size={80} color="black" />
         </div>
         
         <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '10px', color: '#666', marginBottom: '5px', letterSpacing: '1px' }}>SCAN TO CHECK-IN</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', color: '#C6A87C', fontSize: '10px' }}>
               <MapPin size={10} color="#C6A87C" />
               <span style={{ color: '#C6A87C' }}>Shiraz, VIP Lounge</span>
            </div>
         </div>
      </div>
    </div>
  );
});

DigitalTicket.displayName = "DigitalTicket";