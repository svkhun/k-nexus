ทำงานใน D:\All Project\k-flowsense-trustgraph (Showcase) เท่านั้น
Application D:\All Project\k-web-application อ่านอย่างเดียว

เป้าหมายรอบนี้: ปิด browser QA ของ Showcase ที่ซิงก์กับ baseline Application แล้ว ไม่เพิ่ม feature และไม่เปิดรอบวิจัย ML ใหม่

อ่านก่อน:
- docs/application-baseline-2026-10-29/README.md
- docs/application-baseline-2026-10-29/SOURCE_MANIFEST.json
- output/showcase-baseline-sync-20261029/final-checks.json
- output/showcase-baseline-sync-20261029/static-render-checks.json
- output/showcase-baseline-sync-20261029/preservation.json
- Application BASELINE_INTEGRATION_REPORT.md และ SHOWCASE_HANDOFF.md หากต้องเทียบที่มา

สถานะตั้งต้น:
- Application baseline ใช้ใน local แล้ว; FlowSense ML ยังปิด; TrustGraph คู่เดิม
- Showcase i18n 6, plan 5 และ build ผ่าน; React static render 6/6 ไม่ใช่ browser proof
- การเปิด preview ผ่าน IAB ค้างแล้ว connection timeout; HTTP loopback จาก sandbox ถูกปฏิเสธ WinError 10013 อย่านับเป็น PASS และอย่าลด security เพื่อเลี่ยงข้อจำกัด

ขอบเขตงาน:
1. ตรวจ Git status และรักษางานค้างทั้งหมด โดยเฉพาะ dist เดิม ใช้ build แยกใน output/showcase-baseline-sync-20261029/build ถ้าต้อง build เพิ่ม
2. ใช้ browser ใน environment ที่เชื่อม localhost ได้ เปิด preview แยกพอร์ต 8036 หรือพอร์ตว่างที่ตรวจแล้ว ห้าม reset หรือหยุด process/session Application ของผู้ใช้
3. ตรวจ Home, FlowSense, Architecture ไทย/อังกฤษ เปิด evidence disclosure และ historical results อย่างน้อยหนึ่งครั้ง ตรวจ desktop และ narrow viewport; อย่าเรียก viewport จำลองว่า iPad จริง
4. ยืนยันเนื้อหาจริงบนหน้าจอ:
   - default persona SCENARIO N0/28: 350/600/300 บาท/วัน ไม่รวมบิล ไม่ใช่ measured history
   - HISTORY_MEAN N7/28 ภาพทดสอบมี fixture disclosure ชัด ไม่อ้างเป็น history จริง
   - ABSTAIN แสดงว่า unavailable ไม่ใช่ zero spending หรือ safe forecast
   - กราฟเป็น current/as-of + 30 future dates เริ่ม spending พรุ่งนี้ ไม่ใช่ midnight-issued ML forecast
   - Gate2 ไม่ผ่าน, Direct ML เป็น development และ historical MAE ไม่ใช่ baseline chart accuracy
   - ลิงก์สาธารณะยังไม่ยืนยัน deployed version ของ baseline
5. ตรวจภาพไม่หาย ข้อความไม่ทับ/ล้นจนอ่านไม่ได้ ปุ่ม disclosure ใช้ keyboard ได้ และไม่มี runtime console error ถ้าเครื่องมืออ่าน console ได้
6. หากพบปัญหา แก้เฉพาะ copy/assets/layout ที่จำเป็นและตรวจซ้ำตามส่วนที่แก้ ไม่แก้ financial logic/API/config/models/data/contract หรือ Application
7. ถ้า browser/loopback ยังใช้ไม่ได้ ให้เก็บ error แล้วสรุป BLOCKED พร้อมคำสั่งเปิด preview ห้ามใช้ static HTML หรือ Node tests แทน browser PASS และไม่ขยาย scope ไปแก้ environment/security

ส่งมอบ:
- docs/application-baseline-2026-10-29/BROWSER_ACCEPTANCE.md ระบุ URL/build, browser/viewport/language, เคสที่ตรวจจริง, ภาพ/DOM หลักฐาน, PASS/FAIL/BLOCKED และสิ่งที่ไม่ได้ตรวจ
- เปรียบเทียบ hashes กับ preservation snapshot; แยกไฟล์แก้ในรอบนี้ออกจากงานเดิม
- ถ้าผ่าน ให้สรุป LOCAL_BASELINE_DELIVERY_ACCEPTED ตามขอบเขต local synthetic demo เท่านั้น ML/production ไม่ได้รับอนุมัติไปด้วย

ห้าม train/tune/accuracy evaluation/model load/export/ML activation/commit/push/deploy และห้ามแก้ Application
หยุดเมื่อ browser QA ตามรายการเสร็จหรือมี blocker ที่พิสูจน์แล้ว ไม่สร้าง contract/amendment/audit รอบใหม่โดยไม่มีปัญหาจริง

หมายเหตุ preservation: Application Git metadata เป็น UNKNOWN เพราะอ่านไม่ได้ ตรวจยืนยันได้เฉพาะ accessible file hashes อย่ารายงานว่า HEAD/index ผ่านหากยังไม่มีหลักฐานจริง
