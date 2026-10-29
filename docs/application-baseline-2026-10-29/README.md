# Showcase alignment with the local Application baseline

29 October 2026 · Asia/Bangkok

**SHOWCASE_COPY_AND_BUILD_COMPLETE_BROWSER_QA_BLOCKED**

รอบนี้ปรับคำอธิบายและภาพหลักฐานฝั่ง Showcase ให้ตรงกับ Application baseline ที่ผู้ใช้ส่งมอบ ไม่ได้แก้ Application หรือเปลี่ยนผลการตรวจรับ ML

## สิ่งที่ตรวจจาก source จริง

อ่าน `BASELINE_INTEGRATION_REPORT.md`, `SHOWCASE_HANDOFF.md`, persona config, serving config และ evidence ฝั่ง Application พร้อม pin SHA-256 ใน [SOURCE_MANIFEST.json](SOURCE_MANIFEST.json) หลักฐานการทดสอบ Application เป็นของรอบ Application ไม่ใช่การรันทดสอบซ้ำโดย Showcase

- Persona ทั้งสามใช้ SCENARIO N0/28: เมย์ 350, นนท์ 600, แพรว 300 บาท/วัน ไม่รวมบิล จาก `synthetic-persona-assumptions.2026-10-29.1` ไม่ใช่ measured history หรือ legacy transaction mean
- Policy คือ HISTORY_MEAN 28 closed dates/min7 → explicit SCENARIO → ABSTAIN; unknown ไม่แทนศูนย์
- Adapter เริ่ม current balance/as-of แล้วสมมติ spending ตั้งแต่พรุ่งนี้ รวม 30 วันอนาคต ไม่ใช่ midnight issuance ไม่หัก posted-today ซ้ำ บิล/เงินเดือนเป็น projected state บนสำเนา
- Forecast/plan/savings/transfer ใช้ spending basis และ outstanding bills ถึงก่อน payday ถัดไปตรงกัน รวม next-month bills; สถานะเปลี่ยนต้อง review ใหม่
- Runtime Application เปิดเฉพาะ TrustGraph คู่เดิม; FlowSense ML ยัง false และ baseline switch แยกกัน
- Gate0/1 รับ contract/data สำหรับ synthetic research แล้ว แต่ Gate2 candidate ไม่มี horizon ผ่าน ไม่มี qualifying export; Direct ML เป็น development เท่านั้น
- Application รายงาน backend 148, frontend 26, build, real HTTP และ bounded browser smoke ผ่าน ไม่ใช่ production, real-bank, physical iPad หรือ field-outcome evidence

## สิ่งที่แก้ใน Showcase

1. README: แสดง baseline ปัจจุบันและสถานะ contract/data/ML แทนข้อความเก่าที่บอก Gate0 ยังเปิดและ chart ใช้ profile average
2. Home/FlowSense/Architecture/Persona/evolution copy: ปรับไทยและอังกฤษผ่าน shared content โดยรักษาเนื้อหาอื่นเดิม
3. หน้า FlowSense: แสดง policy, persona N0/28, origin semantics, unknown/null และ source evidence ที่ตรวจได้
4. แสดง Gate2 paired cumulative MAE พร้อมตัวหารจาก `diagnostics.json` ไม่ใช้ conditional scores สวมเป็น paired; เปิดเผย candidate-only อีก 6 origins ต่อ horizon
5. เก็บผล one-step package 2026.10.27.1 ใน disclosure ว่าเป็นหลักฐานประวัติ คนละข้อมูล/protocol และไม่ใช่ accuracy ของ baseline graph
6. เพิ่มภาพ Application exact-byte 3 ภาพ พร้อม caption: default SCENARIO, HISTORY fixture ที่เขียนมือ, ABSTAIN fixture ไม่อ้างว่าเป็น actual persona history
7. แจ้งข้างลิงก์ Application สาธารณะว่ายังไม่ยืนยันว่าเป็น build baseline ที่ตรวจใน local

ไม่มีการแก้ Showcase API/legacy forecast logic, Application, contract revisions, accepted dataset, models, embeddings หรือ study outputs เดิม

## ผลตรวจรอบ Showcase นี้

| การตรวจ | ผลจริง |
| --- | --- |
| i18n/structure tests รอบสุดท้าย | 6 ผ่าน |
| Fixed example/plan tests | 5 ผ่าน |
| Production frontend build รอบสุดท้าย | ผ่าน ใน output แยก ไม่เขียนทับ dist เดิม |
| React static render | 6/6: Home, FlowSense, Architecture × TH/EN |
| Application source hashes | 10/10 ตรงกับ source manifest |
| Evidence images | 3/3 exact-byte copies |
| Public/source/docs manifest mirrors | ตรง bytes ทั้ง 3 ชุด |
| Frozen Gate2 study sources | 4/4 hashes ตรง |
| Browser QA ของ Showcase | **BLOCKED**: IAB navigation connection timeout |
| HTTP preview | **BLOCKED**: WinError 10013 loopback permission |

Static render ตรวจ output ของ React ไม่ใช่ browser layout, screenshot, responsive หรือ end-to-end proof ไม่ได้นับ browser/HTTP timeout เป็น PASS และไม่ได้รัน backend, Application tests, physical iPad, Docker/CI/load, model inference/training/tuning/evaluation/export หรือ deployment ในรอบนี้

หลักฐานคำสั่งและ logs อยู่ `output/showcase-baseline-sync-20261029/`: `before.json`, `checks.json`, `final-checks.json`, `static-render-checks.json`, `evidence-checks.json`, `preservation.json` และ build แยก

ระหว่างเตรียม tooling มี source-update matcher ที่ไม่รองรับ field สองตัวในบรรทัดเดียว, static-render dependency resolution และ manifest newline mismatch แก้แล้วก่อน final checks ไม่ใช่ failures ของ model/data และไม่เปลี่ยนคะแนนเดิม

## คำสั่งตรวจซ้ำ

จาก `frontend/react-app`:

```powershell
npm run test:i18n
npm run test:plan
npm run build -- --outDir ../../output/showcase-baseline-sync-20261029/build
npm run preview -- --host 127.0.0.1 --port 8036 --strictPort --outDir ../../output/showcase-baseline-sync-20261029/build
```

Preview ต้องรันใน environment ที่เชื่อม loopback ได้ ไม่ต้องลด security controls เพื่อทำให้ผ่าน การ build ปกติไป dist อาจกระทบงานเดิม จึงใช้ outDir แยกตามคำสั่งนี้

## จุดจบรอบส่งมอบ

Baseline Application เชื่อมและตรวจ functional ใน local แล้วตาม handoff ส่วน Showcase แก้คำอธิบายและ build แล้ว เหลือการดู Showcase ผ่าน browser จริงเพื่อยืนยันภาษา ภาพ และ layout เท่านั้น ตาม [FINAL_BROWSER_QA_TASK.md](FINAL_BROWSER_QA_TASK.md) ไม่ต้องฝึก ML ใหม่หรือรอ ML ผ่านเพื่อจบรอบ baseline

ยังไม่มี production release, commit หรือ push งานก่อนรอบนี้คงอยู่ การย้อนแก้ให้ตรวจเฉพาะ diff ของไฟล์ที่เปลี่ยนในรอบนี้ ห้าม reset/restore ทั้ง working tree หรือย้อนบิล/retry/security/TrustGraph

## Preservation รอบสุดท้าย

Showcase ไฟล์เดิม 4,444: คง bytes เดิม 4,437 และแก้เฉพาะข้อความ/UI ที่ระบุ 7 ไฟล์ เพิ่ม 9 ไฟล์ในขอบเขต docs/components/data/evidence ไม่มีไฟล์เดิมสูญหาย Application เดิมทั้ง 1,842 ไฟล์คง bytes และไม่มีไฟล์ใหม่จากงานนี้

Showcase HEAD และ staged index entries ตรง snapshot ก่อนแก้ ส่วน Application Git metadata อ่านไม่ได้ จึงเป็น **UNKNOWN** สำหรับ HEAD/index/tracked diff ไม่อ้างว่าตรวจ Git ผ่าน การคงสภาพ Application ยืนยันเฉพาะ accessible file inventory ตาม exclusions ใน preservation.json ไม่มีคำสั่ง commit/push/deploy หรือ Git mutation
