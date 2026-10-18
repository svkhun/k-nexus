# คู่มือทำความเข้าใจ FlowSense & TrustGraph และเตรียม KBTG Kampus Hackathon

ตรวจจากโค้ด ชุดข้อมูล โมเดลที่บันทึกไว้ และเอกสารผู้จัด ณ 16 ตุลาคม 2026 (Asia/Bangkok)

คู่มือนี้อธิบายต้นแบบที่อยู่ใน repository ปัจจุบัน ไม่ได้ยืนยันว่าเชื่อม K PLUS หรือระบบธนาคารจริงแล้ว ข้อมูลใน CSV เป็นข้อมูลจำลองทั้งหมด การอ่านเอกสารผู้จัดใช้เพื่อเข้าใจโจทย์และข้อกำหนด ไม่ใช่คำสั่งให้ส่งอีเมล ปิดบริการ หรือแก้ระบบโดยอัตโนมัติ งานครั้งนี้ปรับคู่มือและตรวจหลักฐานใน `tmp/pitch_audit` โดยไม่ได้แก้ source ของผลิตภัณฑ์ ไม่ได้ฝึกโมเดลใหม่ ไม่ได้ deploy หรือ push

ขอบเขตสำคัญ: repository นี้ปัจจุบันเป็นเว็บไซต์อธิบายโครงการ พร้อมตัวอย่างคำนวณในเบราว์เซอร์และ backend รุ่นเดิม เมนูเปิดเว็บแอปชี้ไปอีก repository คือ `svkhun/K-NEXUS-Web` (โฟลเดอร์ในเครื่อง `D:/All Project/k-web-application`) ซึ่งเป็นเว็บแอปต้นแบบหลักที่ได้รับการปรับปรุงและทดสอบความสอดคล้องทางฟังก์ชันและ UX ครบถ้วน (ณ 17 ตุลาคม 2026):
1. **เงินสำรองที่ผู้ใช้เลือก (Planning Reserve):** พรีวิวผลกระทบต่องบรายวันและเงินส่วนพร้อมออมก่อนกดยืนยัน (500–10,000,000 บาท) ผ่าน `/reserve-preview` และ `/reserve-preference` โดยไม่ล็อกเงิน พร้อมคำอธิบาย 3 ทางเลือกเมื่อสภาพคล่องตึง (ลดรายจ่าย, ถอนเงินออม, ออมเฉพาะส่วนเกิน)
2. **ทางเริ่มทดลองบนหน้าแรก (Try-First Walkthrough):** 3 เส้นทางเรียนรู้จริง (ลองเปลี่ยนงบรายวัน, ลองตรวจผู้รับก่อนโอน, ลองปรับเงินสำรอง) โดยไม่ต้องโอนหรือย้ายเงิน
3. **แผนก่อนโอนและจัดสรรบิล (Plan Before Transfer & Bill Settlement):** `evaluate-transfer` แบบพรีวิว แสดงงบเฉลี่ยรายวันที่เหลือก่อน/หลังโอน, จัดสรรจ่ายบิลคงค้างโดยไม่นับเป็นรายจ่ายประจำวันซ้ำ, ป้องกันแผนล้าสมัยก่อน confirm (HTTP 409 `PLAN_CHANGED`) และนับยอดโอนสะสมไปยังผู้รับเดิมในวันเดียวกัน
4. **ช่วงทบทวนรายการเสี่ยง (15-Min Cooldown):** ควบคุมที่เซิร์ฟเวอร์เฉพาะรายการเสี่ยง (`CRITICAL_ANOMALY`) เปิดเป็นค่าเริ่มต้นพร้อมการ์ดสวิตช์ปิด/เปิด และการยกเลิกที่ตัดรอบเวลาทันที รองรับ modal accessibility
5. **ช่องทางติดต่อธนาคารทางการ (Official Bank Contact):** ให้ข้อมูลติดต่อ K-Contact Center 02-888-8888 เมนู 00 แจ้งภัยทางการเงิน ตลอด 24 ชม. ตรงจากกล่องเตือนความเสี่ยง
6. **ภาษาภาพและการจัดวางตาม K+ จริง:** โทนเขียวอมฟ้าเข้ม บัตรบัญชีเรขาคณิต ปุ่มวงกลม วางแผนเงินใน "เรื่องสำคัญวันนี้" และทางเข้าถาวรในโปรไฟล์ "การเงินของฉัน"

ตรวจ PDF ต้นฉบับทั้งสี่ไฟล์ซ้ำ รวม 83 หน้า: HR 11, Hack the hackathon 18, K+ 15 และ MAKE 39 หน้า ผลสกัดข้อความตรงกับไฟล์ที่เคยอ่าน เก็บ hashes และผลตรวจใน `tmp/pitch_audit/source_verification_20261016.json` พร้อมตรวจภาพสไลด์ประกอบ

## วิธีอ่านให้เข้าใจจริง

อ่านส่วน 1-5 เพื่อเข้าใจว่าทำเพื่อใครและทำไปทำไม อ่านส่วน 6-11 เพื่อเข้าใจการทำงานและข้อจำกัด อ่านส่วน 12-15 เพื่อจัดหลักฐานและแผนธุรกิจ แล้วใช้ส่วน 16-20 ซ้อมการแข่งขัน อย่าท่องชื่อเทคโนโลยีก่อนเข้าใจการตัดสินใจที่ระบบต้องช่วยผู้ใช้

ทุกข้อกล่าวอ้างควรติดป้ายหนึ่งในสี่ประเภท:

1. **ตรวจพบในต้นแบบ:** โค้ด/ข้อมูล/ผลทดสอบใน workspace รองรับ
2. **บริบทจากเอกสารหรือแหล่งภายนอก:** ต้องระบุปี ช่วงเวลา ประชากร และแหล่งที่มา
3. **สมมติฐานหรือ scenario:** มีเหตุผลได้ แต่ยังไม่ใช่ผลใช้งานจริง
4. **แผนพัฒนาต่อ:** ยังไม่ควรพูดว่า integrated หรือ production ready

## 1. โจทย์และเวลาที่มีจริง

เอกสาร Sharing by HR หน้า PDF 3 กำหนด K PLUS Smart Life Assistant Challenge: ออกแบบ feature/service สำหรับ first jobbers อายุ **22-30 ปี** เพื่อช่วยชีวิตประจำวันผ่านประสบการณ์ K PLUS โดยมี **การป้องกัน scam และ fraud เป็นจุดเน้นชัดเจน** ช่วงอายุ 20-30 ที่ README ใช้ไม่ตรงกับโจทย์ทั้งหมด ควรใช้ 22-30 บน pitch

โปรเจกต์ระบุ Track 2: Data Science & Intelligence จึงต้องตอบได้ 4 เรื่องตามเอกสาร HR หน้า 4:

| เรื่อง | คำตอบที่โปรเจกต์ต้องมี |
|---|---|
| Data use case | พยากรณ์สภาพคล่อง/รายจ่าย และประเมินความเสี่ยงธุรกรรมก่อนโอน |
| Data inputs | ธุรกรรม ภาระผูกพัน ข้อมูลบัญชีปลายทาง กราฟการโอน และบริบท session พร้อมที่มาและการใช้ข้อมูลอย่างรับผิดชอบ |
| Model or logic | LightGBM regression, graph embeddings + LightGBM classification และกฎการแทรกแซง โดยอธิบายเหตุผลที่เลือก |
| Output & success | ผู้ใช้เห็นสถานะสภาพคล่อง/คำเตือนและขั้นตอนที่ต้องทำ วัดทั้งผลพยากรณ์ fraud detection และผลต่อ UX |

HR หน้า 9 ระบุส่งสไลด์ **30 ต.ค. 2026** และแข่งขัน **7 พ.ย. 2026** จาก 16 ต.ค. จึงมี 14 วันถึงส่งสไลด์และ 22 วันถึงแข่งขัน เป็นผลต่างวันที่ ไม่ใช่ชั่วโมงที่เหลือก่อนเวลาปิดรับ เพราะ PDF ไม่ระบุเวลาปิดรับ ไม่ควรวางแผนเสมือนเหลือเดือนเต็ม หากมีประกาศใหม่ให้ใช้ประกาศล่าสุดแทน จำนวน 30 ทีมและคัด 9 ทีมเป็นข้อมูลที่คุณให้ ไม่พบรายละเอียดจำนวนนี้ในเอกสาร HR

รอบ 3 นาที HR หน้า 6 ให้กรรมการตัดสินสามเรื่อง: ปัญหาชัดและสำคัญหรือไม่, ทางแก้ตอบปัญหาและสมเหตุผลหรือไม่, มีคุณค่าพอให้ฟังต่อหรือไม่ ไม่ระบุน้ำหนักคะแนนแยกสามเรื่อง

รอบ 7 นาที HR หน้า 7:

| เกณฑ์ | คะแนน | หลักฐานที่เหมาะกับทีม |
|---|---:|---|
| Problem & User Insight | 20 | ผู้ใช้จริง เล่าเหตุการณ์จริง และ insight ที่นำไปสู่การออกแบบ |
| Innovation & Solution | 25 | ความต่างที่ชัดจากเครื่องมือเดิม และ flow ที่ตอบ insight |
| Feasibility & Technical Approach | 20 | สิ่งที่รันได้ ขอบเขตข้อมูล วิธีประเมินที่ถูกต้อง และแผนเชื่อมระบบ |
| Impact & Value | 20 | KPI ของลูกค้าและธนาคาร พร้อมสมมติฐานธุรกิจ |
| Presentation & Communication | 15 | เรื่องเล่าชัด เดโมอ่านออก ตรงเวลา ตอบคำถามตรงประเด็น |

Hack the hackathon หน้า 14 ยกเกณฑ์ TechJam 2019 ซึ่ง **ไม่ใช่เกณฑ์ปีนี้** อย่านำ 60% insight+solution หรือ 10% presentation จากหน้านั้นมาแทน HR ปี 2026

## 2. โปรเจกต์นี้คืออะไร

คำอธิบายที่ใช้เป็นแกนได้:

> “FlowSense & TrustGraph เป็นต้นแบบผู้ช่วยสำหรับคนเริ่มทำงาน ช่วยเห็นเงินที่ต้องรักษาไว้ก่อนถึงวันจ่ายบิล และเตือนความเสี่ยงของผู้รับก่อนยืนยันโอน โดยเพิ่มขั้นตอนเฉพาะรายการที่จำเป็น”

มีสองโมดูล:

- **FlowSense:** ตอบว่าเงินที่เห็นในบัญชี มีส่วนไหนต้องกันไว้ และจะพอถึงวันรับเงินเดือนหรือไม่ พร้อมทดลองย้ายเงินส่วนเล็กไปบัญชีย่อยและเรียกกลับ
- **TrustGraph:** ตอบว่ารายการโอนนี้มีสัญญาณเสี่ยงจากผู้รับและบริบทธุรกรรมหรือไม่ แล้วเลือกปล่อย/เตือนและยืนยันเพิ่ม/ระงับตามนโยบาย

คุณค่าร่วมคือ “รักษาเงินที่จำเป็นต้องใช้ และช่วยตัดสินใจก่อนเงินออกจากบัญชี” แต่ **ในโค้ดปัจจุบันสองโมเดลยังไม่ได้ใช้ผลทำนายของกันและกัน** TrustGraph มี 24 features ที่ไม่ได้รวม cashflow deficit หรือ persona ของ FlowSense การบอกว่าเป็น AI ที่ผสานสุขภาพการเงินกับ fraud score แล้วจึงเกิน implementation ปัจจุบัน

อย่าเหมารวมว่าคนเงินไม่พอเป็นเพราะใช้จ่ายฟุ่มเฟือยเสมอไป ภาระครอบครัว รายได้ต่ำ ค่าใช้จ่ายจำเป็น และจังหวะรับเงินล้วนเป็นไปได้ และยังไม่มี user research ในไฟล์ที่พิสูจน์ว่าปัญหาสภาพคล่องทำให้ first jobber เสี่ยง scam มากขึ้นโดยตรง

## 3. ปัญหา วัตถุประสงค์ และสมมติฐาน

### 3.1 ยอดเงินคงเหลือไม่ใช่เงินที่ใช้ได้ทั้งหมด

คนมีเงิน 12,000 บาทอาจต้องจ่ายค่าเช่า 6,000 หนี้ 2,000 และค่าใช้ชีวิตอีก 3,500 ก่อนเงินเดือนเข้า เงินที่พอใช้โดยไม่กระทบภาระจึงเหลือประมาณ 500 บาท ไม่ใช่ 12,000 บาท

ปัญหาที่เสนอให้ตรวจด้วยผู้ใช้จริงคือ คนต้องคำนวณเรื่องนี้เอง จดค่าใช้จ่ายไม่ต่อเนื่อง หรือเพิ่งรู้ว่าไม่พอเมื่อบิลใกล้ถึงกำหนด วัตถุประสงค์ FlowSense คือช่วยเห็นภาระในอนาคตเร็วขึ้น ลดงาน manual และออมโดยไม่ทำให้สภาพคล่องเสีย

### 3.2 กลัวออมแล้วใช้เงินไม่ได้

ผู้ใช้บางคนไม่แยกเงินออมเพราะกลัวต้องใช้ฉุกเฉิน กลไก Safe-to-Save + Micro-Sweep เสนอให้แยกเงินก้อนเล็กหลังกันค่าใช้ชีวิต บิล และเงินสำรอง โดยผู้ใช้เลือกเปิดเองและถอนเงินออมตามจำนวนที่ต้องใช้ได้ตามปกติ ยังต้องพิสูจน์ว่าช่วยสร้างเงินออมสุทธิ ไม่ใช่เพียงย้ายไปและถอนออกทันทีทุกวัน

### 3.3 ผู้ใช้จริงอาจเป็นคนกดยืนยันให้มิจฉาชีพเอง

**Scam:** หลอกให้เจ้าของเงินยินยอมโอน เช่น task scam หรือหลอกลงทุน

**Account takeover/fraud แบบสวมรอย:** ผู้โจมตีเข้าถึงบัญชีและโอนแทนเจ้าของ

Face scan ช่วยยืนยันผู้ทำรายการ แต่ผู้ใช้ที่ถูกหลอกยังสแกนผ่านได้ จึงไม่ใช่หลักฐานว่าผู้รับปลอดภัย TrustGraph ต้องอาศัย recipient risk และข้อความที่ช่วยให้ผู้ใช้เข้าใจเหตุการณ์ ไม่ใช่พึ่งการสแกนหน้าอย่างเดียว

**บัญชีม้า:** บัญชีที่ถูกนำไปใช้รับหรือส่งต่อเงินในอาชญากรรม ไม่ใช่บัญชีเปิดใหม่ทุกบัญชี และไม่ใช่ผู้ใช้ที่โอนเร็วทุกคน ธุรกิจปกติก็มีการรับและส่งต่อเงินได้

### 3.4 ความปลอดภัยที่เตือนทุกอย่างอาจเสียประโยชน์

ถ้าระบบเตือนบ่อย ผู้ใช้จะกดข้ามหรือรู้สึกว่าธนาคารขัดขวางชีวิตประจำวัน เป้าหมายจึงเป็นการจัดความเข้มของการแทรกแซงให้ตรงความเสี่ยง และวัดทั้ง false alarm, fraud missed, abandonment และความเข้าใจของผู้ใช้

### 3.5 เงินสำรองที่ผู้ใช้เลือกเองและการอธิบายสภาพคล่อง (Planning Reserve & Liquidity Options)

แทนที่จะให้ระบบล็อกหรือบงการเงินสำรองเพียงฝ่ายเดียว FlowSense ให้ผู้ใช้ทดลองพรีวิว (`POST /reserve-preview`) และยืนยัน (`POST /reserve-preference`) ยอดเงินสำรองเผื่อฉุกเฉินของตนเอง (500–10,000,000 บาท) ซึ่งจะนำไปคำนวณงบรายวัน เพดานออม และผลก่อนโอนอย่างสอดคล้องกัน

เมื่อสภาพคล่องตึงตัว ระบบอธิบาย 3 ทางเลือกที่เข้าใจง่าย:
1. **ลดรายจ่าย:** ลองจำลองลดการใช้จ่าย เช่น วันละ 50 บาท จนถึงวันเงินเดือนออก
2. **ถอนเงินออม:** ย้ายเงินออมสะสมกลับเข้าบัญชีหลักได้ตามจริง ยอดรวมไม่เพิ่มและไม่มีค่าธรรมเนียม
3. **ออมเฉพาะส่วนที่พร้อม (Surplus Only):** พักการออมเมื่อเงินตึง ไม่ชักชวนให้ออมเงินที่ต้องใช้จ่ายบิล

### 3.6 เห็นผลกระทบก่อนโอนและจัดสรรบิลคงค้าง (Plan Before Transfer & Bill Settlement)

ก่อนกดยืนยันโอน TrustGraph เชื่อมกับ FlowSense เพื่อแสดงผลกระทบต่อแผนเงิน:
- **เปรียบเทียบงบเฉลี่ยรายวันที่เหลือก่อนและหลังโอน (Remaining Daily Allocation Before/After)** รวมถึงยอดบิลคงค้างและเงินสำรอง
- **จัดสรรตัดบิลคงค้าง (Match a reserved bill):** หากเป็นการโอนเพื่อจ่ายบิลที่กันไว้ ผู้ใช้สามารถเลือกจับคู่กับบิลก่อนวันเงินเดือนออก (`rent:...` ฯลฯ) เมื่อโอนสำเร็จจะตัดยอดบิลออกจากภาระโดยไม่นับเป็นรายจ่ายประจำวันซ้ำ และไม่ทำให้คะแนนความเสี่ยงเปลี่ยน
- **ตรวจสอบความสดของแผน (Fresh Plan Snapshot):** ก่อนหักเงิน เซิร์ฟเวอร์จะตรวจว่ายอดคงเหลือ บิล หรือวันที่เปลี่ยนไปจากตอน review หรือไม่ หากมีรายการอื่นแทรกจะปฏิเสธด้วย HTTP 409 `PLAN_CHANGED` เพื่อให้ผู้ใช้ตรวจแผนใหม่อีกครั้ง ป้องกันการใช้ token เก่ามาอนุมัติรายการในสถานะที่ไม่ตรงกัน

### 3.7 ช่วงทบทวนรายการเสี่ยง 15 นาที และช่องทางติดต่อธนาคารทางการ (Cooldown & Official Bank Contact)

- **15-Minute Review Period:** เฉพาะรายการเสี่ยง (`CRITICAL_ANOMALY`) ระบบจะเริ่มนับถอยหลัง 15 นาทีที่ควบคุมเวลาโดยเซิร์ฟเวอร์เพื่อให้ผู้ใช้มีเวลาไตร่ตรองและติดต่อตรวจสอบปลายทาง โดยมีสวิตช์เปิด/ปิดชัดเจนในหน้าจอตั้งค่า
- **Clean Cancellation:** หากกดยกเลิก รายการและตัวนับเวลาจะสิ้นสุดทันที ไม่มีการนับเวลาค้างท่อ
- **Official Bank Contact:** ในกล่องแจ้งเตือนความเสี่ยงและหน้าระงับรายการ มีปุ่มเปิดข้อมูลติดต่อทางการของ KBank ทันที (K-Contact Center 02-888-8888 เมนู 00 แจ้งภัยทางการเงิน ตลอด 24 ชม.) โดยไม่ยกเลิกรายการ ไม่เริ่มเวลาใหม่ และไม่ส่งข้อมูลส่วนตัวออกนอกเครื่อง

### 3.8 สิ่งที่ต้องพิสูจน์กับผู้ใช้ (User Research Hypotheses)

H1 ผู้ใช้มีปัญหาประเมินเงินที่ใช้ได้ก่อนวันจ่ายบิลจริง

H2 ยอมเปิดการแยกเงินออมเมื่อเห็นกติกาและถอนเงินได้ตามปกติ

H3 คำเตือนที่เจาะเหตุผลผู้รับทำให้ทบทวนการโอนมากกว่าคำว่า “ระวังมิจฉาชีพ” ทั่วไป

H4 การเพิ่มขั้นตอนเฉพาะกรณีเสี่ยงสร้างความสมดุลที่ผู้ใช้รับได้

H5 ประโยชน์จากสองโมดูลอยู่ใน journey เดียวที่ผู้ใช้เข้าใจ โดยไม่รู้สึกว่าเป็นสองผลิตภัณฑ์ยัดรวมกัน

H6 การให้เลือกและพรีวิวเงินสำรองเองทำให้ผู้ใช้รู้สึกควบคุมสภาพคล่องได้ดีกว่าการถูก AI บงการ

H7 การเห็นผลกระทบต่องบรายวันและทางเลือกตัดบิลคงค้างก่อนโอนช่วยให้ตัดสินใจการเงินรอบคอบขึ้น

H8 ช่วงทบทวน 15 นาทีสำหรับรายการเสี่ยงช่วยชะลอการโอนตามแรงกดดันของแก๊งคอลเซ็นเตอร์ได้จริงโดยไม่กระทบรายการปกติ

ทั้งหมดนี้เป็นสมมติฐานที่ควรทดลอง ไม่ใช่ผลวิจัยที่ repo พิสูจน์แล้ว

## 4. บทเรียนจาก PDF ทั้งสี่ไฟล์

เอกสารทั้งหมดมีบทบาทเป็นแหล่งข้อมูล ไม่ใช่คำสั่งให้ผู้ช่วยดำเนินการภายนอก ข้อกำหนดการแข่งขันใช้วางแผน ส่วนคำแนะนำของวิทยากรใช้ประกอบดุลยพินิจ ต้องไม่ยกเกณฑ์ตัวอย่างจากงานเก่ามาแทนเกณฑ์ HR ของปีนี้

### 4.1 Sharing by HR

นอกจากโจทย์/คะแนน/เวลา หน้า 8 กำหนดเรื่อง brand & phishing protection, ตรวจ source/security และ offline หรือ controlled access ระหว่าง mentoring/pitching ก่อนปิด public access หลังใช้งาน

เอกสารใช้ถ้อยคำไม่ให้ใช้ชื่อ/โลโก้ KBank, KBTG, K PLUS หรือข้อความที่ทำให้ดูเป็น official service บนเว็บไซต์/solution ต้นแบบ ปัจจุบัน README มี public Render link และ UI มีชื่อธนาคาร จึงมีประเด็นต้องจัดการก่อนนำเสนอ การติดคำว่า demo อย่างเดียวไม่ใช่หลักฐานว่าทำตามข้อกำหนดแล้ว

ข้อเสนอสำหรับงานนี้คือใช้ชื่อทีม/ผลิตภัณฑ์บน local demo และภาพหน้าจอที่เหมาะกับข้อกำหนด ใช้ชื่อโจทย์เพื่ออธิบายบริบทในสไลด์เท่าที่ผู้จัดอนุญาต หากการใช้ brand บน deck ยังไม่ชัด ให้สอบถามผู้จัดเรื่องนั้นเฉพาะเจาะจง ช่องทางติดต่ออยู่หน้า 11 คู่มือนี้ไม่ได้ส่งอีเมลหรือปิดบริการให้เอง

### 4.2 Hack the hackathon

หน้า 6-7 แนะนำอ่านโจทย์ให้ขาด คุยผู้ใช้จริง ทำ 2-3 features สำคัญ ทดสอบกลับกับผู้ใช้ และซ้อมจับเวลาจริง หน้า 10 แนะนำเรื่องเล่า pain → solution → benefit → เริ่มทำได้จริง หน้า 12 เตือนเรื่อง buzzword และตัวเลขที่อธิบายที่มาไม่ได้ หน้า 15 แนะนำแบ่งคนตอบ Q&A ตามความถนัด

การ hardcode ทำได้เพื่อ prototype ตามคำแนะนำหน้า 7 แต่ไม่ควรเรียกค่าที่ hardcode ว่าเป็น measured accuracy หรือผลธุรกิจจริง

### 4.3 K+ Sharing

หน้า 6-7 แสดง My Budgets, My Pockets/K-Pocket และ My Asset อยู่แล้ว หน้า 4 แสดงทิศทาง Better Finance และ Security Enhancement ที่มุ่งป้องกัน fraud/mules จึงไม่ควร pitch ว่า K PLUS ไม่มีจัดการเงินหรือไม่มีการป้องกันเชิงรุก

ความต่างที่เสนอให้พิสูจน์คือการคาดการณ์ตามภาระล่วงหน้า การออมที่จำกัดด้วยสภาพคล่อง และคำเตือนรายธุรกรรมที่ผู้ใช้เข้าใจ ไม่ใช่ “สร้างกระเป๋าออมเงินเป็นครั้งแรก”

ตรวจเว็บ ธปท. เพิ่มวันที่ 16 ต.ค. พบว่าหน้ามาตรการป้องกันการใช้ระบบการเงินในทางที่ผิดอธิบายการใช้ข้อมูลบัญชีม้าร่วมกับธุรกรรมเพื่อเตือนก่อนโอนสำเร็จอยู่แล้ว จึงต้องไม่อ้างว่า pre-transfer warning เป็นสิ่งใหม่ที่ไม่มีในระบบธนาคาร ความต่างของทีมยังต้องพิสูจน์ที่ความเข้าใจของผู้ใช้ ความเหมาะสมของจังหวะ และผลเพิ่มจาก graph เมื่อเทียบระบบเดิม [แหล่ง ธปท.](https://www.bot.or.th/th/finsafeguard/finsafeguard-measure.html)

หน้า 2 แสดงข้อมูลปี 2025: ผู้ใช้ K PLUS รวม 24.2 ล้าน, active rate 78% ตามนิยาม login อย่างน้อยเดือนละครั้ง และจำนวน transactions 41,327 **ล้านรายการ** ในกราฟ อย่าสับสนจำนวนผู้ใช้ทั้งหมดกับ active users หรือจำนวนธุรกรรม และตัวเลขนี้ไม่ได้ระบุว่า first jobber มี 3.2 ล้าน

หน้า 9 แสดง Open Gateway ระหว่าง K PLUS กับ partner มี protocol, TLS, cipher, IP whitelist, authentication, rate limit, timeout ข้อมูลนี้ช่วยเข้าใจ integration แต่ไม่ได้แปลว่าทีมได้รับ API หรือบัญชีทดสอบจากธนาคารแล้ว

### 4.4 MAKE by KBank

MAKE เริ่มจากการฟังผู้ใช้และ reframe ปัญหา จากเรื่องธนาคารสู่การจัดการเงิน มี Cloud Pocket, shared money, expense summary และธุรกรรมที่อยู่ในชีวิตจริง บทเรียนสำคัญคือรู้ target customer ก่อน ใช้ design thinking ทดสอบเร็ว และคิด business ตั้งแต่วันแรก

**STP:** segmentation = แบ่งกลุ่มตามความต้องการ/พฤติกรรม; targeting = เลือกกลุ่มที่จะเริ่ม; positioning = บอกว่าเรามีคุณค่าเฉพาะอะไรสำหรับกลุ่มนั้น

**Design thinking:** empathize, define, ideate, prototype, test ทำเป็นวงรอบ ไม่ใช่เก็บ insight ครั้งเดียวแล้วถือว่าทุกอย่างถูก

**POP:** คุณสมบัติพื้นฐานที่ต้องมีเพื่อให้ใช้งานได้เทียบเท่าทางเลือกเดิม เช่นย้ายเงิน/ดูรายการ/เรียกคืน

**POD:** คุณค่าที่ต่างและพิสูจน์ได้ เช่นแจ้งเมื่อภาระกำลังเสี่ยง โดยไม่รบกวนรายการปกติ

**Commercialization:** ลูกค้ามีคุณค่า ธนาคารมีเหตุผลลงทุน และมีต้นทุน/ความเสี่ยงที่รับได้

หน้า 2 แสดง snapshot ณ Aug 2026: ผู้ใช้ MAKE 2.8 ล้าน, Cloud Pockets 11 ล้าน, MAU 66%, อายุ 20-40 รวม 70% เป็นข้อมูล MAKE ไม่ใช่ K PLUS first jobber population

หน้า 38 กล่าวว่า Cloud Pocket เก็บเงินได้ดีกว่าคนไม่ใช้ 40% จากการสำรวจผู้ใช้งานช่วง 1 ม.ค.-31 ส.ค. 2568 แต่หน้าเดียวนี้ไม่เปิด sample size หรือวิธีควบคุมความต่างระหว่างกลุ่ม จึงใช้เป็นผลสำรวจที่เอกสารรายงานได้ ไม่ใช่สรุปเชิงเหตุผลว่า feature ทำให้ทุกคนออมเพิ่ม 40% และไม่ใช่ผลของ FlowSense

## 5. ผู้ใช้และ journey ที่ควรเล่า

เลือก persona หลักสำหรับ pitch ให้แคบกว่าคำว่า “ทุก first jobber”: คนอายุ 22-30 ที่มีรายรับประจำ ภาระคงที่ ใช้ mobile banking และต้องรักษาเงินก่อนเงินเดือนรอบถัดไป เงินเดือน 18,000-35,000 บาทเป็นขอบเขต target ที่ทีมตั้ง ไม่ใช่ผลสำรวจตัวแทนทั้งประเทศ

ไฟล์ข้อมูลและสคริปต์ clustering มี persona สองกลุ่ม Paycheck-to-Paycheck Spender และ High-Yield Seeker Novice ส่วนหน้า Personas ปัจจุบันใช้ตัวละครสมมติ เมย์ นนท์ แพรว เพื่อเล่า tasks ตัวละครสามคนไม่ใช่สาม clusters และไม่ใช่ผู้ให้สัมภาษณ์จริง README ยังมีคำ Primary/Secondary อีกแบบหนึ่ง ควรตกลงนิยาม target หลักเดียวกันก่อนทำ deck อย่าอ้างว่า K-Means พิสูจน์แล้วว่าคนมีเงินเก็บมากเป็นเหยื่อ Ponzi ง่าย

journey ตัวอย่างต่อไปนี้ **เป็นสถานการณ์สมมติ**:

1. “เมย์” อายุ 25 ได้เงินเดือน 28,000 มีค่าเช่า/หนี้/ค่าน้ำไฟ
2. เปิดแอป เห็นเงินคงเหลือพร้อมภาระก่อน payday ไม่ต้องอ่านกราฟละเอียดทุกวัน
3. ระบบทดลองกันเงินเล็กน้อยเฉพาะเมื่อเงินยังพอ และเมย์เรียกกลับได้
4. เมย์ได้รับคำชวนทำงานออนไลน์ ต้องโอนเงินเพื่อรับค่าตอบแทน
5. ก่อนยืนยัน ระบบดูผู้รับและบริบทโอน หากผิดปกติแสดงเหตุผลให้เข้าใจ
6. เมย์ยกเลิกหลังทบทวน; รายการไปผู้รับปกติไม่เพิ่มขั้นตอนนอกนโยบายความปลอดภัยเดิม

การที่เมย์กดยกเลิกในเดโมพิสูจน์ว่า flow ทำงาน ไม่ได้พิสูจน์ว่า 85% ของเหยื่อจริงจะยกเลิก ควรพูดแยกสองอย่างนี้เสมอ

## 6. ชุดข้อมูลจริงใน repository

นับจาก CSV ปัจจุบัน ไม่ใช่ตาม data README:

| ไฟล์ใน data | จำนวน | ความหมาย |
|---|---:|---|
| 01_flowsense_user_profiles.csv | 1,140 บัญชี | โปรไฟล์บัญชีปกติ ผูกกับประวัติกระแสเงินสด 150 user IDs |
| 02_flowsense_cashflow_transactions.csv | 17,039 แถว | ธุรกรรมของ 150 users ช่วง 1 มิ.ย.-29 ส.ค. 2026 รวม 90 วัน |
| 03_trustgraph_users_and_mule_labels.csv | 1,200 บัญชี | ปกติ 1,140; mule 60 หรือ 5% ตามการสร้างข้อมูล |
| 04_trustgraph_fraud_transactions.csv | 6,400 รายการ | ปกติ 6,000; scam 400 หรือ 6.25% |
| 05_trustgraph_graph_node_embeddings.csv | 1,200 แถว | account ID + embeddings 16 มิติ |

ไม่พบ missing values ในห้าไฟล์ แต่ไม่มี missing ไม่ได้เท่ากับข้อมูลถูกต้อง เหมือนโลกจริง หรือเป็นตัวแทนประชากร

### 6.1 FlowSense

cashflow มี salary 450 แถว, food_daily 13,500, entertainment 2,193, utilities 450, rent 300, debt_emi 146 ตัว food_daily ใน generator รวมอาหารและเดินทางไว้แล้ว ไม่ควรนับเป็นค่าอาหารอย่างเดียว

columns สำคัญคือ user_id, timestamp, category, signed amount, balance, days_to_payday, fixed_due_in_7d, is_weekend ส่วน txn_type/necessity/merchant เพิ่มบริบท dataset แต่ไม่ได้เป็นทุก feature ที่โมเดลปัจจุบันใช้

โปรไฟล์ปัจจุบันมีเงินเดือน 20,000-38,000 บาท ขณะที่ generator ระบุชุดเงินเดือนถึง 36,000 และ target ในข้อความคือ 18,000-35,000 แปลว่า generator ปัจจุบันไม่อธิบายทุกการแก้ข้อมูลที่บันทึกไว้ ควร version data และมี preprocessing/rebuild script ที่ตรง artifact

739 จาก 1,140 profiles เป็น Paycheck-to-Paycheck (64.82%); 401 เป็น High-Yield (35.18%) เป็นการจำลอง/จัดกลุ่มในชุดข้อมูลนี้ ไม่ใช่สถิติ first jobber ไทย

`train_clustering.py` ใช้ mapping `USER_{i % 150}` ซ้ำหลายบัญชี จึงไม่ใช่ประวัติอิสระของ 1,140 คน `avg_daily_spend` คำนวณค่าเฉลี่ยต่อแถวรายจ่าย มิใช่รวมรายวันก่อนเฉลี่ย ชื่อ feature จึงอาจทำให้เข้าใจผิด

### 6.2 TrustGraph

node metadata มีอายุบัญชี KYC การผูก PromptPay และเวลาที่เงินอยู่ก่อนส่งต่อ label is_mule มาจากการจำลอง ไม่มีฐานข้อมูล AOC จริงใน repo ถึงแม้ documentation จะใช้คำ AOC Mule

generator มี scam 160 คู่: micro trial 100-400 บาท แล้วก้อนใหญ่ 18,000-65,000 ภายในประมาณ 8-14 นาที รวม 320 รายการ บวก mule-to-mule layering 80 รายการเป็น 400

ข้อมูลบัญชีปัจจุบันแยก mule อายุ 2-44 วันกับปกติ 60-1,998 วัน และเวลาส่งต่อ mule ประมาณ 10-180 วินาทีกับปกติหลายชั่วโมงขึ้นไป เส้นแบ่งชัดมาก ทำให้ปัญหาทำนายง่ายกว่าโลกจริง

ไม่มี benign new accounts หรือธุรกิจปกติที่เงินหมุนเร็วอย่างเพียงพอ ไม่มี scam ที่ไปบัญชีเก่า/ปกติถูกยึดมาใช้เพียงพอ จึงต้องเติม hard cases ก่อนพูดถึงความสามารถทั่วไป

## 7. FlowSense: สูตรและการทำงาน

### 7.1 ภาพที่ควรออกแบบ

สมการบัญชีพื้นฐาน:

`ยอดอนาคต = ยอดปัจจุบัน + รายรับสะสม - รายจ่ายจำเป็นตามกำหนด - รายจ่ายผันแปรที่คาดการณ์`

หลักการตัดสินใจควรดู **จุดต่ำสุดของยอดระหว่างทาง** ไม่ใช่ยอดวันสุดท้ายเพียงวันเดียว เพราะเงินเดือนเข้าแล้วเดือนจบเป็นบวกก็ยังอาจมีวันที่จ่ายค่าเช่าไม่พอ

ตัวอย่างสมมติ ยอด 20,000 บาท เหลือ 10 วัน รายจ่ายผันแปร 500 บาท/วัน ภาระที่ยังไม่จ่าย 10,000 และกันชน 2,000 ส่วนเกินอย่างหยาบคือ 20,000-5,000-10,000-2,000 = 3,000 บาท แต่ถ้าบิลมาถึงก่อนเงินเข้า ต้องตรวจวันที่จ่ายจริงอีกครั้ง

เงินสำรองฉุกเฉินต่างจากยอดขั้นต่ำรายวัน ธปท. อธิบายฐานคิดเป็น 3-6 เท่าของ **รายจ่ายจำเป็นและภาระผ่อนหนี้ต่อเดือน** ไม่ใช่ 3-6 เท่าของเงินเดือน [แหล่ง ธปท.](https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/256302FinancialWisdom.html)

### 7.2 Horizon API ปัจจุบัน

`get_flowsense_horizon_status` ใช้:

`daily_burn = max(spent_today, avg_daily_spend)` ในกฎกันเงินออมจำลอง

`projected_end = main_balance - daily_burn × days_to_payday - (rent + debt + utilities)`

ถ้าค่าติดลบ → COMMITMENT_AT_RISK; ถ้ายอดปัจจุบันต่ำกว่าครึ่งเงินเดือนแต่ projected_end >= 1,000 → NORMAL_DIP_SAFE; อื่น ๆ → HEALTHY_HORIZON

นี่เป็น **heuristic** ไม่ได้เรียก LightGBM ใน endpoint นี้ ค่า health percentage เป็นสูตรสัดส่วนยอดกับ fixed obligations และมี floor 15% จึงไม่ใช่ probability ว่าจะมีสภาพคล่องพอ

daily_safe_limit ปัจจุบันหัก fixed obligations และ emergency_buffer แล้ว โดยมี floor 0 บาท แต่ยังเป็นยอดจากข้อมูลจำลอง ไม่ใช่การรับรองว่าทุกบิลถูกตรวจพบ

ระบบหัก fixed obligations ทั้งเดือน ไม่ได้ตรวจว่าจ่ายแล้วหรือยัง กำหนด due day หลายรายการจาก days_to_payday และ flags ของหนี้/น้ำไฟบางตัวคง False ไม่ใช่เครื่องยนต์ตรวจครบทุกบิล วัน payday ยังสมมติเป็นวันที่ 28 แต่คำนวณวันตามปฏิทินจริง

backend repository นี้ใช้ `datetime.now()` หลายจุดโดยไม่ได้ผูก timezone ชัดเจน วันและเวลาเมื่อ deploy จึงขึ้นกับ timezone ของเครื่องบริการ ต้องทดสอบค่าที่คืนจาก API เทียบ Asia/Bangkok และค่าที่แสดงบน UI ก่อนเดโม การนับ 14 วันในหน้า React ตัวอย่างเป็นค่าคงที่เพื่อสาธิต ไม่ใช่การบอกว่าเหลือ 14 วันถึง payday จริง ณ วันที่เปิดหน้า

### 7.3 LightGBM regression

LightGBM เป็น gradient boosted decision trees: ต้นไม้หลายต้นเรียนรู้แก้ข้อผิดพลาดจากชุดก่อนหน้า เหมาะกับ features แบบตารางและการ inference เร็ว ต้นแบบใช้เป็น **regressor** สำหรับจำนวนบาทที่จ่ายต่อวัน ไม่ได้ทำนาย balance โดยตรง [Microsoft Research](https://www.microsoft.com/en-us/research/project/lightgbm/publications/)

features 6 ตัว:

1. days_to_payday: ระยะก่อนรายได้รอบหน้า
2. fixed_due_in_7d: สัญญาณภาระใกล้ถึงกำหนด
3. is_weekend: การใช้จ่ายวันหยุด
4. spend_lag_1: รายจ่ายวันก่อน
5. spend_lag_3: รายจ่าย 3 วันก่อน
6. spend_lag_7: รายจ่าย 7 วันก่อน

lag 3/7 ใน training เป็นจุดย้อนหลัง 3/7 วัน ไม่ใช่ค่าเฉลี่ย rolling 3/7 วัน โมเดลใช้ 100 estimators, learning rate 0.05, max depth 5

ข้อมูลหลังรวมรายวันและตัดช่วงไม่มี lags เหลือ 12,450 user-days การ split 80/20 ใช้ shuffle=False แต่เรียง **user_id ก่อน timestamp** จึงแบ่ง train users แรก 120 และ test users สุดท้าย 30 ในช่วงเวลาเดียวกัน ไม่ใช่ temporal holdout ตามที่ comment ระบุ

การประเมินซ้ำ saved LightGBM ได้ MAE **276.17 บาทต่อ user-day** บน 2,490 test rows; baseline lag1 = 792.63 และ lag7 = 708.96 บาท MAE ลดประมาณ 65.2% และ 61.0% เทียบสอง baseline ตามลำดับ สิ่งนี้แสดงความสามารถในชุดจำลองภายใต้ split นี้ ไม่ใช่ความแม่นยำของยอดเงิน 30 วันหรือผลกับลูกค้าจริง

`MAE = ผลรวม |ค่าจริง - ค่าทำนาย| ÷ จำนวนตัวอย่าง`

ควรรายงาน MAE แยก persona/วันจ่ายบิล/ช่วงก่อน payday และวัด false safe: ระบบบอกพอแต่เงินจริงไม่พอ นี่มีความหมายผลิตภัณฑ์มากกว่าการปรับ MAE เพียงอย่างเดียว

### 7.4 Forecast endpoint

เส้น timeline ที่คืนมามี 7 วันที่สร้างย้อนหลัง + วันนี้ + อนาคต 22 วัน = 30 จุด ไม่ใช่การพยากรณ์อนาคต 30 วัน ประวัติ 7 วันถูกสร้างจาก factors รอบ avg_spend ไม่ได้อ่าน actual bank statement ถึง field จะชื่อ actual_spend

อนาคตเรียก ONNX ของ LightGBM แล้วหัก bill วันที่ 22/26/27 ใส่เงินเดือนวันที่ 28 แต่ generator ตัด rent/debt วันที่ 1 และ utilities วันที่ 5 ต่างกัน

target ตอน train รวมรายจ่ายที่ไม่ใช่ salary ซึ่งมี bills อยู่แล้ว ถ้า serving หัก bills อีก อาจเกิดการนับซ้ำ ควรแยก target เป็น variable spending และทำ fixed obligations เป็น schedule แยก

การ update `lag_7=lag_3; lag_3=lag_1; lag_1=predicted` ไม่ใช่การขยับหน้าต่าง 1/3/7 วันที่ถูกต้อง ต้องเก็บ history window แล้วดึง index จริง ความผิดพลาดของ recursive forecasts สะสมตามเวลา ต้องวัด multi-step backtest โดยตรง

### 7.5 Safe-to-Save, Micro-Sweep และการถอนเงินออม

กฎอัตโนมัติใน API เมื่อไม่กำหนดยอด:

`safe_to_save = max(0, main_balance - ค่าใช้ชีวิตคาดการณ์ถึงวันเงินเดือนออก - บิลคงที่ - เงินสำรอง)`

`sweep = min(main_balance × recommended_rate × 0.15, safe_to_save, 500)` เมื่อผู้ใช้เปิดการแยกเงินออมแล้ว

rate ของ persona เป็น 0.06 หรือ 0.12 ยอด 20,000 กับ rate .06 จะเสนอ 180 บาทก่อนนำไปจำกัดด้วย safe_to_save และเพดาน 500 บาท ไม่ใช่ 6% ของรายได้หรือ 6% ของ surplus

guard ปัจจุบันกันค่าใช้ชีวิตคาดการณ์ถึงวันเงินเดือนออก บิลคงที่ และ emergency buffer ก่อนกวาด พร้อม opt-in และเพดาน 500 บาทต่อครั้ง แต่ยังเป็น heuristic จากข้อมูลโปรไฟล์จำลองและไม่ใช่การยืนยันว่าบิลจริงทุกใบถูกตรวจพบ endpoint ยังเรียกจากผู้ใช้/หน้าจอ ไม่พบ scheduler ออมอัตโนมัติที่รันเบื้องหลัง

ขั้นต่อไปควรใช้ตารางวันครบกำหนดของบิลจริงและตรวจยอดต่ำสุดทุกวันก่อนเงินเดือนออก พร้อมทดสอบความคลาดเคลื่อนของการคาดการณ์กับผู้ใช้จริง

การถอนเงินออมต้องระบุจำนวนที่ต้องการและถอนไม่เกินยอดบัญชีย่อย ผู้ใช้เลือกถอนบางส่วนหรือทั้งหมดได้โดยไม่มี cooldown ใน simulation ยอดยังอยู่ใน memory และยังไม่มี ledger ของธนาคาร การถอนเงินออม **ไม่ใช่การเรียกคืนเงินที่โอนไปให้มิจฉาชีพแล้ว**

1.50% ที่เคยใช้ในคำอธิบายเดโมเป็นสมมติฐาน ไม่ใช่อัตราผลิตภัณฑ์ที่ยืนยัน การตรวจหน้า React และ backend ปัจจุบันไม่พบข้อความอัตรานี้ในเส้นทางที่อ่าน จึงไม่ควรนำกลับไปใช้เป็นหัวใจ pitch โดยไม่มี product owner รองรับ

## 8. TrustGraph: โมเดลและการแทรกแซง

### 8.1 ทำไมใช้ graph

tabular model ดูข้อมูลบัญชี/รายการแต่ละแถว Graph เพิ่มบริบทว่าใครโอนหาใคร เงินไปรวมหลายต้นทางที่เดียวหรือถูกส่งต่อหลายทอดหรือไม่ ต้องตรวจว่าบริบทนี้ให้ประโยชน์เหนือ simple rules และ LightGBM without graph จริง

**Node:** บัญชี; **edge:** การโอนที่มีทิศทาง; **fan-in:** เงินเข้าจากหลายผู้ส่ง; **fan-out:** ส่งออกหลายผู้รับ; **layering:** ส่งต่อหลายทอด; **embedding:** เวกเตอร์สรุปความสัมพันธ์ที่เรียนรู้ ตัวเลข 16 มิติไม่ใช่ probability 16 แบบ และแต่ละมิติไม่จำเป็นต้องตีความเป็นเหตุผลมนุษย์ได้

R-GCN ใช้ weights ต่างกันตาม relation type แล้วรวมข้อมูลเพื่อนบ้านร่วมกับข้อมูลตัวเอง [งานวิจัยต้นฉบับ](https://arxiv.org/abs/1703.06103)

### 8.2 Tier 1

`train_trustgraph_two_tier.py` มี node features 4 ตัว: account_age/2000, kyc_level, is_promptpay_linked, log velocity ที่ normalize ใช้ layers 4→32→16 พร้อม ReLU, dropout .2 และ linear head ทำนาย is_mule ใช้ cross entropy, Adam lr .01, weight decay .0001 และ 100 epochs

embedding ถูกบันทึก CSV แล้วใช้ lookup ตอน inference ไม่ใช่รัน GNN ขนาดใหญ่ทุกครั้งที่มีการโอน นี่คือเหตุผลของสถาปัตยกรรมสอง tier: ทำ graph computation หนักก่อน แล้วใช้โมเดลเบาที่ตอนตัดสินใจ

แต่ relation types ใน code คือ `edge_type = is_scam` หรือคำตอบว่า transaction นั้น scam/normal ไม่ใช่ประเภทที่เห็นได้ก่อนตัดสินใจ เช่น channel, ownership relation, device-sharing ที่ตรวจได้แล้ว

### 8.3 Tier 2

LightGBM classifier รับ 24 features = telemetry 5 + auth one-hot 3 + target embeddings 16

telemetry คือ amount, first transfer flag, recent device switch, session duration, ratio ต่อ daily transfer average; auth one-hot คือ face_scan/none/pin โมเดล 150 estimators, lr .05, max depth 6, num_leaves 31

API คืน model score ผ่าน ONNX Runtime ก่อนเข้า policy rules score 0.9 ไม่ได้แปลว่ามีโอกาส scam จริง 90% หากยังไม่มี calibration กับประชากรจริง

FlowSense ใช้ regression เพราะต้องทำนายบาท TrustGraph ใช้ classification เพราะทำนายประเภท/score อย่าพูดรวมว่าทั้งสองเป็นโมเดลเดียวกัน

### 8.4 Logic ที่รันจริง

ลำดับของ `evaluate_transfer_v2` (ใน backend รุ่นเดิมของ repository นี้):

1. lookup target; ไม่พบ → error 404 ไม่ใช่ปล่อยผ่าน
2. รัน ONNX classifier
3. amount >= 50,000 → MICRO_AUTH_REQUIRED (demo rule)
4. target ACC_0000 หรือ scenario_mode blocked **และ** synthetic is_mule=1 → BLOCKED_MULE_INTERDICTION
5. score < .45 → APPROVED และหักยอดต้นทางใน memory
6. อื่น ๆ → MICRO_AUTH_REQUIRED + reason text

hard block จริงจึงไม่ใช่กฎ score >= .9 ตาม comment และใช้ synthetic ground truth/บัญชีเฉพาะในการเดโม ไม่มี integration blacklist จริง

การตรวจ 50,000 ก่อน hard block ทำให้ ACC_0000 ที่โอน 55,000 คืน MICRO_AUTH_REQUIRED แทน blocked ทดสอบเรียก service function แล้วพบพฤติกรรมนี้จริง ควรให้นโยบายห้ามทำรายการมี priority สูงสุด และ recheck ก่อน settlement

**วิวัฒนาการใน `K-NEXUS-Web` (ณ 17 ตุลาคม 2026):**
ใน `K-NEXUS-Web` ข้อจำกัดข้างต้นได้รับการแก้ไขและยกระดับเป็นสถาปัตยกรรมที่รัดกุม:
1. **Preview-Only Evaluation:** `evaluate-transfer` ทุกกรณีกลายเป็น preview-only ไม่มีการหักเงินทันที รายการปกติคืน `TRANSFER_REVIEW` พร้อม `review_token` (purpose="review") และผลคำนวณงบรายวันก่อน-หลังโอน
2. **Priority ของ Blocked Mule:** บัญชีม้าที่ถูกบล็อก (ACC_0000) ถูกสกัดกั้นเป็นอันดับแรกสุด (`BLOCKED_MULE_INTERDICTION`) ก่อนการตรวจยอดมูลค่าสูง ไม่สามารถ bypass ด้วยจำนวนเงินหรือโทเคนใด ๆ
3. **Server-Enforced Cooldown 15 นาที:** รายการเสี่ยง (`CRITICAL_ANOMALY`) มีเวลารอ 15 นาทีที่ควบคุมโดยเซิร์ฟเวอร์ โดยผู้ใช้สามารถกดยกเลิกเพื่อยุติรายการและตัวนับเวลาได้ทันที หรือปิดสวิตช์สำหรับการโอนครั้งต่อไปได้
4. **Fresh Plan Snapshot Enforcement:** ในจังหวะ `confirm-transfer` เซิร์ฟเวอร์จะเปรียบเทียบ snapshot แผนเงิน (ยอดเงินคงเหลือ บิลที่จ่ายแล้ว วันที่ในไทย) หากมีรายการอื่นแทรกซ้อน จะปฏิเสธด้วย HTTP 409 `PLAN_CHANGED` บังคับให้ผู้ใช้ตรวจแผนใหม่อีกครั้ง
5. **Bill Settlement Atomicity:** การจับคู่จ่ายบิลคงค้าง (`rent:...` ฯลฯ) จะหักยอดบิลออกจากภาระที่ต้องกันไว้ใน daily plan และ forecast ทันทีเมื่อโอนสำเร็จ โดยไม่นับเป็นรายจ่ายประจำวันซ้ำ และไม่ทำให้คะแนนความเสี่ยงเปลี่ยน
6. **Official Bank Contact:** กล่องเตือนความเสี่ยงมีช่องทางติดต่อ K-Contact Center 02-888-8888 เมนู 00 แจ้งภัยการเงิน 24 ชม.

**Zero-delay** ในคำอธิบายที่ถูกต้องหมายถึงไม่มีขั้นตอนเพิ่มจาก risk layer สำหรับรายการปกติภายใต้ policy เดิม ไม่ใช่ latency = 0 หรือยกเว้น authentication ที่ธนาคารกำหนด

### 8.5 เหตุผลที่แสดงให้ผู้ใช้

กฎใน code เพิ่มเหตุผลถ้าอายุบัญชี <=45 วัน, velocity <180s, session <15s, ratio >5x เมื่อไม่มีเหตุผลเหล่านี้มี generic graph warning

นี่คือ **rule-based reason text** ไม่ใช่ SHAP หรือการอธิบายเชิงเหตุผลของ GNN สมบูรณ์ ข้อความ primary บางจุดยังกล่าวว่าบัญชีเปิดใหม่/เงินไหลเร็วเสมอ แม้เงื่อนไขไม่ได้ครบ ควรสร้างข้อความจากสิ่งที่ตรวจพบจริง

ข้อความให้ผู้ใช้ควรบอก observed signal และ next action โดยไม่กล่าวหาว่าบุคคลเป็นอาชญากรจาก score อย่างเดียว เช่น “ผู้รับมีรูปแบบการรับและส่งต่อเงินที่ต้องตรวจสอบเพิ่มเติม กรุณาตรวจสอบเหตุผลการโอน” บัญชีที่ยืนยันว่าห้ามทำรายการต้องอยู่ภายใต้นโยบายแยกจาก model suspicion

### 8.6 Face scan และ counterfactual

React MicroAuthModal ปัจจุบันเป็นหน้าทบทวนตัวอย่าง กดจบหรือยกเลิกโดยไม่มีการเปิดกล้อง สแกนหน้า หรือส่งคำสั่งโอน ส่วน simulator เดิมมีบาง flow เปิดกล้องและส่ง `liveness_score=.98` ที่ frontend กำหนด API รุ่นนี้ตรวจว่าค่า >= .85 เท่านั้น ไม่วิเคราะห์ภาพใบหน้า ไม่พิสูจน์ liveness จริง ค่า default .98 ทำให้ไม่ส่ง score ก็ผ่าน การเรียก service function ซ้ำวันที่ 16 ต.ค. ยังคืน MICRO_AUTH_VERIFIED

HMAC clearance token ผูก source/target/amount และ TTL 120s เป็นส่วนควบคุมที่มีโค้ดจริง แต่ไม่ได้ทำให้ biometric ของต้นแบบเป็นระบบจริง

`trustgraph_counterfactual.py` ทดลองเปลี่ยน auth และ amount เพื่อดู score ถ้า score ลดจะเสนอ action มิฉะนั้นเสนอ cool-off 15 นาที แต่ **ไม่ได้เป็นเส้นทางหลักที่ evaluate-transfer เรียกอยู่** อย่าสลับ logic legacy นี้กับ Micro-Auth ปัจจุบัน

score ที่ลดจาก face_scan ไม่พิสูจน์ว่า recipient ปลอดภัย และการลด amount ไม่ควรถูกใช้แนะนำให้หลบเกณฑ์ความปลอดภัย

## 9. การประเมินโมเดลที่ต้องเข้าใจ

### 9.1 Data leakage ที่พบ

กราฟทั้งหมดถูกสร้างจาก 6,400 transactions พร้อม labels is_scam ทั้งหมด แล้วฝึก R-GCN กับ mule labels ของทุก node สร้าง embeddings ก่อนค่อย random split transactions 80/20 เพื่อทดสอบ LightGBM

เท่ากับ model feature ที่จะใช้กับ test เคยได้รับข้อมูลคำตอบของ test/future แล้ว การใช้ labels ที่มีจริงในอดีตเพื่อ supervised training ทำได้ แต่ต้องคุม cutoff ว่าข้อมูลใดทราบ **ก่อนเวลา prediction** ห้ามใช้ label ของ transaction ที่กำลังประเมินเป็น relation type

ตรวจ saved model ซ้ำ split นี้ 1,280 test transactions ได้ ROC-AUC 1.0, AP 1.0, TP80/TN1200/FP0/FN0 ทั้ง threshold .45 และ .5 ผลนี้ไม่ใช่ independent validation และไม่ใช่หลักฐาน production fraud accuracy 100%

นอกจากนี้ synthetic generator แยกกลุ่มง่าย และบัญชีเดียวกันอาจอยู่ทั้ง train/test จึงต้องทำ temporal holdout, unseen-account test และประเมิน embeddings ที่สร้างจาก train period เท่านั้น

### 9.2 Metrics

| Metric | สูตร/ความหมาย | ใช้ตอบอะไร |
|---|---|---|
| Precision | TP/(TP+FP) | เตือนแล้วมี scam จริงกี่สัดส่วน |
| Recall | TP/(TP+FN) | scam ที่มี จับได้กี่สัดส่วน |
| FPR | FP/(FP+TN) | รายการปกติถูกรบกวนกี่สัดส่วน |
| ROC-AUC | คุณภาพการจัดอันดับ positive/negative ตลอด thresholds | แยกกลุ่มได้ดีแค่ไหน ไม่ใช่ success rate ณ threshold เดียว |
| PR-AUC/AP | precision-recall ranking/summary | สำคัญเมื่อ scam มีสัดส่วนน้อย; AP กับ trapezoidal PR-AUC ไม่ใช่เลขเดียวกันเสมอ |
| Calibration | คะแนนสอดคล้องอัตราเกิดจริงหรือไม่ | score 0.8 แปลเป็นโอกาสจริงได้หรือยัง |
| Amount-weighted recall | ยอด scam ที่ตรวจจับ/ยอด scam ทั้งหมด | มอง exposure เป็นบาทแทนจำนวนอย่างเดียว |

accuracy อย่างเดียวไม่พอ ชุดนี้ 93.75% เป็น normal ระบบที่ทาย normal ทุกครั้งมี accuracy 93.75% แต่จับ scam ไม่ได้เลย

ตัวอย่างสมมติ 100,000 ธุรกรรม มี scam100; recall90% → TP90; FPR1% ของ normal99,900 → FP999; precision90/(90+999)=8.26% ค่า false positive ที่ดูต่ำยังสร้างภาระมากเมื่อฐาน scam ต่ำ

ตัวเลข .994 AUC, .08 falsePositiveRate, 96.8 precisionTop1Pct และ 98.4 recall เป็นข้ออ้างที่พบในการตรวจเวอร์ชันก่อน ปัจจุบันไม่พบชุดข้อความ metrics เหล่านี้ในหน้า React ที่ตรวจซ้ำ หน้า DatasetAnalyticsPage เปลี่ยนเป็นตารางตัวอย่างข้อมูลและคำอธิบายข้อจำกัดแล้ว ห้ามนำตัวเลขเก่ามาใช้ใน deck เพียงเพราะเคยอยู่บนเว็บ README/backend และไฟล์ legacy ยังต้องแยกตรวจต่อไป

“จับ scam ได้” ต่างจาก “หยุดการโอนได้” เพราะผู้ใช้ยังเลือก proceed ได้ และ “หยุดการโอนได้” ต่างจาก “ป้องกันความเสียหายเงินจริง” ต้องวัด outcome หลัง flow ครบ

### 9.3 การประเมินใหม่ที่แนะนำ

1. กำหนด prediction timestamp และ features ที่มี ณ เวลานั้น
2. ตัด graph/train/test ตามเวลา ห้าม future edges และ future labels
3. กำหนด relation จากสิ่งสังเกตได้ ถ้ามีแค่ transaction relation เดียวให้ใช้ GCN/GraphSAGE หรือ graph features ก่อน ไม่ต้องฝืนเรียก R-GCN
4. ฝึกด้วย train labels เท่านั้น คัด hyperparameters/threshold บน validation
5. เปรียบเทียบ simple rules, tabular LightGBM, tabular+graph stats, tabular+GNN embeddings
6. เก็บ test ไว้ครั้งสุดท้าย ไม่ optimize ต่อ test
7. เติม benign fast-flow/new-account และ malicious old-account เพื่อทดสอบข้อผิดพลาด
8. รายงาน confusion matrix, PR/AP, FPR, amount impact และผลแยกกลุ่ม
9. ถ้าไม่มี real data ให้ระบุว่า synthetic evaluation และใช้ผลเป็น feasibility เท่านั้น

## 10. สถาปัตยกรรมจริงกับแผนระบบจริง

**รันจริงในต้นแบบ:** React18/Router6/Vite/Tailwind → FastAPI → ONNX Runtime; โหลด CSV เป็น pandas และ dict ใน memory; แคช graph embeddings; เก็บยอดบัญชี demo ใน dict

**ฝึก/สร้าง artifact:** NumPy/pandas/scikit-learn K-Means, LightGBM, PyTorch/PyG R-GCN, onnxmltools export โมเดล LightGBM เป็น ONNX

**แผนในภาพ:** Kafka event stream, Feast feature store, Triton inference serving ไม่มี client/การเชื่อมบริการเหล่านี้จริงใน serving code ที่อ่าน ชื่อใน README/dashboard เป็น architectural proposal/simulation

**สิ่งที่จะต้องมีเมื่อใช้จริง:** durable ledger/DB, authenticated bank identities, backend-verified telemetry, bank decision policy, biometric verification service, reliable event pipeline, feature freshness/versioning, audit/control access, monitoring และ fallback ที่สอดคล้องนโยบาย

Kafka ใช้ถ่ายทอด events; Feast ช่วยจัดการ offline/online features ให้ตรงกัน; Triton ใช้จัดการ serving/inference หลายโมเดล แต่ต้นแบบขนาดนี้ ONNX Runtime + in-memory cache พอสำหรับพิสูจน์ flow อย่าอ้าง scale จากภาพที่ยังไม่มี load test

ไฟล์ legacy `ArchitecturePipeline.jsx` ยังมี TPS 18,500 แบบข้อความคงที่ แต่หน้า ArchitecturePage ปัจจุบันแสดงตารางขอบเขตและ pipeline ธรรมดา ไม่พบการ import component นี้ในหน้าปัจจุบัน ค่าคงที่ที่เหลือใน source จึงไม่จำเป็นต้องเป็นสิ่งที่ผู้ใช้เห็น อย่าอ้างว่าเป็น telemetry หรือ load test

### แยกหน้าจอให้ถูก

- React หน้า `/flowsense` มี component ที่คำนวณจาก local state/presets เป็น interactive concept
- React `/trustgraph` มีการเลือก routine/mule เพื่อสาธิต concept
- `/app` ปัจจุบันเป็นหน้าเปิดเว็บแอปอีกบริการหนึ่งผ่าน `WEB_APP_URL` ไม่ใช่ iframe simulator เดิม ส่วน `/simulator.html` ยังอยู่ใต้รายละเอียดเดโมเวอร์ชันก่อน JavaScript เดิมเรียก FastAPI ของ repository นี้หลาย flow
- `/dataset` ใช้ตัวอย่าง JS ที่เตรียมไว้ล่วงหน้าและป้ายกำกับจากชุดข้อมูล ไม่ใช่ผลทำนายสดหรือผลการทดสอบภาคสนาม
- `src/dashboard.py` เป็น Streamlit dashboard ทางเลือก ส่วนนี้ไม่ใช่ React และมี dependencies เพิ่มที่ requirements หลักไม่ได้ระบุครบ
- names WealthPilot/Sentinel เป็น legacy aliases ของ FlowSense/TrustGraph ไม่ใช่อีกสอง product ที่ต้อง pitch

## 11. Latency และความปลอดภัยของต้นแบบ

### 11.1 อ่าน latency ให้ถูก

P50 = median; P95/P99 = percentile ที่ 95%/99% ของค่าต่ำกว่าหรือเท่าค่านั้นโดยประมาณ P99 ไม่ใช่ maximum และ 200 samples ไม่ใช่ production peak/concurrency test

README ระบุ P50 3.85, P95 5.11, P99 11.62, core .27, FlowSense10.29 ms แต่ `benchmark_latency.py` ทำ warmup10 แล้วส่ง **sequential** ผ่าน TestClient ใน process เดียว ไม่ผ่านอินเทอร์เน็ต app จริง/core banking แปล P95 เป็น “high concurrency” ไม่ได้ และ <80ms เป็นเป้าหมายที่ repo ตั้ง ไม่พบว่าเป็น SLA ที่ผู้จัด/ธนาคารรับรองใน PDF

การตรวจรอบก่อน TestClient runs ไม่จบและถูกหยุด วันที่ 16 ต.ค. นี้ไม่ได้รัน full HTTP benchmark ซ้ำ จึงไม่ได้ยืนยันค่าทั้ง API ตาม README แต่รันการเรียก **service functions โดยตรง** ใหม่ ด้วย ONNX intra/inter-op threads=1, warmup10, sequential ได้:

| ขอบเขต | จำนวน | P50 | P95 | P99 |
|---|---:|---:|---:|---:|
| TrustGraph service function | 200 | .027 ms | .064 ms | .124 ms |
| FlowSense timeline service function | 100 | .586 ms | 1.053 ms | 1.130 ms |

ตัวเลขนี้ไม่รวม HTTP/middleware/network/DB/core banking ไม่ควรใช้แทน 11.62ms หรือกล่าวว่าเร็วกว่า production SLA ผลขึ้นกับเครื่อง/config และไม่ได้เป็น throughput result

`latency_ms` ใน evaluate-transfer หยุดจับเวลาก่อนบาง policy/state operations จึงไม่ใช่เวลาตลอด request

แผนวัดใหม่ควรแยก model time, feature lookup, service/HTTP time, end-to-end time วัด cold/warm, expected load/peak load, account diversity, error rates และระบบ remote ที่ใกล้ deployment จริง

### 11.2 มี controls อะไรแล้ว

พบ input validation, headers/CORS, rate limit 300 req/min/IP, HMAC signature ผูกบัญชีและยอด TTL120s, locks ต่อบัญชี, idempotency cache TTL600s, account masking/audit log และ model SHA256 checks มีพื้นฐานในการต่อยอด แต่ชื่อ “banking hardened/PDPA compliant” ใน comment ไม่ใช่ใบรับรอง

### 11.3 ประเด็นสำคัญที่พบ

- confirm-transfer ตรวจ auth token **เฉพาะเมื่อผู้เรียกส่งมา** เรียก service function โดยไม่ส่ง token แล้วคืน TRANSFER_EXECUTED ได้
- token verifier ยังยอมรับ legacy token prefix และ nonce ไม่มี registry เพื่อ consume token ครั้งเดียว
- confirm ไม่ตรวจ target risk/block policy ใหม่ จึงไม่ได้สร้าง transaction state machine ที่บังคับลำดับ evaluate→auth→confirm
- liveness score รับจาก client/default ไม่มีการวิเคราะห์ภาพฝั่ง server
- ไม่พบระบบ login/authorization ที่ผูก API caller กับบัญชีที่อ้างใน request; unknown source บาง flow fallback ACC_0100
- evaluate low-risk หักยอดด้วย แม้ชื่อเหมือน read-only evaluation และ endpoint นี้ไม่มี idempotency guard; retry เสี่ยงทำซ้ำใน demo state
- locks/idempotency/state อยู่ memory ของ process เดียว ไม่ใช่ atomic durable ledger หลาย workers; key ไม่ผูก request content/user และ cache check แยกจาก mutation
- ใช้ float กับยอดเงิน แทน integer satang/decimal ที่ควบคุม rounding
- checksum mismatch เป็น warning แต่ health response ยังคืน model_integrity_verified=True แบบคงที่
- มี reset-state route เพื่อเดโม ต้องปิด/จำกัดสิทธิ์หากนำไปใช้เกิน demo

ข้อเสนออันดับแรกสำหรับ backend repository นี้ก่อนใช้เป็นเดโมหลัก: บังคับ server-side decision state, require verified token เมื่อ policy กำหนด, ตัด legacy bypass, block policy มาก่อน biometric, ให้ verify flow ระบุชัดว่า simulation, ทำ account auth และแยก evaluate ออกจาก execute สิ่งนี้ยังไม่ได้แก้ในงานอ่าน/อธิบายครั้งนี้

แยกเวอร์ชัน: โค้ด `K-NEXUS-Web/src/app_v2.py` ที่หน้าเว็บชี้ไป ได้รับการยกระดับความปลอดภัยครบถ้วนตามหลัก Security by Design (ณ 17 ต.ค. 2026):
- แยก session ของผู้เยี่ยมชมออกจากกันอย่างเด็ดขาดด้วย HttpOnly signed cookie (`DemoSession`)
- บังคับตรวจ token ก่อน confirm ทุกครั้ง และแยก purpose ระหว่าง `review` (สำหรับรายการปกติ) กับ `micro_auth` (สำหรับรายการเสี่ยง) ป้องกันการนำ token รายการปกติมาอนุมัติรายการเสี่ยง
- มี pending step-up และ server-enforced cooldown 15 นาที โดยคำนวณเวลาจาก server deadline ไม่อิงนาฬิกาของเบราว์เซอร์
- มีระบบ Fresh Plan Snapshot (`plan_fingerprint`) ตรวจสอบความสดของแผนเงินก่อนหักเงินจริง หากยอดคงเหลือ บิล หรือวันที่เปลี่ยนไประหว่างรอ จะตอบกลับ HTTP 409 `PLAN_CHANGED`
- สกัดกั้นปลายทางที่ถูกบล็อก (ACC_0000) ตั้งแต่เริ่มประเมิน ไม่สามารถใช้ยอดมูลค่าสูงหรือ token ใด ๆ มา bypass ได้
- บังคับใช้ CSRF token (`X-CSRF-Token`) และ Idempotency Key (`X-Idempotency-Key` UUID) ในทุก POST request ป้องกัน double debits
- ป้องกัน DoS ด้วย Body Limit Middleware (สูงสุด 8 KiB ต่อคำขอ) และ rate limit แยก IP/session

อีกฝั่งยังคงเป็นต้นแบบที่ใช้ `verification_mode=SIMULATED` และป้าย `is_mule` ในข้อมูลจำลองช่วยบังคับ score ขั้นต่ำ .45 เพื่อให้สาธิตโฟลว์ได้ จึงต้องแยก demo policy ออกจากผลโมเดลด้วย การอ่านนี้เป็นการเปรียบเทียบเชิงวิศวกรรม ไม่ใช่ security certification ของระบบธนาคารจริง

สำหรับข้อมูลจริงให้คุยผู้รับผิดชอบเรื่องวัตถุประสงค์/ฐานการประมวลผลข้อมูล retention/access/cross-bank sharing ไม่ควรสรุปว่าใช้ consent อย่างเดียวพอหรือ masking แล้วผ่านทุกข้อกำหนด

ธปท. มีมาตรการ biometric สำหรับวงเงินรายครั้ง/สะสมรายวันและการปรับวงเงิน พร้อมเปิดให้ธนาคารเข้มขึ้นตามความเสี่ยง โค้ดที่ตรวจเฉพาะยอด >=50,000 ต่อครั้งจึงไม่ได้แสดง compliance ครบ และ face scan5s ไม่ใช่เวลาที่กฎหมายรับรอง [คำถาม-คำตอบ ธปท. 2023](https://www.bot.or.th/content/dam/bot/documents/th/news-and-media/news/2023/news-20230309-qa.pdf), [มาตรการยกระดับ 2024](https://www.bot.or.th/th/news-and-media/news/news-20240613.html)

## 12. ทะเบียนตัวเลข: อะไรพูดได้ อะไรต้องแก้

| ตัวเลข/ข้อความ | สถานะและการใช้ที่ถูกต้อง |
|---|---|
| อายุ 22-30 | โจทย์ผู้จัด HR หน้า 3 |
| รายได้ 18k-35k | target definition ของทีม ยังไม่ใช่สถิติประเทศ |
| 60-68% เงินสำรอง<3 เดือน | README อ้าง PIER/SET แต่ยังตามถึง source ที่ยืนยันเลขนี้และช่วงอายุนี้ไม่ได้ ควรถอดจาก pitch จนมีที่มา |
| 45% เหยื่ออายุ 20-30 | ยังไม่ยืนยัน source ที่ตรงประชากร/ช่วงเวลา อย่ารวมอายุ 20-49 มาสรุปเป็น 20-30 |
| 2.0B ความเสียหายต่อปี | ยังไม่ระบุประเภทภัย อายุ ช่วงเวลา และฐานคำนวณที่ตรวจได้ |
| คนไทยมีเงินออมฉุกเฉิน 77.6%, >=6 เดือน 23.7% | ธปท.ผลสำรวจ 2567 เป็นบริบทประชากรในรายงาน ไม่ใช่สัดส่วน first jobber โดยเฉพาะ |
| K PLUS users24.2M | snapshot2025 ใน K+ Sharing ไม่ใช่ first jobber count |
| first jobbers3.2M | พบใน code เป็น assumption; ไม่พบที่มายืนยันใน PDF4 ไฟล์ที่อ่าน |
| MAKE2.8M/66%MAU/70%age20-40 | MAKE snapshotAug2026 ห้ามแทน K PLUS22-30 |
| CloudPocket+40% | ผลสำรวจที่ MAKE deck รายงานช่วง Jan-Aug2025 ไม่ใช่ FlowSense และยังไม่พิสูจน์ causality |
| profiles1,200 / cashflow18,000+ | actual1,140 profiles /17,039 rows ต้องแก้ข้อความ |
| mule5% / scam6.25% | สัดส่วน synthetic dataset ไม่ใช่ prevalence ของธนาคาร |
| persona64.82% | synthetic clustering output ไม่ใช่ user insight/สำรวจไทย |
| FlowSense MAE276.17 | saved model, synthetic, user-based80/20 split ไม่ใช่ temporal forecasting test |
| AUC.994/Recall98.4/Top1Precision96.8 | ข้ออ้างจาก UI รุ่นก่อน หน้า React ปัจจุบันนำออกแล้ว ยังไม่มี valid evaluation รองรับสำหรับนำกลับไปใช้ |
| AUC1.0 ที่ประเมินซ้ำ | split/embeddings เดิมมี leakage ไม่ควรโฆษณาว่า production accuracy |
| >85% /89.4% สกัดกั้น | goal/display constant ไม่ใช่ผล user trial |
| prevented fraud9,764,707.39 บาท | ผลรวมยอด scam ใน CSV ไม่ใช่เงินจริงที่ป้องกันแล้ว |
| CASA1.2-2.0B /1.64B | projection/hardcoded scenario ยังไม่มี validation |
| P99 11.62ms /10.88ms | README/constant display ต้องระบุ benchmark scope; ครั้งนี้ไม่ยืนยัน full API |
| SLA80ms | team target จนกว่าจะมีหลักฐาน official SLA |
| 30-dayforecast | code คืน 30 จุดแต่อนาคต 22 วัน |
| 5sface liveness | flow legacy/API รุ่นนี้ ไม่ใช่ biometric model ที่พิสูจน์แล้ว เว็บอธิบายปัจจุบันใช้หน้าทบทวน อีกเว็บแอปมี policy ทบทวนต่างออกไป |
| 1.50% ดอกเบี้ยที่เคยอ้าง | historical demo assumption ไม่ใช่เงื่อนไขบัญชีที่ยืนยัน ไม่พบในหน้า React/backend ปัจจุบันที่ตรวจ |
| TPS18,500 | UIscenario constant ไม่ใช่ load test |

บริบทสภาพการออมตรวจจาก [สรุปผลสำรวจ ธปท.2567](https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/phrasiam-69-1/FL-Survey-Report-2567.html) ใช้แทนการยกเลขที่ไม่มี source ได้ แต่ควรสร้างหลักฐาน user segment ของทีมเพิ่มเติม

รายงานหน่วยงานรัฐที่พบแยกผู้เสียหายกลุ่ม 20-49 และช่วงอายุอื่น จึงไม่รองรับ 45% ของ 20-30 โดยตรง [รายงาน AOC1 ปี](https://www.prd.go.th/th/content/category/detail/id/39/iid/340072)

## 13. Business case ที่ไม่สับสนเงินย้ายกับเงินเพิ่ม

CASA = current account/savings account balances เป็นฐานเงินฝาก แต่ **ย้ายจากบัญชี KBank หลักไป KBank ย่อยไม่ได้เพิ่มยอดฝากรวมธนาคารทันที** ต้องมี external inflow, retention ที่ดีขึ้น, net new savings หรือป้องกัน outflow จึงมี incremental value

ยิ่งคืนเงินง่าย เงินอาจถูกถอนกลับบ่อย ต้องวัด outstanding retained balance และค่าเฉลี่ยช่วงเวลา แยกจาก gross sweep volume

สูตร scenario:

`adopters = eligible_users × adoption_rate`

`gross_sweep_annual = adopters × sweep_per_month × 12`

`incremental_retained_balance = adopters × average_balance_incremental_vs_baseline`

`annual_net_value = balance_value + fraud_loss/cost_avoided + retention_value - deposit_interest_cost - infrastructure/ops_cost`

ค่า default ใน Streamlit คือ 3.2M ×35% ×1,200 ×12 = **16.128 พันล้านบาท gross annual sweep** ไม่ใช่ 1.64B และไม่ใช่ average CASA stock ตัวเลข 1.64B ใน API เป็นค่าคงที่อีกทางหนึ่ง

ตัวอย่างที่ใช้บน pitch ได้หากติดป้าย scenario: eligible100,000 ×adoption20% =20,000 active adopters; ถ้าแต่ละคนมีเงินคงเหลือเพิ่มจริงเฉลี่ย 1,000 บาทเหนือ baseline → incremental balance20 ล้านบาท ไม่ใช่ยอดที่ทีมทำได้แล้ว

ประโยชน์ fraud ต้องเริ่มจาก detection rate × user response/policy enforcement × outcome จริง พร้อม false positive cost ไม่ใช่คูณจำนวน scam ที่สร้างแล้วเรียกทั้งหมดว่า prevented

การนำเงินฝากไปคูณ margin/ดอกเบี้ยหรือการนับรายได้ต้องใช้สมมติฐาน product/finance owner ตัวเลขยอดฝากไม่ใช่กำไร และบัญชีดอกเบี้ยสูงมี funding cost ที่ต้องนับ

## 14. KPI และแผนทดสอบที่นำไปใช้ต่อได้

| มิติ | KPI หลัก | ข้อควรระวัง |
|---|---|---|
| FlowSense prediction | MAE และ false-safe rate ก่อน bill | ไม่ใช้ daily MAE แทน 30-day balance accuracy |
| Liquidity outcome | วันเงินไม่พอจ่ายภาระ/overdraft ลดหรือไม่ | แยกผลรายได้และการเปลี่ยนพฤติกรรมอื่น |
| Saving | net savings/retained balance เทียบ baseline | gross sweep สูงแต่ recall สูงอาจไม่เกิดออมจริง |
| TrustGraph model | PR/AP,recall,FPR,amount-weighted recall | กำหนด threshold ก่อน finaltest |
| Warning UX | อ่านเหตุผลถูก/ยกเลิกเมื่อเสี่ยง/เวลาเพิ่ม | อย่านับ cancel ทุกอันเป็นความสำเร็จ |
| Normal payment UX | additional-step rate,completion,abandonment | ต้องไม่ลด security controls เดิม |
| Reliability | P95/P99,error rate,availability | ระบุ load,เครื่อง,network scope |
| Business | retention/incrementaldeposits/opscost | ไม่ตีความ DAU สูงว่าดีเสมอ ผู้ใช้อาจเปิดเพราะกลัว |

ผู้ใช้ 8-12 คนอายุ 22-30 สำหรับรอบแรกเป็น **แผน qualitative research** ไม่ใช่จำนวนที่ทำแล้ว เลือกหลายรายได้/ภาระ/ประสบการณ์ อย่าใช้กลุ่มเพื่อนที่เหมือนกันทั้งหมด

interview 15-20 นาที: ให้เล่าเงินไม่พอล่าสุด เกณฑ์ที่ตัดสินใจแยกเงิน และรายการโอนที่เคยไม่มั่นใจ หลีกเลี่ยงถามนำว่า “อยากมี AI ออมเงินใช่ไหม” อย่าขอ PIN/OTP/statement จริง

usability tasks: อ่านสถานะและบอกเงินที่กันไว้; ทดลอง sweep/recall; โอนปกติ; เจอ warning แล้วอธิบายเหตุผล ระบุผลจำนวนคนและ sample อย่างตรงไปตรงมา เช่น 6/8 คนตีความถูก ไม่เรียก 75% เป็นสถิติตลาด

เปรียบเทียบ warning ทั่วไปกับ warning ที่บอกเหตุผล โดยสลับลำดับงานเพื่อลด learning effect ใช้สถานการณ์สมมติและบันทึกว่าการทดสอบไม่มีเงินจริง

## 15. สิ่งที่ต้องแก้และจัดลำดับก่อนส่งสไลด์

### ต้องทำก่อนอ้างหลักฐานบนเวที

1. ถอดหรือเปลี่ยน label ตัวเลขที่ไม่มีแหล่ง; ทำ claim register ที่ทุกคนในทีมใช้ตรงกัน
2. แก้ graph leakage และประเมินใหม่ หรือยอมรับเป็น graph feasibility demo โดยไม่โชว์ accuracy claim
3. เลือก forecast horizon ที่ทำจริง แก้ target / bill double count / lag window ให้ตรงกัน
4. ต่อ guard ปัจจุบันเข้ากับตารางบิลและยอดต่ำสุดในอนาคตที่ตรวจสอบได้ ก่อนอ้างว่าปลอดภัยในระบบจริง
5. ทำ transaction policy/state machine ให้บังคับ auth/block ได้จริงใน demo และบอก biometric เป็น simulation
6. เลือก demo path เดียวและ snapshot ที่ตรง API ลดความต่างของ mockReact กับ simulator
7. จัด brand/controlled access ตาม HR และตรวจ security ก่อน event

### ถ้ามีเวลาเพิ่ม

เพิ่ม user research, graph ablation, temporal / unseen account tests, error/fallback cases, scoped latency report และ business scenario ที่มีสูตรครบ

### ยังไม่จำเป็นสำหรับพิสูจน์ครั้งนี้

ไม่ต้องติดตั้ง Kafka/Feast/Triton เต็ม stack เพียงเพื่อใส่โลโก้ ไม่ต้องเพิ่มอีกสิบ features หรือหลาย persona ให้สองสาม journeys ตอบโจทย์และมีหลักฐานก่อน

MVP ที่เหมาะสม: horizon ตามบิล → ออมและเรียกคืนที่ไม่ทำให้เงินขาด → pre-transfer risk explanation กับ normal flow เป้าหมาย scam ต้องชัดใน rationale และ demo ตามโจทย์

## 16. โครง pitch 3 นาที

เป้าซ้อม 2:45-2:50 เพื่อเผื่อกด slide และหยุดหายใจ ไม่เร่งอ่านให้พอดี 3:00 ทุกครั้ง ใช้ประมาณ 6 slides และ one main speaker ถ้าทีมทำได้ดีแบบนั้น

| เวลา | slide | เนื้อหาและภาพ |
|---|---|---|
|0:00-0:25|1: Pain|ผู้ใช้หนึ่งคนกับเงินที่ต้องจ่าย/รายการโอนเสี่ยง อย่าเปิดด้วยรายชื่อ AI |
|0:25-0:50|2: Insight|หลักฐานผู้ใช้จริงที่เก็บแล้วและทำไมวิธีเดิมยังมีช่องว่าง |
|0:50-1:15|3: Solution|FlowSense รักษาสภาพคล่อง;TrustGraph ช่วยก่อนโอน ภาพ journey เดียว |
|1:15-2:00|4: Demo|normal transfer เทียบ warning+cancel แล้วภาพออม/recall สั้น ใช้ คลิป offline ได้ |
|2:00-2:30|5: Feasibility|รันโมเดล/flow ได้จาก synthetic;อะไรพิสูจน์แล้ว;ขั้นต่อไป |
|2:30-2:50|6: Value & Next|ประโยชน์ต่อผู้ใช้,ประโยชน์ต่อ K PLUS,ขอบเขต pilot และประโยคจำง่าย |
|2:50-3:00|Buffer|เวลาสำรอง |

หัวข้อ slide ควรบอกข้อสรุป เช่น “เงินในบัญชีไม่ใช่เงินที่ใช้ได้ทั้งหมด” “เตือนก่อนโอนเมื่อมีเหตุผลต้องตรวจ” ไม่ใช้ชื่อกว้างอย่าง Architecture อย่างเดียว

สคริปต์ฐานต่อไปนี้เป็น draft สำหรับจับเวลาจริง ไม่ได้แทนผล interview ที่ยังไม่ได้เก็บ:

> “สำหรับคนเริ่มทำงาน เงินก้อนแรกต้องใช้ทั้งค่าเช่า บิล และเป็นเงินสำรอง แต่ยอดคงเหลืออย่างเดียวไม่ได้บอกว่าเงินส่วนไหนจำเป็นต้องรักษาไว้ และเมื่อถูกชวนให้โอนเงินเพื่อรับงานหรือผลตอบแทน การยืนยันตัวตนก็ไม่ได้บอกว่าผู้รับปลอดภัย
>
> ทีมเราจึงเสนอ FlowSense & TrustGraph ผู้ช่วยที่ทำงานในสองจังหวะก่อนเงินออกจากบัญชี
>
> FlowSense ช่วยประเมินยอดที่จะเหลือหลังภาระใกล้ถึงกำหนด เพื่อให้เห็นความเสี่ยงล่วงหน้า และทดลองแยกเงินออมก้อนเล็กที่เรียกกลับได้เมื่อจำเป็น ส่วน TrustGraph ดูบริบทผู้รับและรายการโอน เพื่อแสดงเหตุผลให้ทบทวนเฉพาะรายการเสี่ยง
>
> ในเดโมนี้ รายการปกติเดินต่อภายใต้ขั้นตอนความปลอดภัยเดิม แต่เมื่อพบผู้รับที่มีสัญญาณต้องตรวจ ระบบบอกเหตุผลก่อนผู้ใช้ยืนยัน ผู้ใช้จึงมีโอกาสยกเลิกก่อนเสียเงิน
>
> ต้นแบบมี API และโมเดลที่รันได้บนข้อมูลจำลอง เราแยกงานสร้างบริบทกราฟออกจากการประเมินรายการเพื่อให้ส่วนตัดสินใจเบา ผลกับลูกค้าจริงยังเป็นขั้นที่ต้องพิสูจน์ และขั้นต่อไปคือการประเมินที่แยกข้อมูลตามเวลาและทดสอบความเข้าใจของผู้ใช้
>
> คุณค่าสำหรับผู้ใช้คือเห็นเงินที่ต้องรักษาและทบทวนรายการเสี่ยงได้ทัน สำหรับธนาคารคือโอกาสเพิ่มความไว้วางใจและเงินคงเหลือ โดยวัดเทียบ baseline เป้าหมายต่อไปคือ pilot ขนาดเล็กภายใต้นโยบายธนาคาร เพื่อพิสูจน์ว่าช่วยลดความเสี่ยงโดยไม่รบกวนการใช้ชีวิตประจำวัน”

ก่อนใช้ script ให้ปรับประโยคฟีเจอร์ให้ตรงสถานะหลังแก้;ถ้ายังไม่ได้แก้ sweep guard ให้พูดว่า“ออกแบบให้”หรือ“flow จำลอง” และแทนส่วน insight ด้วยผล user research ที่ทำจริง ห้ามเติมผล 8/10 หรือ 89.4% เอง

## 17. โครง pitch 7 นาที

ทำ deck และ backup พร้อมก่อน 7 พ.ย. เพราะตาม HR ทั้งสองรอบอยู่วันเดียวกัน ไม่ควรรอทราบผลแล้วค่อยสร้าง final deck;ยังต้องยืนยันกับผู้จัดว่า final slides ส่งเมื่อไรและ Q&A รวมใน 7 นาทีหรือไม่

| เวลา | เรื่อง |
|---|---|
|0:00-0:40|ผู้ใช้และเหตุการณ์ pain ที่จำได้ |
|0:40-1:20|insight จาก user research และ gap กับทางเลือกเดิม |
|1:20-2:00|solution และเหตุผลของ 2-3features |
|2:00-3:10|demo journey,normal path,suspicious path,next action |
|3:10-4:00|data และ two-tier approach ที่ตรง implementation |
|4:00-4:50|validation,baselines,limits และสิ่งที่เรียนรู้ |
|4:50-5:40|user/businessimpact พร้อม scenario formula |
|5:40-6:20|pilot,security/integration,resource/cost scope |
|6:20-6:40|ปิดด้วยคุณค่าและ next step |
|6:40-7:00|buffer |

ใช้ประมาณ 9-10slides ถ้าเนื้อหาและจังหวะเหมาะ ถ้า Q&A นับในเวลาต้องลดเวลาพูดตามกติกาจริง ตารางนี้สมมติ 7 นาทีเป็น presentation time

backup slides: data dictionary/synthetic generation,validated confusion matrix,ablation,FlowSense backtest,latency scope,transaction state machine,policy/unknownrecipientfallback,business scenario,brand/access plan

## 18. Q&A ที่ควรตอบได้

**ทำไมเป็นสองโมดูล?** เราออกแบบ journey รักษาเงินก่อนเงินออก ทั้งสภาพคล่องและผู้รับโอน แต่ยังไม่ได้พิสูจน์ว่าการผสานดีกว่าแต่ละส่วนแยก ต้องให้ user research ตอบและคุม scope

**ต่างจาก K-Pocket/MAKE อย่างไร?** ไม่อ้างว่ากระเป๋าออมใหม่ จุดที่เสนอคือ decision ตามภาระล่วงหน้าและ recipient context ก่อนโอน ต้องเปรียบเทียบกับของเดิมและทดลองว่าเพิ่มคุณค่าจริง

**มีผู้ใช้จริงหรือยัง?** ชุด ML เป็น synthetic;จำนวน interview/usability จะรายงานเฉพาะที่ทำจริง หากยังไม่มีให้ยอมรับและบอกแผน ไม่ใช้ 1200accounts เป็น 1200customer trial

**ใช้ข้อมูลอะไร?** cashflow history,recurring obligations,recipient metadata,transactiongraph/sessioncontexts ภายใต้สิทธิธนาคาร ต้นแบบยังไม่ดึงข้อมูลจริงและยังไม่ได้รับ partner API

**ทำไม LightGBM?** features ตาราง/ข้อมูลไม่มาก/ต้อง inference เบาเป็นจุดเริ่มที่เหมาะ แต่ต้อง เปรียบเทียบ baselines ไม่อ้างเหนือทุกโมเดลเสมอ

**ทำไม graph?** ต้องการดูความสัมพันธ์นอกบัญชีเดียว เป้าหมาย ablation คือพิสูจน์ incremental benefit ถ้ากฎ/tabular ดีพอให้เลือกแบบง่ายกว่า

**R-GCNrelation คืออะไร?** โค้ดปัจจุบันใช้ scam label ซึ่งทำให้เกิด leakage ต้องแก้เป็น relation ที่ทราบก่อน prediction หรือเปลี่ยน model ห้ามปกปิดด้วยคำว่า heterogeneous graph

**ทำไม AUC สูงมาก?** dataset จำลองแยกง่ายและ evaluation เดิมมี leakage จึงไม่ใช้เลขนั้นยืนยันโลกจริง ต้องประเมินใหม่แบบ cutoff และ hard cases

**ความแม่นยำเงิน 30 วัน?** โมเดลเดิมวัด daily spend MAE;timeline ปัจจุบันอนาคต 22 วัน ยังไม่ใช่ 30-day backtest ควรบอกผลเฉพาะที่วัดได้

**ถ้าออมแล้วเงินไม่พอ?** เดโมกันค่าใช้ชีวิต บิล และเงินสำรองก่อนกวาด พร้อม opt-in/เพดานต่อครั้ง และผู้ใช้ถอนเงินออมตามจำนวนที่ต้องใช้ได้ตามปกติ แต่ยังต้องตรวจบิลจริงตามวันครบกำหนดก่อนใช้ในระบบธนาคาร

**ทำไมไม่เตือนทุกครั้ง?** falsealarm ทำให้ผู้ใช้ข้าม จึงต้องวัด precision/FPR กับ fraud missed และ user completion

**สแกนหน้าช่วย scam อย่างไร?** ไม่ได้พิสูจน์ผู้รับปลอดภัย เหยื่อจริงสแกนผ่านได้ protection หลักเป็น recipient context+warning+policy ไม่อ้าง 5s ลด loss ได้โดยตัวมันเอง

**บัญชีถูกยืนยันว่าห้ามโอนแต่ผู้ใช้อยากโอน?** bank policy มี priority เหนือ user override โมเดล suspicion กับ confirmed blocklist เป็นคนละสถานะ

**ผู้รับใหม่ไม่มี embedding?** demo ปัจจุบัน 404 production ต้องมี cold start features/fallback และ policy routing ไม่ควรปล่อยว่า lowrisk อัตโนมัติ

**Kafka/Feast/Triton ทำแล้วหรือยัง?** ยังเป็น target architecture;demo ใช้ FastAPI+ONNX+dictcache

**11.62ms วัดอย่างไร?** README อ้าง TestClient แบบ sequential ไม่ใช่ bank end-to-end ครั้งนี้ยังไม่ยืนยัน fullAPI อธิบาย scope และ report ที่ทีมเก็บใหม่

**เงินฝากเพิ่ม 1.64B จากไหน?** API เป็น scenario constant ต้องแทนด้วย formula/baseline และแยกเงินย้ายภายในจาก net new balance

**security พร้อมจริงหรือไม่?** มี controls บางอย่าง แต่ต้องปิด token bypass,ตรวจ biometric ฝั่ง server,account authorization และ durable ledger ก่อนใช้จริง

**ถ้า prediction ผิด/ระบบล่ม?** ต้อง fallback ภายใต้นโยบายธนาคาร เก็บ riskreason/version และมี humanreview/appeal flow อย่าเลือก fail-open ทั้งระบบโดยไม่แบ่ง risk

**สิ่งที่ต้องการจาก KBTG ต่อไปคืออะไร?** คำแนะนำจาก risk/product owner,ข้อมูลที่อนุญาตและ sandbox,ร่วมกำหนด success criteria สำหรับ pilot ไม่กล่าวว่าต้องเชื่อม production ทันที

ตอบแต่ละข้อให้เริ่มคำตอบตรง ๆ ตามด้วยเหตุผลและหลักฐานหนึ่งอย่าง จบด้วยข้อจำกัด/ขั้นต่อไปเฉพาะที่เกี่ยวข้อง ฝึก version20-30 วินาทีและ 60 วินาทีสำหรับ technical question

## 19. แผน 16 ต.ค.-7 พ.ย.

| วันที่ | งาน | สิ่งที่ต้องมีเมื่อจบ |
|---|---|---|
|16 ต.ค.|อ่านคู่มือ/กำหนด persona/story/claim register|ทีมอธิบาย problem-solution ได้ตรงกันและรู้เลขที่ยังใช้ไม่ได้ |
|17-19 ต.ค.|interview 8-12 คนและ usability รอบแรก|pain/quote ที่ได้รับอนุญาตใช้ + finding ที่เปลี่ยนการออกแบบจริง |
|20-22 ต.ค.|แก้ leakage/forecast/sweep/auth policy สำคัญ|evaluation ใหม่หรือ scope ที่ซื่อสัตย์,demo path คงที่ |
|23-24 ต.ค.|ทำ 3-minute draft และ 7-minute skeleton|ทุก slide ตอบเกณฑ์หนึ่งเรื่องและระบุ source/scenario |
|25-26 ต.ค.|ทดสอบ user รอบสอง/ซ้อม Q&A|ข้อความอ่านออก,ข้อผิดพลาดลด,คำตอบไม่ขัด demo |
|27-28 ต.ค.|จับเวลาหลายรอบ/บันทึกเดโม offline/ตรวจ slides|3-minute จบใน 2:45-2:50,คนไม่รู้ project เล่าคุณค่าได้ |
|29 ต.ค.|freeze 3-minute deck/export/check|ไฟล์พร้อมส่ง 1 วันก่อน deadline,สำรองเปิดได้จริง |
|30 ต.ค.|ส่งตามช่องทาง/เวลาที่ผู้จัดกำหนด|หลักฐานส่งและ version ที่ตรงกัน |
|31 ต.ค.-2 พ.ย.|เติม final evidence/business/pilot/backup|7-minute deck พร้อมก่อนทราบผลรอบแรก |
|3-5 พ.ย.|mock judging/technical Q&A/demo runs|คนตอบแต่ละประเภทชัด,แก้คำพูดเกินหลักฐาน |
|6 พ.ย.|ตรวจเครื่อง/ไฟล์/controlled access และพัก|พร้อม present โดยไม่พึ่ง network |
|7 พ.ย.|pitch 3 นาที และถ้าผ่านใช้ 7 นาที ที่เตรียมไว้|เดโม/สไลด์ version เดียวกับที่ซ้อม |

ถ้าทรัพยากรน้อย prioritize user insight,ความถูกต้องของข้อกล่าวอ้าง,หนึ่ง demo journey และ policy หลักก่อน infra ใหม่ คนพูดไม่จำเป็นต้องเป็นคนทำ ML ทั้งหมด แต่ต้องตอบแกนได้และส่งต่อ technical Q&A ให้ทีมอย่างชัดเจน

การซ้อมแต่ละวัน: รอบแรกเนื้อหา,รอบสองจับเวลา,รอบสามรับคำถาม ถ้าซ้อม 10 ครั้งแล้วเวลายังแกว่งมากให้ลดประโยค/feature ไม่พูดเร็วขึ้นอย่างเดียว

## 20. ตรวจความเข้าใจด้วยตัวเอง

ลองตอบโดยไม่เปิดเอกสาร:

1. ผู้ใช้หลักของเราเป็นใครและเหตุการณ์ pain ล่าสุดคืออะไร?
2. ยอดเงินคงเหลือต่างจากเงินใช้ได้อย่างไร?
3. วันต่ำสุดของยอดกับยอดสิ้นเดือนต่างกันอย่างไร?
4. FlowSense ทำนายรายจ่ายหรือ balance และมี features อะไร?
5. daily MAE บอกอะไรและไม่บอกอะไรเกี่ยวกับ 30 วัน?
6. snapshot30 จุดมีอนาคตกี่วัน?
7. สูตร sweep จริงคืออะไรและ guard ยังขาดอะไร?
8. recall เรียกคืนเงินแบบไหน?
9. node/edge/embedding/R-GCNrelation คืออะไร?
10. อะไรใน training ทำให้ test label leak เข้า features?
11. 24features ของ TrustGraph มาจากอะไร?
12. score สูง,confirmed blacklist และ authenticated user ต่างกันอย่างไร?
13. liveness จริงกับ client score ต่างกันอย่างไร?
14. precision/recall/FPR ต่างกันอย่างไรและทำไม accuracy ไม่พอ?
15. graph มีประโยชน์เพิ่มจาก rules/tabular เท่าไร และยังไม่พิสูจน์ตรงไหน?
16. P99 ต่างจาก max/throughput อย่างไร?
17. Kafka/Feast/Triton อยู่ในระบบจริงส่วนไหนหรือยังเป็น proposal?
18. ตัวเลขบน UI ใด hardcoded และเลขไหนมี artifact วัดจริง?
19. gross sweep,retained balance,incremental CASA และกำไรต่างกันอย่างไร?
20. ถ้ามีเวลา 180 วินาทีกรรมการควรจำอะไรสามเรื่อง?

เข้าใจ project100% ไม่ใช่จำศัพท์ได้ทุกคำ แต่ต้องอธิบายเส้นทาง **ปัญหา → ข้อมูล → วิธีตัดสินใจ → สิ่งที่ผู้ใช้ทำ → ผลที่วัด → ข้อจำกัด** ได้ครบ และยอมรับสิ่งที่ยังไม่รู้โดยไม่แต่งคำตอบ

## 21. เดินตามตัวเลขหนึ่งเคสให้ครบ

ตัวเลขต่อไปนี้เป็นโจทย์สมมติสำหรับเรียนรู้ ไม่ใช่ข้อมูลบัญชีจริง และไม่ใช่ผลประเมินโมเดล

### 21.1 ตัวอย่างหน้า FlowSense ที่อยู่ในเว็บไซต์นี้จริง

ค่าเริ่มต้นหน้า React: เงินบัญชีหลัก 24,500 บาท บิล 5,650 บาท เงินสำรอง 5,000 บาท งบรายวัน 600 บาท และระยะสมมติ 14 วัน

1. เงินหลังกันบิลและสำรอง = 24,500 - 5,650 - 5,000 = 13,850 บาท
2. งบเฉลี่ยที่แบ่งใช้ได้ = 13,850 / 14 = 989.29 บาทต่อวัน
3. ถ้าตั้งงบวันละ 600 บาท คาดว่าเหลือก่อนเงินเดือน = 24,500 - 5,650 - 600 × 14 = 10,450 บาท
4. ส่วนที่พร้อมออมตามสูตรตัวอย่าง = 10,450 - 5,000 = 5,450 บาท
5. component ย้ายออมครั้งละ min(150, capacity) = 150 บาท หลังผู้ใช้เปิดเองและกดปุ่ม
6. หลังออม เงินบัญชีหลักเหลือ 24,350 บาท บัญชีออมเพิ่ม 150 บาท เงินรวมสองบัญชีไม่เปลี่ยน
7. ถ้าเพิ่มงบเป็น 1,000 บาทต่อวัน จะเหลือ 24,500 - 5,650 - 14,000 = 4,850 บาท ต่ำกว่าเงินสำรอง 150 บาท capacity เป็น 0 จึงกดออมเพิ่มไม่ได้
8. ถอนเงินออม 1,000 บาทกลับบัญชีหลักได้หากบัญชีออมมีพอ ไม่มีการสร้างรายได้หรือย้อนคืนธุรกรรมโอน

989.29 เป็นค่าเฉลี่ยตามสมมติฐาน ไม่ใช่คำแนะนำใช้จ่ายสำหรับลูกค้าทุกคน การเปลี่ยนงบในหน้านี้ไม่ใช่การฝึกหรือเรียก LightGBM และไม่เปลี่ยนบัญชีของเว็บแอปอีกบริการหนึ่ง

### 21.2 ตัวอย่าง backend ใน repository นี้

สมมติเงินหลัก 20,000 บาท เหลือ 10 วัน ค่าใช้ชีวิตที่ใช้คำนวณ 500 บาทต่อวัน บิลรวม 10,000 บาท และเงินสำรอง 2,000 บาท

`projected_end = 20,000 - 500 × 10 - 10,000 = 5,000`

`safe_to_save = max(0, 5,000 - 2,000) = 3,000`

ถ้า recommended_rate=.06 ยอดแนะนำก่อน cap = 20,000 × .06 × .15 = 180 บาท จากนั้นจำกัดด้วย min(3,000,500) จึงออม 180 บาทได้เมื่อ opt-in ค่า .06 และ .15 เป็นกติกาที่ทีมเลือก ไม่ใช่ทฤษฎีว่าทุกคนควรออมในอัตรานี้

เหตุที่ UI ตัวอย่างออม 150 บาทแต่ backend แนะนำ 180 บาทในเคสนี้: คนละสูตรและคนละชั้นของระบบ อย่าเรียกสองภาพว่าเป็นผลโมเดลชุดเดียวกัน ควรใช้ demo path เดียวใน pitch

### 21.3 ตัวอย่าง TrustGraph

สมมติผู้ใช้กรอกโอน 20,000 บาทไปผู้รับใหม่ มี recipient embedding และ telemetry เช่น session 12 วินาที ยอดโอน 10 เท่าของค่าเฉลี่ย โมเดลคืน score ก่อน policy พิจารณาว่าเข้ากฎ block, high-value gate หรือ threshold หรือไม่

การออกแบบที่ต้องการคือแยกอย่างน้อยสามสถานะ: รายการปกติ, รายการควรทบทวน, รายการห้ามทำตามนโยบาย อย่าให้ score จาก ML มีอำนาจยกเลิก confirmed block หรือทำให้สแกนหน้าแล้วลบความเสี่ยงผู้รับ

เมื่อผู้ใช้กดยกเลิกในตัวอย่าง แปลว่า flow ยกเลิกรายการสมมติได้ ยังไม่ทราบว่าเขาจะยกเลิกเมื่อถูกหลอกจริงหรือไม่ การวัดผลของโมเดล การวัดความเข้าใจคำเตือน และการวัดเงินจริงเสียหายต้องเป็นคนละการทดลอง

## 22. ทฤษฎีที่ควรอธิบายด้วยภาษาของตัวเอง

### 22.1 แยก descriptive, predictive และ decision policy

- Descriptive: อธิบายอดีต เช่น ใช้เงินกับอะไรไปแล้ว
- Predictive: ประมาณอนาคต เช่น พรุ่งนี้จะจ่ายกี่บาท หรือรายการนี้มี score เท่าไร
- Decision policy: ตัดสินใจว่าจะให้เห็นอะไร/ทำอะไรต่อ เช่น ไม่เสนอออมเมื่อไม่เหลือสำรอง หรือให้ทบทวนรายการ

โมเดลดีไม่ได้ทำให้นโยบายดีโดยอัตโนมัติ ถ้า forecast แม่นแต่ UI บอกว่าทุกบาทใช้ได้ หรือ fraud score ดีแต่ confirm ข้าม policy ได้ ผลิตภัณฑ์ยังไม่บรรลุเป้าหมาย

### 22.2 Regression, classification และ clustering

Regression ทำนายจำนวนต่อเนื่อง ใช้กับจำนวนบาท Classification ทำนายประเภทหรือคะแนน ใช้กับ scam/normal Clustering จัดกลุ่มจากความคล้ายโดยไม่มี label กลุ่มที่ถูกต้องให้เรียนรู้ตรง ๆ ชื่อ persona เป็นการตีความภายหลัง

K-Means พยายามลดผลรวมระยะห่างกำลังสองระหว่างแต่ละตัวอย่างกับจุดศูนย์กลางของกลุ่ม: `sum ||x_i - centroid_cluster(i)||²` ต้นแบบกำหนด K=2 เอง ไม่ได้ค้นพบจากข้อมูลว่าโลกจริงมีสองบุคลิกเท่านั้น

ก่อนจัดกลุ่มใช้ StandardScaler: `z=(x-mean_train)/std_train` เพื่อไม่ให้ feature หน่วยบาทระดับหมื่นกลบ feature สัดส่วนระดับ 0-1 แต่ initial_vault และ high_yield_intent มีการจำลองกำหนดไว้ก่อน การจัดกลุ่มตามตัวแปรเหล่านี้จึงไม่ใช่การค้นพบพฤติกรรมจริงหรือพิสูจน์สาเหตุของการถูกหลอก

### 22.3 Gradient boosting และการฝึกกับการทำนาย

ภาพจำของ boosting คือให้ต้นไม้ชุดใหม่แก้ข้อผิดพลาดของผลรวมก่อนหน้า: `prediction = initial_value + learning_rate × sum(tree_outputs)` การฝึกปรับต้นไม้จากข้อมูล ส่วน inference ใช้ต้นไม้ที่ฝึกเสร็จแล้วให้คำตอบ ไม่ได้เรียนรู้ใหม่ทุกครั้งที่ผู้ใช้กดปุ่ม

hyperparameters ที่ทีมใช้เป็นค่าตั้งต้น เช่น 100/150 ต้น learning rate .05 และ depth 5/6 ไม่ใช่ผลพิสูจน์ว่าเหมาะที่สุด ต้องเลือกบน validation ที่ไม่ปน test

ONNX เป็นรูปแบบ artifact สำหรับนำโมเดลไปเรียกใช้ ส่วน ONNX Runtime เป็น engine ที่รัน artifact การ export ไม่แก้ bias, leakage หรือคุณภาพข้อมูล ควรตรวจผล `.txt` กับ `.onnx` ว่าใกล้กันด้วยก่อนย้ายระบบ

### 22.4 Graph และเหตุผลของสอง tier

ถ้าบัญชี A รับเงินจากคนหลายคนแล้วส่งไป B และ C อย่างรวดเร็ว การดูเฉพาะรายการหนึ่งอาจไม่เห็นโครงสร้างทั้งหมด GNN เรียนรู้ representation โดยรวมข้อมูลของ node และเพื่อนบ้าน ส่วน R-GCN แยกน้ำหนักตาม relation type

แนวคิดย่อของ R-GCN: `h_next(v)=activation(self_term(v)+sum_over_relations(sum_over_neighbors(weight_relation × h_neighbor / normalization)))` อ้างอิงงาน Modeling Relational Data with Graph Convolutional Networks ไม่จำเป็นต้องท่องสูตรบนเวที แต่ต้องตอบว่า relation มาจากไหนและทราบเมื่อใด

ต้นแบบทำ graph embedding ไว้ล่วงหน้า แล้ว lookup 16 ตัวเลขมาใช้กับ LightGBM ตอนโอน ข้อดีที่ต้องทดสอบคือเวลาตอบสนอง ข้อแลกเปลี่ยนคือ graph ที่ stale และบัญชีใหม่ที่ยังไม่มี embedding การอัปเดตกราฟ ความสดของ label และ cold start จึงเป็นงาน production ที่ยังเหลือ

### 22.5 Threshold คือการแลกต้นทุน ไม่ใช่เลขมหัศจรรย์

ลด threshold มักเพิ่มรายการที่ถูกเตือน ทั้ง scam ที่จับได้และรายการปกติที่ถูกเตือน ควรเลือกจาก validation โดยคิดต้นทุน false positive, false negative, เวลารอ และความเสียหายเป็นบาท ค่า .45 ใน code ไม่ใช่มาตรฐานสากลหรือเกณฑ์ที่ผู้จัดกำหนด

ตัวอย่าง base rate ในส่วน 9 แสดงว่า recall สูงก็ยัง precision ต่ำได้เมื่อ scam หายาก จึงต้องเลือกจุดทำงานที่ยอมรับ false alarm ได้ และรายงานประชากร/ช่วงเวลาที่ใช้วัด

### 22.6 Prediction, association และ causation

หากผู้ใช้ Cloud Pocket มีเงินเก็บมากกว่า อาจเป็นเพราะคนที่ตั้งใจออมอยู่แล้วเลือกใช้ จึงไม่ควรสรุป causal effect โดยอัตโนมัติ เช่นเดียวกับคนที่สมัคร FlowSense อาจมีแรงจูงใจต่างจากคนไม่สมัคร

หากต้องการพิสูจน์ผลต่อการออมควรออกแบบ pilot ที่มี baseline และกลุ่มเปรียบเทียบที่เหมาะสม วัดระยะเวลาเท่ากัน หักการย้ายเงินภายในและการถอนกลับออก ก่อนอ้างเงินออมเพิ่มจาก feature

### 22.7 ความเสี่ยงที่ต้องเปลี่ยนเป็นกรณีทดสอบ

ข้อมูลย้อนหลังไม่ครบ → แสดงความไม่แน่นอนและให้ปรับภาระ; รายได้ไม่สม่ำเสมอ → ไม่สมมติ payday เดียว; บิลจ่ายแล้ว → ไม่นับซ้ำ; ผู้รับใหม่ → มี cold-start route; โมเดลล่ม → fallback ตามนโยบาย; ผู้ใช้ไม่เข้าใจคำเตือน → ปรับข้อความและวัด comprehension; เงินออมถอนคืนสูง → วัด net retained แทน gross sweep

รายการเหล่านี้คือความต้องการออกแบบและตรวจ ไม่ใช่ข้ออ้างว่าทำครบแล้ว

## 23. เตรียมหลักฐานและสคริปต์ให้ตอบกรรมการได้

### 23.1 บัตรตัวเลขหนึ่งใบต่อหนึ่ง claim

เขียน claim, ประเภทหลักฐาน, หน่วย, ประชากร/จำนวนตัวอย่าง, ช่วงเวลา, split/cutoff, baseline, source/code, ข้อจำกัด และประโยคที่อนุญาตให้พูด

ตัวอย่าง: “MAE 276.17 บาท/user-day, 2,490 แถวจาก 30 synthetic users, 8 มิ.ย.-29 ส.ค. 2026, reproduce saved model บน user-based split เดิม, lag1 792.63, ไม่ใช่ 30-day forward evaluation” ถ้าพูดข้อจำกัดนี้ไม่ทันใน 3 นาที ให้เก็บตัวเลขไว้ backup และพูดเพียงว่ามีต้นแบบการทำนายที่ต้องประเมินอนาคตเพิ่ม

### 23.2 ข้อความสั้นที่สอดคล้องหลักฐานปัจจุบัน

- “ข้อมูลสังเคราะห์ 1,200 บัญชีและ 6,400 ธุรกรรมสำหรับทดสอบต้นแบบ” ใช้ได้
- “ทดสอบกับลูกค้า 1,200 คน” ใช้ไม่ได้จากข้อมูลชุดนี้
- “มี API และโมเดลที่เรียกใช้งานได้ในเครื่อง” ใช้ได้จากการตรวจครั้งนี้
- “เชื่อม K PLUS แล้ว” ใช้ไม่ได้จากหลักฐานปัจจุบัน
- “เรากำลังพิสูจน์ว่าเหตุผลที่ตรงบริบทช่วยให้ผู้ใช้ตัดสินใจก่อนโอนดีขึ้น” เป็น objective ที่เหมาะสม
- “สแกนหน้า 5 วินาทีป้องกัน scam ได้ 85%” ยังไม่มีหลักฐาน
- “ออมโดยผู้ใช้เปิดและสั่งเองภายในความสามารถออมตามกติกา” ตรงต้นแบบปัจจุบันกว่า “ระบบออมให้ทุกวันโดยอัตโนมัติ”

### 23.3 ลำดับเล่าเรื่องที่แนะนำ

โจทย์เน้น scam/fraud ควรให้ TrustGraph และเหตุการณ์ก่อนโอนเป็นแกน แล้วใช้ FlowSense อธิบายว่าเงินก้อนเดียวกันจำเป็นต้องรักษาไว้จ่ายภาระ หาก user research ไม่พบว่าผู้ใช้ต้องการสองส่วนร่วมกัน ให้เลือกส่วนหลักและลดอีกส่วนเป็นบริบทหรือ roadmap การเชื่อม narrative ไม่ใช่หลักฐานว่า ML ทั้งสองโมเดลผสานแล้ว

รอบ 3 นาที: หนึ่งเหตุการณ์ หนึ่ง journey หลัก หนึ่งข้อแตกต่างที่พิสูจน์ได้ หนึ่ง next step เปิดให้เห็นว่าปัญหาสำคัญ ทางแก้สมเหตุผล และควรฟังต่อ ไม่ต้องเล่า hyperparameters ทุกตัว

รอบ 7 นาที: เพิ่ม user evidence, สถาปัตยกรรมจริง, baseline/evaluation, failure cases, business assumptions และ pilot plan ให้ครบเกณฑ์ 100 คะแนน ใช้ backup รองรับรายละเอียด

### 23.4 แผน pilot เป็น proposal ไม่ใช่ผลสำเร็จ

ช่วงแรกใช้ scenario tests และ shadow mode ที่ไม่สั่งโอน/ระงับเงินจริง เปรียบเทียบระบบปัจจุบันกับกฎง่ายและ graph เพิ่มเติม เก็บ false alarm, comprehension และ latency หลังหน่วยงานธนาคารอนุมัติจึงค่อยกำหนด controlled pilot พร้อมสิทธิข้อมูลและเงื่อนไขหยุดทดลอง

ตัวอย่างเป้าหมายที่ต้องตกลง ไม่ใช่ผลที่ทำได้แล้ว: จำนวนผู้ใช้ที่อ่านเงินพร้อมใช้ถูก; recall ณ FPR ที่รับได้; อัตรารายการปกติที่เพิ่มขั้นตอน; retained balance เทียบ baseline; เวลาและ error ภายใต้ load ที่กำหนด หลีกเลี่ยงเลือก target หลังดูผล test

### 23.5 เรื่องที่ต้องยืนยันจากประกาศล่าสุดก่อนส่ง

เวลาปิดรับวันที่ 30 ต.ค., ชนิดและขนาดไฟล์, มี template หรือไม่, final deck ส่งเมื่อไร, 7 นาทีรวม Q&A หรือไม่, อนุญาตคลิป/เสียง/เดโมแบบใด และข้อใช้ brand บน deck กับ prototype นี่เป็นรายการตรวจของทีม ไม่ใช่เหตุให้หยุดเตรียมเนื้อหาที่ทำได้แล้ว

## 24. ผลตรวจรอบ 16 ต.ค. และขอบเขตความมั่นใจ

- ตรวจ PDF ต้นฉบับ 4 ไฟล์ รวม 83 หน้า สกัดข้อความและอ่านภาพส่วนสำคัญ ใช้ HR สำหรับเกณฑ์ปีนี้
- นับ CSV ทั้งห้าไฟล์ใหม่ ตัวเลขในส่วน 6 ตรงไฟล์ปัจจุบัน
- reproduce saved-model metrics ใหม่ ตัวเลข MAE 276.17 และ AUC/AP 1.0 ยังเหมือนเดิม โดยข้อจำกัดของ split/leakage ยังอยู่ ไม่ได้ retrain แบบแก้ leakage
- เรียก service functions ใน process ทดสอบใหม่ ยืนยัน timeline 7+1+22, confirm ไม่ส่ง token ใน backend รุ่นนี้ยัง execute ได้ และ default liveness ยังผ่าน ยอดที่เปลี่ยนอยู่ใน process ทดสอบ ไม่ใช่ธนาคารจริง
- ชุดทดสอบออมเดิม 3 tests ผ่าน: กันรายจ่าย/บิล/สำรอง; opt-in/เพดาน/ไม่พอเงิน; ถอนบางส่วนและทั้งหมด ผลนี้ครอบคลุมกติกาที่ทดสอบ ไม่ใช่รับรองผลิตภัณฑ์หรือความแม่นยำพยากรณ์ทั้งระบบ
- อ่าน React ปัจจุบันแล้วแยก local concept examples, legacy simulator, API ของ repository นี้ และเว็บแอปอีก repository ออกจากกัน
- ไม่ยืนยัน deployment ล่าสุด ไม่ทดสอบ runtime ของเว็บแอปอีก repository ไม่แก้ source ผลิตภัณฑ์ ไม่ส่งข้อความภายนอก ไม่ commit/push/deploy

วิธีประเมินความเข้าใจ: ทำส่วน 20 โดยไม่เปิดคู่มือ แล้วสุ่มตัวเลขหนึ่งตัวอธิบายบัตร claim ให้ครบ ทำเลขตัวอย่างส่วน 21 ใหม่ และวาดเส้นทาง feature จาก data ถึงผลบน UI โดยระบุว่าเป็น repo/เวอร์ชันไหน ข้อที่อธิบายที่มาไม่ได้คือรายการเรียนหรือทดสอบต่อ ไม่ควรท่องให้ดูมั่นใจแทนความเข้าใจ

## หลักฐานสำหรับกลับไปอ่าน

### PDF ที่ผู้ใช้ให้

- [Sharing by HR](<C:/Users/Acer/Downloads/KBTG Kampus Hackathon/Sharing by HR.pdf>): PDF3 โจทย์;4track guidance;6 รอบ 3min;7final criteria;8rules;9timeline;11contact
- [Hack the hackathon](<C:/Users/Acer/Downloads/KBTG Kampus Hackathon/Hack the hackathon.pdf>): PDF6-7 เตรียมงาน;10story;12dos/donts;14 เกณฑ์เก่าที่ไม่ใช่ปีนี้;15teamQ&A
- [K+ Sharing](<C:/Users/Acer/Downloads/KBTG Kampus Hackathon/K+ Sharing_V2.0.0.pdf>): PDF2 ปี 2025users;4security/finance;6-7features;9gateway;10-14partner journeys
- [MAKE product development](<C:/Users/Acer/Downloads/KBTG Kampus Hackathon/MAKE by KBank_Product Development from Innovation to Commercialization.pdf>): PDF2snapshot;4-18research/innovation;19-27parity/difference;28-39scale/commercialization;38survey40%

### Source/ผลตรวจใน workspace

- [README](<D:/All Project/k-flowsense-trustgraph/README.md>) และ [Data dictionary](<D:/All Project/k-flowsense-trustgraph/data/README.md>): คำอธิบายที่ต้องเทียบ implementation
- [Serving](<D:/All Project/k-flowsense-trustgraph/src/app_v2.py>):โมเดล/cache/policy/forecast/sweep/recall/dashboardconstants
- [FlowSense training](<D:/All Project/k-flowsense-trustgraph/src/train_flowsense_cashflow.py>)
- [TrustGraph training](<D:/All Project/k-flowsense-trustgraph/src/train_trustgraph_two_tier.py>)
- [Clustering](<D:/All Project/k-flowsense-trustgraph/src/train_clustering.py>) และ [Synthetic generator](<D:/All Project/k-flowsense-trustgraph/mock/generate_mock_data.py>)
- [ONNX export](<D:/All Project/k-flowsense-trustgraph/src/export_to_onnx.py>) และ [Benchmark scope](<D:/All Project/k-flowsense-trustgraph/src/benchmark_latency.py>)
- [Static analytics values](<D:/All Project/k-flowsense-trustgraph/frontend/react-app/src/data/datasetAnalyticsData.js>)
- [Current model/data audit](<D:/All Project/k-flowsense-trustgraph/tmp/pitch_audit/current_metrics.json>)
- [Direct service audit](<D:/All Project/k-flowsense-trustgraph/tmp/pitch_audit/api_audit.json>)

### แหล่งภายนอกที่ตรวจในครั้งนี้

- [ผลสำรวจทักษะทางการเงิน ธปท.2567](https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/phrasiam-69-1/FL-Survey-Report-2567.html)
- [ฐานคิดเงินสำรองฉุกเฉิน ธปท.](https://www.bot.or.th/th/research-and-publications/articles-and-publications/bot-magazine-issues/256302FinancialWisdom.html)
- [มาตรการ biometric ธปท.2023](https://www.bot.or.th/content/dam/bot/documents/th/news-and-media/news/2023/news-20230309-qa.pdf)
- [มาตรการยกระดับภัยทุจริต ธปท.2024](https://www.bot.or.th/th/news-and-media/news/news-20240613.html)
- [มาตรการป้องกันการใช้ระบบการเงินในทางที่ผิด ธปท.](https://www.bot.or.th/th/finsafeguard/finsafeguard-measure.html): ตรวจหน้าเว็บวันที่ 16 ต.ค. 2026 มีบริบทมาตรการเตือนก่อนธุรกรรมสำเร็จอยู่แล้ว
- [เว็บไซต์ KPLUS](https://www.kasikornbank.com/th/kplus):มี management/securityfeatures แล้ว ใช้ตรวจคำอ้างช่องว่างอย่างระมัดระวัง
- [LightGBM primary research](https://www.microsoft.com/en-us/research/project/lightgbm/publications/)
- [R-GCN original paper](https://arxiv.org/abs/1703.06103)

ข้อเท็จจริงจากภายนอกที่ระบุปีเป็นข้อมูลบริบทตามปีนั้น ไม่ใช่ยืนยันว่ากติกาทุกข้อ/ตัวเลขธุรกิจยังเหมือนเดิมในวันใช้งานจริง การนำระบบเข้าสู่ธนาคารต้องยืนยัน policy และกฎหมายล่าสุดกับผู้รับผิดชอบ
