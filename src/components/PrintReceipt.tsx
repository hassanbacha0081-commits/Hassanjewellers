import React, { forwardRef, useState, useEffect } from 'react';
import { Sale, Order, Repair, KarigarRecord, StockItem, GoldPurchase, db } from '../db';
import { formatDate } from '../lib/utils';
import { translations } from '../translations';
import { APP_CONFIG } from '../config';

interface PrintReceiptProps {
  type: 'sale' | 'order' | 'repair' | 'karigar' | 'stock' | 'purchase';
  data: Sale | Order | Repair | KarigarRecord | StockItem | GoldPurchase;
  id?: number;
}

export const PrintReceipt = forwardRef<HTMLDivElement, PrintReceiptProps>(({ type, data, id }, ref) => {
  const [shopSettings, setShopSettings] = useState({
    name: translations.ur.shopName,
    address: translations.ur.shopAddress,
    phone: translations.ur.shopPhone,
    phone2: translations.ur.shopPhone2
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const name = await db.settings.get('shopName');
      const address = await db.settings.get('shopAddress');
      const phone = await db.settings.get('shopPhone');
      const phone2 = await db.settings.get('shopPhone2');
      
      setShopSettings({
        name: name?.value || translations.ur.shopName,
        address: address?.value || translations.ur.shopAddress,
        phone: phone?.value || translations.ur.shopPhone,
        phone2: phone2?.value || translations.ur.shopPhone2
      });
    };
    fetchSettings();
  }, []);

  const isPurchase = type === 'purchase';
  const widthStr = isPurchase ? '21cm' : '14.8cm';
  const heightStr = isPurchase ? '29.7cm' : '21cm';

  const printStyles = (
    <style>
      {`
        @import url('https://fonts.cdnfonts.com/css/jameel-noori-nastaleeq');
        @import url('https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;700&family=Inter:wght@400;700&display=swap');
        
        @media print {
          @page {
            size: ${widthStr} ${heightStr};
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
            background: #ffffff !important;
          }
          .print-receipt-container {
            width: ${widthStr} !important;
            min-height: ${heightStr} !important;
            height: auto !important;
            overflow: visible !important;
            margin: 0 auto !important;
            padding: ${isPurchase ? '0.5cm 0.8cm 0.8cm 0.8cm' : '0.4cm 0.6cm 0.6cm 0.6cm'} !important;
            box-sizing: border-box !important;
            background: #ffffff !important;
            position: relative !important;
          }
        }
        .print-receipt-container {
          box-sizing: border-box !important;
          position: relative !important;
          background-color: #ffffff !important;
          color: #000000 !important;
        }
        .receipt-border-decor {
          position: absolute !important;
          top: 12px !important;
          bottom: 12px !important;
          left: 12px !important;
          right: 12px !important;
          border: 3.5px double #000000 !important;
          outline: 1px solid #000000 !important;
          outline-offset: -5px !important;
          border-radius: 6px !important;
          pointer-events: none !important;
          z-index: 99 !important;
        }
        .urdu-text {
          font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif !important;
          line-height: 1.6;
        }
        .header-section {
          text-align: center;
          border-bottom: 2px solid #000000;
          padding-bottom: ${isPurchase ? '10px' : '6px'};
          margin-bottom: ${isPurchase ? '20px' : '10px'};
          padding-top: 30px;
        }
        .shop-name {
          font-size: ${isPurchase ? '91px' : '74px'};
          font-weight: 900;
          color: #000000;
          margin: 0;
          margin-bottom: ${isPurchase ? '12px' : '6px'};
          font-family: 'Jameel Noori Nastaleeq', serif !important;
          line-height: 1.2;
        }
        .header-phone {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          margin-top: ${isPurchase ? '10px' : '6px'};
          width: 100%;
          flex-wrap: wrap;
        }
        .phone-brand-box, .phone-brand-box-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background-color: #dce7f3;
          padding: ${isPurchase ? '4px 12px' : '3px 8px'};
          border-radius: 4px;
          border: 1px solid #000000;
          line-height: normal;
        }
        .phone-brand-box-secondary {
          background-color: #dce7f3;
          border-color: #000000;
        }
        .phone-number {
          color: #000000;
          font-weight: 900;
          font-size: ${isPurchase ? '18px' : '14px'};
          letter-spacing: 0.5px;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .receipt-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: ${isPurchase ? '20px' : '12px'};
          border: 1.5px solid #000000;
          background-color: #ffffff !important;
        }
        .receipt-table th {
          background-color: #dce7f3 !important;
          color: #000000 !important;
          padding: ${isPurchase ? '12px 10px' : '8px 6px'};
          text-align: center;
          vertical-align: middle;
          border: 1.5px solid #000000 !important;
          font-size: ${isPurchase ? '17px' : '15px'};
          font-weight: bold;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          line-height: 1.5 !important;
        }
        .receipt-table td {
          background-color: #ffffff !important;
          padding: ${isPurchase ? '10px 10px' : '7px 8px'};
          text-align: right;
          vertical-align: middle;
          border: 1.5px solid #000000 !important;
          font-size: ${isPurchase ? '16px' : '14px'};
          color: #000000 !important;
          line-height: 1.5 !important;
        }
        .summary-table {
          width: ${isPurchase ? '320px' : '260px'};
          border: 1.5px solid #000000;
          border-radius: 4px;
          background-color: #ffffff !important;
          margin-bottom: ${isPurchase ? '20px' : '10px'};
          border-collapse: collapse;
          overflow: hidden;
        }
        .summary-table th, .summary-table td {
          border: 1px solid #000000;
          padding: ${isPurchase ? '8px 12px' : '5px 8px'};
          color: #000000 !important;
        }
        .summary-table th {
          background-color: #dce7f3 !important;
          text-align: right;
          font-weight: bold;
          width: 50%;
        }
        .summary-table td {
          background-color: #ffffff !important;
          text-align: right;
          font-weight: bold;
          width: 50%;
        }
        .final-total-row {
          border-top: 2px solid #000000 !important;
          font-size: ${isPurchase ? '20px' : '16px'} !important;
          color: #000000 !important;
        }
        .final-total-row th {
          background-color: #c9dbed !important;
          font-weight: 900 !important;
        }
        .final-total-row td {
          background-color: #ffffff !important;
          font-weight: 900 !important;
        }

        .terms {
          clear: both;
          margin-top: ${isPurchase ? '30px' : '12px'};
          font-size: ${isPurchase ? '12px' : '10px'};
          border-top: 1px solid #000000;
          padding-top: ${isPurchase ? '12px' : '6px'};
          line-height: ${isPurchase ? '1.7' : '1.5'};
          color: #000000;
        }

        .font-nastaliq {
          font-family: 'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif !important;
          line-height: 1.6 !important;
        }
      `}
    </style>
  );

  if (type === 'sale') {
    const sale = data as Sale;
    const oldGoldDeduction = Math.round(sale.items.reduce((a, b) => a + (b.t < 0 ? Math.abs(b.t) : 0), 0));
    const goldItems = sale.items.filter(item => item.t > 0);
    const goldAmount = Math.round(goldItems.reduce((sum, item) => sum + (item.w + item.mk) * item.r, 0));
    const mazdori = Math.round(goldItems.reduce((sum, item) => sum + (item.t - (item.w + item.mk) * item.r), 0));
    const totalBill = goldAmount + mazdori;

    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '14.8cm', 
        minHeight: '21cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.5cm 1cm 1cm 1cm',
        paddingBottom: '2cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '10px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '16px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Info Table */}
        <table className="receipt-table" style={{ marginBottom: '16px' }}>
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '15%' }}>کسٹمر</th>
              <td className="font-nastaliq" style={{ width: '35%', paddingRight: '12px', fontWeight: 'bold' }}>{sale.name}</td>
              <th className="font-nastaliq" style={{ width: '15%' }}>موبائل</th>
              <td style={{ width: '35%', fontFamily: 'monospace' }} dir="ltr">{sale.phone}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">تاریخ</th>
              <td>{sale.date}</td>
              <th className="font-nastaliq">بل نمبر</th>
              <td style={{ fontWeight: 'bold' }}>#{1000 + (id || 0)}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">ریٹ فی تولہ</th>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{(sale.items[0]?.r ? (sale.items[0]?.r * 12).toLocaleString() : '0')}</td>
              <th className="font-nastaliq">ریٹ فی گرام</th>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{(sale.items[0]?.r || 0).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {/* Items Table */}
        <table className="receipt-table" style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th className="font-nastaliq" style={{ width: '22%' }}>تفصیل</th>
              <th className="font-nastaliq" style={{ width: '8%' }}>تعداد</th>
              <th className="font-nastaliq" style={{ width: '12%' }}>وزن</th>
              <th className="font-nastaliq" style={{ width: '10%' }}>پالش</th>
              <th className="font-nastaliq" style={{ width: '14%' }}>کل وزن</th>
              <th className="font-nastaliq" style={{ width: '18%' }}>کل قیمت</th>
              <th className="font-nastaliq" style={{ width: '16%' }}>تصویر</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i}>
                <td className="font-nastaliq" style={{ textAlign: 'right', fontWeight: 'bold', paddingRight: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.n}</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{item.t < 0 ? '-' : (item.p || 1)}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{parseFloat(Number(item.w).toFixed(2))}g</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{parseFloat(Number(item.mk).toFixed(2))}g</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{parseFloat(Number(item.w + item.mk).toFixed(2))}g</td>
                <td style={{ fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'left', paddingLeft: '8px' }}>{Math.round(item.t).toLocaleString()}</td>
                <td style={{ padding: '4px', verticalAlign: 'middle', textAlign: 'center' }}>
                  {item.img ? (
                    <img 
                      src={item.img} 
                      alt="" 
                      style={{ height: '90px', maxHeight: '90px', width: 'auto', maxWidth: '100%', objectFit: 'contain', margin: '0 auto', border: '1px solid #000000', borderRadius: '3px' }} 
                    />
                  ) : (
                    <span>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Table */}
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '14px' }}>
          <table className="summary-table" style={{ marginLeft: 'auto' }}>
            <tbody>
              <tr>
                <th className="font-nastaliq">سونے کی رقم</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{goldAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <th className="font-nastaliq">مزدوری</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{mazdori.toLocaleString()}</td>
              </tr>
              <tr>
                <th className="font-nastaliq" style={{ fontWeight: 'bold' }}>کل رقم</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{totalBill.toLocaleString()}</td>
              </tr>
              {oldGoldDeduction > 0 && (
                <tr>
                  <th className="font-nastaliq">پرانا سونا منہا (-)</th>
                  <td style={{ fontFamily: 'monospace', textAlign: 'right' }}>{oldGoldDeduction.toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <th className="font-nastaliq">وصول شدہ رقم</th>
                <td style={{ fontFamily: 'monospace', textAlign: 'right' }}>{sale.rec.toLocaleString()}</td>
              </tr>
              <tr className="final-total-row">
                <th className="font-nastaliq" style={{ fontWeight: 900 }}>صاف بقایا</th>
                <td style={{ fontWeight: 900, fontFamily: 'monospace', textAlign: 'right' }}>{sale.rem.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Terms & Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid #000000', paddingTop: '12px', marginTop: '16px' }}>
          <div className="terms font-nastaliq" style={{ border: 'none', marginTop: 0, paddingTop: 0, width: '70%' }}>
            <b>شرائط و ضوابط:</b><br />
            1۔ زیورات کی واپسی پر 25% کاٹ لیا جائے گا۔<br />
            2۔ کسٹمر اپنا تیار سامان 1 ہفتہ کے اندر وصول کرنے کا پابند ہوگا۔<br />
            3۔ تیار شدہ سامان چھوڑنے پر 20% کاٹ لیا جائے گا۔<br />
            4۔ فی تولہ 1 ماشہ پالش کاٹ ہوگا۔<br />
            5۔ آرڈر دیتے وقت 75-80% رقم لازمی دینا ہوگی۔<br />
            6۔ پرانے زیورات توڑ کر نئے زیورات تیار کرنے پر پانسہ 2 ماشہ اور پونڈ پانسہ 3 ماشہ فی تولہ کاٹ لیا جائے گا۔<br />
            7۔ استعمال سے پہلے بینگلز کے وزن کی تسلی کریں، گھس جانے کی وجہ سے بعد میں دکاندار ذمہ دار نہیں ہوگا۔
          </div>
          <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-start', opacity: 0.6 }} dir="ltr">
            <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'order') {
    const order = data as Order;
    const paymentsSum = order.payments.reduce((sum, p) => sum + p.amt, 0);
    const goldAmount = order.goldAmount !== undefined ? order.goldAmount : order.total;
    const mazdori = order.mazdori !== undefined ? order.mazdori : 0;
    const oldGoldMinus = order.oldGoldMinus || 0;
    const totalAmount = goldAmount + mazdori;
    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '14.8cm', 
        minHeight: '21cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.4cm 0.6cm 0.6cm 0.6cm',
        paddingBottom: '1.5cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '6px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '13px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
          <div className="font-nastaliq" style={{ backgroundColor: '#dce7f3', padding: '3px 12px', marginTop: '6px', fontWeight: 'bold', borderRadius: '4px', color: '#000000', fontSize: '15px', border: '1px solid #000000', display: 'inline-block' }}>آرڈر بکنگ رسید</div>
        </div>

        <table className="receipt-table" style={{ marginBottom: '10px' }}>
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '18%' }}>نام کسٹمر</th>
              <td className="font-nastaliq" style={{ width: '32%', paddingRight: '10px', fontWeight: 'bold' }}>{order.name}</td>
              <th className="font-nastaliq" style={{ width: '18%' }}>فون نمبر</th>
              <td style={{ width: '32%', fontFamily: 'monospace' }} dir="ltr">{order.phone}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">تاریخ بکنگ</th>
              <td style={{ fontFamily: 'monospace' }}>{order.date}</td>
              <th className="font-nastaliq">تاریخ واپسی</th>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.due}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">نام آئٹم</th>
              <td className="font-nastaliq" style={{ paddingRight: '10px', fontWeight: 'bold' }}>{order.item}</td>
              <th className="font-nastaliq">نام کاریگر</th>
              <td className="font-nastaliq" style={{ paddingRight: '10px' }}>{order.karigar}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">پیمائش</th>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.measurements || '-'}</td>
              <th className="font-nastaliq">فی تولہ ریٹ</th>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.pricePerTola || '-'}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '6px' }}>
          <h4 className="font-nastaliq" style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '12px', textAlign: 'right', color: '#000000' }}>وزن کی تفصیل:</h4>
          <table className="receipt-table" style={{ tableLayout: 'fixed', width: '100%', marginBottom: '10px' }}>
            <thead>
              <tr>
                <th className="font-nastaliq" style={{ width: '20%' }}>پرانا وزن</th>
                <th className="font-nastaliq" style={{ width: '20%' }}>وزن</th>
                <th className="font-nastaliq" style={{ width: '20%' }}>پالش</th>
                <th className="font-nastaliq" style={{ width: '20%' }}>ٹوٹل وزن</th>
                <th className="font-nastaliq" style={{ width: '20%' }}>اضافی وزن</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{order.oldWt ? `${parseFloat(Number(order.oldWt).toFixed(2))}g` : '-'}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{order.readyWt ? `${parseFloat(Number(order.readyWt).toFixed(2))}g` : '-'}</td>
                <td className="font-nastaliq" style={{ fontWeight: 'bold', textAlign: 'center' }}>{order.makingCharges || '-'}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{order.totalWt ? `${parseFloat(Number(order.totalWt).toFixed(2))}g` : '-'}</td>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{order.izafiWt ? `${parseFloat(Number(order.izafiWt).toFixed(2))}g` : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {order.img && (
          <div style={{ marginTop: '6px', textAlign: 'center' }}>
            <p className="font-nastaliq" style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: '4px', textAlign: 'right' }}>تصویر:</p>
            <img src={order.img} alt="" style={{ maxHeight: '130px', margin: '0 auto', border: '1px solid #000000', borderRadius: '4px', objectFit: 'contain' }} />
          </div>
        )}

        <h4 className="font-nastaliq" style={{ fontWeight: 'bold', marginTop: '6px', marginBottom: '4px', fontSize: '12px', textAlign: 'right' }}>ادائیگیوں کی تفصیل:</h4>
        <table className="receipt-table" style={{ tableLayout: 'fixed', width: '100%', marginBottom: '10px' }}>
          <thead>
            <tr>
              <th className="font-nastaliq" style={{ width: '33%' }}>معطلی نمبر</th>
              <th className="font-nastaliq" style={{ width: '33%' }}>رقم</th>
              <th className="font-nastaliq" style={{ width: '34%' }}>تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {order.payments.length === 0 ? (
              <tr>
                <td colSpan={3} className="font-nastaliq" style={{ padding: '4px 0', textAlign: 'center', fontSize: '12px' }}>کوئی ادائیگی نہیں ہوئی</td>
              </tr>
            ) : (
              order.payments.slice(0, 8).map((p, i) => (
                <tr key={i}>
                  <td className="font-nastaliq" style={{ textAlign: 'center' }}>قسط {i + 1}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'center' }}>{p.amt.toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{p.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
          <table className="summary-table" style={{ marginLeft: 'auto', marginBottom: '8px' }}>
            <tbody>
              <tr>
                <th className="font-nastaliq">سونے کی رقم</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{goldAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <th className="font-nastaliq">مزدوری</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{mazdori.toLocaleString()}</td>
              </tr>
              <tr>
                <th className="font-nastaliq" style={{ fontWeight: 'bold' }}>کل رقم</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{totalAmount.toLocaleString()}</td>
              </tr>
              {oldGoldMinus > 0 && (
                <tr>
                  <th className="font-nastaliq">پرانا سونا منہا (-)</th>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{oldGoldMinus.toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <th className="font-nastaliq">وصول شدہ رقم</th>
                <td style={{ fontFamily: 'monospace', fontWeight: 'bold', textAlign: 'right' }}>{paymentsSum.toLocaleString()}</td>
              </tr>
              <tr className="final-total-row">
                <th className="font-nastaliq" style={{ fontWeight: 900, textAlign: 'right' }}>صاف بقایا</th>
                <td style={{ fontWeight: 900, fontFamily: 'monospace', textAlign: 'right' }}>{order.rem.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid #000000', paddingTop: '12px', marginTop: '12px' }}>
          <div className="terms font-nastaliq" style={{ border: 'none', marginTop: 0, paddingTop: 0, width: '70%', fontSize: '10px' }}>
            <b>شرائط و ضوابط:</b><br />
            1۔ زیورات کی واپسی پر 25% کاٹ لیا جائے گا۔<br />
            2۔ کسٹمر اپنا تیار سامان 1 ہفتہ کے اندر وصول کرنے کا پابند ہوگا۔<br />
            3۔ تیار شدہ سامان چھوڑنے پر 20% کاٹ لیا جائے گا۔<br />
            4۔ فی تولہ 1 ماشہ پالش کاٹ ہوگا۔<br />
            5۔ آرڈر دیتے وقت 75-80% رقم لازمی دینا ہوگی۔<br />
            6۔ پرانے زیورات توڑ کر نئے زیورات تیار کرنے پر پانسہ 2 ماشہ اور پونڈ پانسہ 3 ماشہ فی تولہ کاٹ لیا جائے گا۔<br />
            7۔ استعمال سے پہلے بینگلز کے وزن کی تسلی کریں، گھس جانے کی وجہ سے بعد میں دکاندار ذمہ دار نہیں ہوگا۔
          </div>
          <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-start', opacity: 0.6 }} dir="ltr">
            <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'repair') {
    const repair = data as Repair;
    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '14.8cm', 
        minHeight: '21cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.5cm 1cm 1cm 1cm',
        paddingBottom: '2.5cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '10px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '16px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
          <div className="font-nastaliq" style={{ backgroundColor: '#dce7f3', padding: '3px 12px', marginTop: '10px', fontWeight: 'bold', borderRadius: '4px', color: '#000000', fontSize: '16px', border: '1px solid #000000', display: 'inline-block' }}>ریپیئرنگ رسید</div>
        </div>

        <table className="receipt-table">
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '20%' }}>کسٹمر</th>
              <td style={{ width: '30%', fontWeight: 'bold' }}>{repair.customerName}</td>
              <th className="font-nastaliq" style={{ width: '20%' }}>تاریخ</th>
              <td style={{ width: '30%', fontWeight: 'bold' }} dir="ltr">{formatDate(repair.date, 'ur-PK')}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">فون</th>
              <td style={{ fontWeight: 'bold' }} dir="ltr">{repair.customerPhone}</td>
              <th className="font-nastaliq">حالت</th>
              <td style={{ fontWeight: 'bold' }}>{repair.status === 'Done' ? 'تیار ہے' : 'انتظار'}</td>
            </tr>
          </tbody>
        </table>

        <table className="receipt-table" style={{ marginTop: '16px' }}>
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '25%' }}>آئٹم</th>
              <td className="font-nastaliq" style={{ width: '75%', textAlign: 'right', paddingRight: '12px', fontWeight: 'bold' }}>{repair.item}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">مسئلہ</th>
              <td className="font-nastaliq" style={{ textAlign: 'right', paddingRight: '12px' }}>{repair.issue}</td>
            </tr>
            <tr className="final-total-row">
              <th className="font-nastaliq" style={{ fontWeight: 900 }}>رقم</th>
              <td style={{ fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'right', paddingRight: '12px', fontSize: '18px' }}>Rs. {repair.charges.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {repair.img && (
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <img src={repair.img} alt="" style={{ maxHeight: '180px', margin: '0 auto', border: '1px solid #000000', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderTop: '1px solid #000000', paddingTop: '14px', marginTop: '20px' }}>
          <p className="font-nastaliq" style={{ fontSize: '13px', color: '#000000', width: '70%' }}>* ریپیئرنگ کے دوران کسی بھی قسم کے نقصان کی صورت میں دکان ذمہ دار نہیں ہوگی۔</p>
          <div style={{ width: '30%', display: 'flex', justifyContent: 'flex-start', opacity: 0.6 }} dir="ltr">
            <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'karigar') {
    const karigar = data as KarigarRecord;
    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '14.8cm', 
        minHeight: '21cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.5cm 1cm 1cm 1cm',
        paddingBottom: '2.5cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '10px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '16px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
          <div className="font-nastaliq" style={{ backgroundColor: '#dce7f3', padding: '3px 12px', marginTop: '10px', fontWeight: 'bold', borderRadius: '4px', color: '#000000', fontSize: '16px', border: '1px solid #000000', display: 'inline-block' }}>کاریگر رسید</div>
        </div>

        <table className="receipt-table">
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '25%' }}>کاریگر</th>
              <td className="font-nastaliq" style={{ width: '25%', fontWeight: 'bold' }}>{karigar.name}</td>
              <th className="font-nastaliq" style={{ width: '25%' }}>تاریخ</th>
              <td style={{ width: '25%', fontFamily: 'monospace' }}>{karigar.date}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">فون</th>
              <td colSpan={3} style={{ fontFamily: 'monospace' }} dir="ltr">{karigar.phone}</td>
            </tr>
          </tbody>
        </table>

        <table className="receipt-table" style={{ marginTop: '12px' }}>
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '25%' }}>ٹاسک (Task)</th>
              <td className="font-nastaliq" style={{ width: '75%', textAlign: 'right', paddingRight: '12px' }}>{karigar.task}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '12px' }}>
          <table className="receipt-table">
            <thead>
              <tr>
                <th className="font-nastaliq" style={{ width: '25%' }}>دیا گیا</th>
                <th className="font-nastaliq" style={{ width: '25%' }}>وصول</th>
                <th className="font-nastaliq" style={{ width: '25%' }}>کاٹ</th>
                <th className="font-nastaliq" style={{ width: '25%' }}>صاف بقایا</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{karigar.given}g</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{karigar.rec}g</td>
                <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{karigar.kaat}g</td>
                <td style={{ fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center' }}>{karigar.net}g</td>
              </tr>
            </tbody>
          </table>
        </div>

        {karigar.img && (
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <img src={karigar.img} alt="" style={{ maxHeight: '180px', margin: '0 auto', border: '1px solid #000000', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', opacity: 0.6, paddingTop: '14px', marginTop: '16px', borderTop: '1px solid #000000' }} dir="ltr">
          <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'stock') {
    const stock = data as StockItem;
    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '14.8cm', 
        minHeight: '21cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.5cm 1cm 1cm 1cm',
        paddingBottom: '2.5cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '10px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '16px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
          <div className="font-nastaliq" style={{ backgroundColor: '#dce7f3', padding: '3px 12px', marginTop: '10px', fontWeight: 'bold', borderRadius: '4px', color: '#000000', fontSize: '16px', border: '1px solid #000000', display: 'inline-block' }}>اسٹاک رسید</div>
        </div>

        <table className="receipt-table" style={{ marginTop: '16px' }}>
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '25%' }}>آئٹم</th>
              <td className="font-nastaliq" style={{ fontWeight: 'bold', fontSize: '18px', width: '75%' }}>{stock.name}</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '12px' }}>
          <table className="receipt-table">
            <thead>
              <tr>
                <th className="font-nastaliq" style={{ width: '33%' }}>ٹائپ</th>
                <th className="font-nastaliq" style={{ width: '33%' }}>صاف وزن</th>
                <th className="font-nastaliq" style={{ width: '34%' }}>تعداد</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-nastaliq">{stock.type}</td>
                <td style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'monospace', textAlign: 'center' }}>{stock.quantity} {stock.unit}</td>
                <td style={{ fontWeight: 'bold', fontSize: '16px', fontFamily: 'monospace', textAlign: 'center' }}>{stock.pieces || 0} pcs</td>
              </tr>
            </tbody>
          </table>
        </div>

        {stock.img && (
          <div style={{ marginTop: '16px', textAlign: 'center' }}>
            <img src={stock.img} alt="" style={{ maxHeight: '200px', margin: '0 auto', border: '1px solid #000000', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', opacity: 0.6, paddingTop: '14px', marginTop: '16px', borderTop: '1px solid #000000' }} dir="ltr">
          <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'purchase') {
    const purchase = data as GoldPurchase;
    return (
      <div ref={ref} className="print-receipt-container" dir="rtl" style={{ 
        fontFamily: "'Inter', sans-serif", 
        width: '21cm', 
        minHeight: '29.7cm', 
        height: 'auto', 
        boxSizing: 'border-box', 
        position: 'relative', 
        padding: '0.5cm 1cm 1cm 1cm',
        paddingBottom: '2.5cm',
        backgroundColor: '#ffffff',
        color: '#000000'
      }}>
        {printStyles}
        <div className="receipt-border-decor" />
        <div className="header-section">
          <h1 className="shop-name text-center" style={{ width: '100%', display: 'block' }}>{shopSettings.name}</h1>
          <div style={{ height: '10px' }}></div>
          <p className="font-nastaliq" style={{ fontSize: '22px', fontWeight: 'bold', margin: '4px 0', color: '#000000' }}>ہمارے ہاں ہر قسم سونے اور چاندی کا کام آرڈر پر تیار کیا جاتا ہے۔</p>
          <p className="font-nastaliq" style={{ fontSize: '16px', margin: '4px 0', color: '#000000' }}>{shopSettings.address}</p>
          <div className="header-phone" dir="ltr">
            <div className="phone-brand-box">
              <span className="phone-number">{shopSettings.phone}</span>
            </div>
            {shopSettings.phone2 && (
              <div className="phone-brand-box-secondary">
                <span className="phone-number">{shopSettings.phone2}</span>
              </div>
            )}
          </div>
          <div className="font-nastaliq" style={{ backgroundColor: '#dce7f3', padding: '3px 12px', marginTop: '10px', fontWeight: 'bold', borderRadius: '4px', color: '#000000', fontSize: '16px', border: '1px solid #000000', display: 'inline-block' }}>پرانا سونا خریداری رسید</div>
        </div>

        <table className="receipt-table">
          <tbody>
            <tr>
              <th className="font-nastaliq" style={{ width: '20%' }}>بیچنے والے کا نام</th>
              <td className="font-nastaliq" style={{ width: '30%', fontWeight: 'bold' }}>{purchase.name}</td>
              <th className="font-nastaliq" style={{ width: '20%' }}>فون نمبر</th>
              <td style={{ width: '30%', fontWeight: 'bold' }} dir="ltr">{purchase.phone}</td>
            </tr>
            <tr>
              <th className="font-nastaliq">تاریخ</th>
              <td>{purchase.date}</td>
              <th className="font-nastaliq">رسید نمبر</th>
              <td style={{ fontWeight: 'bold' }}>#{5000 + (id || 0)}</td>
            </tr>
          </tbody>
        </table>

        <table className="receipt-table" style={{ marginTop: '16px' }}>
          <thead>
            <tr>
              <th className="font-nastaliq" style={{ width: '30%' }}>آئٹم</th>
              <th className="font-nastaliq" style={{ width: '20%' }}>وزن</th>
              <th className="font-nastaliq" style={{ width: '25%' }}>ریٹ</th>
              <th className="font-nastaliq" style={{ width: '25%' }}>کل قیمت</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-nastaliq font-bold" style={{ paddingRight: '12px', textAlign: 'center' }}>پرانا سونا</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>{purchase.weight}g</td>
              <td style={{ fontFamily: 'monospace', textAlign: 'center' }}>{purchase.rate.toLocaleString()}</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 'bold', fontSize: '17px', textAlign: 'center' }}>{purchase.total.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        {purchase.img && (
          <div style={{ marginTop: '14px', textAlign: 'center' }}>
            <h4 className="font-nastaliq" style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '6px' }}>خریدے گئے سونے کی تصویر</h4>
            <img src={purchase.img} alt="" style={{ maxHeight: '200px', margin: '0 auto', border: '1px solid #000000', borderRadius: '4px' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '16px' }}>
          <table className="summary-table" style={{ marginLeft: 'auto' }}>
            <tbody>
              <tr className="final-total-row">
                <th className="font-nastaliq" style={{ fontWeight: 900, fontSize: '16px' }}>نقد ادا شدہ رقم</th>
                <td style={{ fontWeight: 900, fontFamily: 'monospace', fontSize: '20px' }}>Rs. {purchase.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '30px', borderTop: '1px solid #000000', paddingTop: '16px' }}>
          <h3 className="font-nastaliq" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '17px', marginBottom: '12px', textDecoration: 'underline' }}>اعلان و تصدیق</h3>
          <div className="font-nastaliq" style={{ fontSize: '15px', lineHeight: 1.8, textAlign: 'justify', marginBottom: '14px' }}>
            <p style={{ marginBottom: '10px' }}>
              فروخت کنندہ اس بات کی مکمل تصدیق کرتا/کرتی ہے کہ فروخت کیا جانے والا سونا اس کی جائز اور قانونی ملکیت ہے اور کسی بھی قسم کی چوری، گمشدگی یا غیر قانونی ذریعے سے حاصل شدہ نہیں ہے۔ فروخت کنندہ نے اپنی درست شناختی دستاویز (CNIC) فراہم کی ہے جس کی کاپی خریدار کے ریکارڈ میں محفوظ ہے۔
            </p>
            <p>
              خریدار (دکان) نے مناسب قانونی احتیاط (Due Diligence) کے طور پر شناخت، تصویر اور لین دین کا مکمل ریکارڈ محفوظ کیا ہے۔ اگر مستقبل میں یہ سونا چوری شدہ یا غیر قانونی ثابت ہوتا ہے تو اس کی مکمل قانونی ذمہ داری فروخت کنندہ پر عائد ہوگی اور وہ ہر قسم کے نقصان، دعویٰ یا قانونی کارروائی کا ذمہ دار ہوگا۔
            </p>
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.4, textAlign: 'justify', fontFamily: 'Inter, sans-serif', color: '#000000', fontStyle: 'italic', borderBottom: '1px solid #000000', paddingBottom: '16px', marginBottom: '24px' }}>
            <p style={{ marginBottom: '6px' }}>
              The seller hereby declares that the gold being sold is his/her lawful property and is not stolen, lost, or obtained through any illegal means. A valid CNIC has been provided and a copy is retained in the buyer’s records.
            </p>
            <p>
              The buyer (shop) has exercised due diligence by recording identification details, photograph, and transaction data. In the event that the gold is later found to be stolen or illegal, full legal responsibility and liability shall rest with the seller, including compensation for any loss or legal claim.
            </p>
          </div>
          
          <div className="font-nastaliq" style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: '30px', fontSize: '13px', fontWeight: 'bold' }}>
            <div style={{ borderBottom: '1px solid #000000', paddingBottom: '3px' }}>فروخت کنندہ کے دستخط:</div>
            <div style={{ borderBottom: '1px solid #000000', paddingBottom: '3px', textAlign: 'left' }}>انگوٹھے کا نشان:</div>
            <div style={{ borderBottom: '1px solid #000000', paddingBottom: '3px' }}>شناختی کارڈ:</div>
            <div style={{ borderBottom: '1px solid #000000', paddingBottom: '3px', textAlign: 'left' }}>موبائل نمبر:</div>
            <div style={{ gridColumn: 'span 2', textAlign: 'center', marginTop: '16px', borderBottom: '1px solid #000000', paddingBottom: '3px', display: 'inline-block', margin: '16px auto 0', paddingLeft: '48px', paddingRight: '48px' }}>تاریخ: {purchase.date}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-start', opacity: 0.6, paddingTop: '12px', marginTop: '24px' }} dir="ltr">
          <div style={{ width: '75px', height: '75px', border: '3px solid #000000', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#000000', padding: '4px', transform: 'rotate(-15deg)' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '9px', fontWeight: 900, letterSpacing: '0.5px', textAlign: 'center', textTransform: 'uppercase', lineHeight: 1.1 }}>{APP_CONFIG.shopNameEnglish}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
});

PrintReceipt.displayName = 'PrintReceipt';
