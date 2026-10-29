# Showcase release report — 29 October 2026 (Asia/Bangkok)

**CANDIDATE_CHECKED_PUBLISH_PENDING** — รายงานตรวจ candidate ก่อน commit/push ไม่อ้างว่า URL แสดงรุ่นใหม่แล้ว ผลหลัง deploy จะบันทึกแยกจากประวัติ browser BLOCKED เดิม

## สิ่งที่เปลี่ยน

- อัปเดต Showcase TH/EN: Home, FlowSense, Architecture, persona/evolution และคำอธิบาย research ให้ตรง baseline Application ที่ส่งมอบแล้ว เลือกเฉพาะ source/UI dependencies และ summary JSON ที่หน้าเว็บ import จริง
- ค่าเริ่มต้นเป็น SCENARIO N0/28: เมย์ 350, นนท์ 600, แพรว 300 บาท/วัน ไม่รวมบิล; HISTORY N7/28 เป็น acceptance fixture; ABSTAIN เป็น unavailable/null
- FlowSense ML ฝั่ง Application ยังปิด, Gate2 candidate ไม่ผ่าน, Direct ML เป็น development; TrustGraph model/embedding คู่เดิมไม่ได้แก้ ไม่มี training/evaluation/export/activation
- ภาพหลักฐานสังเคราะห์ 3 ภาพและ provenance เป็น exact-byte copies ตาม manifest แยก local Application ออกจาก public Application ที่ยังไม่ยืนยันรุ่น
- Backend เริ่มจาก clean parent ไม่คัดลอก app_v2.py ที่มีงานค้าง เปลี่ยนเพียง mount evidence directory เฉพาะรุ่นและ GET /release.json; AST นอกส่วนเพิ่มตรง parent ทั้งหมด ไม่มี financial/API/model behavior changes
- ใช้ prebuilt dist ตามแนวทาง repository เพราะ Render build มีเพียง pip install; .gitattributes ตรึง LF ของ build inputs และรักษา bytes ของ dist/evidence เพื่อให้ hashes ตรงหลัง checkout บน Render ไม่มี Docker/runtime/plan change
- README นำมาเฉพาะ baseline section ไม่รวมข้อความจาก API/model changes ที่ยังค้างอยู่

## Candidate checks

รายละเอียด machine-readable: [RELEASE_CHECKS.json](RELEASE_CHECKS.json)

| การตรวจ | ผล |
| --- | --- |
| npm run test:i18n | PASS 6/6 |
| npm run test:plan | PASS 5/5 |
| Production frontend build | PASS, Vite 5.4.21, 1,533 modules |
| React static render Home/FlowSense/Architecture × TH/EN | PASS 6/6; ไม่ใช่ browser proof |
| index references, MIME, images/provenance, mount traversal | PASS 18 in-process ASGI probes; ไม่เปิด localhost และไม่ load models |
| Application source hashes | PASS 10/10 จาก source ที่อ่านจริง |
| Frozen Gate2 source hashes | PASS 4/4 ไม่มีการเปลี่ยน study |
| manifest/source/public/dist mirrors | exact bytes |
| Installed dependencies vs unchanged lockfile | 142 installed package versions ตรง; non-optional ครบ |
| Clean npm ci | NOT_PASSED: offline ENOTCACHED (yallist), online npm “Exit handler never called!”; ใช้สำเนา node_modules เดิมใน candidate และตรวจ version แต่ละ package จริง ไม่อ้าง clean install ผ่าน |
| Live localhost | NOT_RUN; ประวัติเดิมยัง BLOCKED |
| Browser desktop/narrow TH/EN, disclosure keyboard, console | BLOCKED/NOT_RUN: Computer Use stopped because current browser URL on Windows could not be determined confidently |

ระหว่างทำ verification script แก้ UTF-8 read และ probe /data/private.csv เพราะ /data เป็น SPA alias เดิม ไม่ได้เปลี่ยน existing tests หรือ security controls เพื่อทำให้ผ่าน มี Starlette/httpx deprecation warning ที่ไม่ทำให้ final ASGI checks ล้มเหลว การลองใน sandbox ค้างและหยุดเฉพาะ process งานนี้ จากนั้นตรวจ in-process แบบมี 45s timeout ผ่านเครื่องมือ approval ปกติ ไม่เปลี่ยน security configuration

## Build / source identity

- Release ID: `showcase-baseline-20261029.1`
- Source SHA-256: `43d3e34b4667d012c2b5bad685a7d39b38cc50f339ee711b7f96cbe97088b734`
- Actual HEAD at build: `5a162ac0ffdd0b118699a451e7e13583911f1dca` เป็น parent/reference ขณะ build ไม่ใช่ final deployed commit
- Bundle: `assets/index-CP9zO5Dm.js`, `assets/index-Bc6BcUNt.css`
- `/release.json` มี per-file SHA-256 ของ build inputs และ dist/evidence; ไม่ใส่ absolute local paths/secrets และไม่ hash ตัวเอง
- ตรวจ repeat: `python scripts/build_showcase_release.py --verify-only`
- Rebuild จาก release checkout: `npm --prefix frontend/react-app ci`, `npm --prefix frontend/react-app run test:i18n`, `npm --prefix frontend/react-app run test:plan`, `python scripts/build_showcase_release.py`

## Render configuration verified via connected account

- Workspace: My Workspace (`tea-dak0nuuq1p3s739rgbj0`), ผู้ใช้ยืนยัน workspace แล้ว
- Service: `srv-dba855m1egvs739o10mg` / k-nexus-showcase
- Linked repository: `https://github.com/svkhun/k-nexus`
- Linked branch: `main`; Auto-Deploy `yes` on `commit`
- Runtime python; region singapore; plan free; คงเดิม
- Actual build: `pip install -r requirements.txt`
- Actual start: `uvicorn src.app_v2:app --host 0.0.0.0 --port $PORT`
- Health check: `/api/v2/health`
- Remote main อ่านซ้ำผ่าน Git ตรง parent `5a162ac0ffdd0b118699a451e7e13583911f1dca`
- Previous live deploy: `dep-dbcsio3bc2fs738q7h6g` / commit `5a162ac0ffdd0b118699a451e7e13583911f1dca` (Render live; public health ตอบ HEALTHY ก่อน release)
- Release commit / new deploy ID / final deployed commit: PENDING ณ จุดตรวจ candidate; ไม่เดา SHA
- Auto-Deploy เปิดอยู่ จึงจะใช้ push ไป main และไม่ trigger deploy ซ้ำ

## Public verification

Public target: https://k-nexus-showcase.onrender.com/

ก่อน publish: public GET / และ /api/v2/health ตอบสำเร็จผ่าน approved HTTP tooling; health เป็น legacy Showcase รุ่นเดิม ไม่ใช้เป็นหลักฐานรุ่นใหม่ การลอง sandbox ก่อนหน้านี้ได้ curl (6) Could not resolve host / Git getaddrinfo thread failed to start; approved tooling อ่าน remote/public ได้แล้ว

หลัง deploy ต้องตรวจ `/`, `/flowsense`, `/architecture`, `/api/v2/health`, `/release.json`, JS/CSS bundles, ภาพทั้งสาม และ provenance JSON โดยเทียบ exact bytes และ MIME กับ candidate ด้วย `python scripts/verify_showcase_public.py --report ../public-checks.json` ใช้ bounded timeouts/cold-start retries

HTTP identity/assets ไม่รับรอง browser layout. Browser QA รอบนี้ยังไม่ผ่าน ต้องตรวจผ่าน URL สาธารณะทั้ง TH/EN บน desktop/narrow, เปิด evidence/historical disclosure, ตรวจ 350/600/300 N0/28, HISTORY fixture, ABSTAIN unavailable, Gate2 not passed, Direct development, local/public Application boundary, ภาพ/overflow และ Tab/Enter ไม่มี localhost เป็นเงื่อนไขที่ผู้ใช้ต้องทำ

## Preservation and scope

ก่อนเขียน final report กลับ working tree เดิม: Showcase 4,503/4,503 และ Application 1,842/1,842 accessible files คง bytes; ไม่มีไฟล์ใหม่/หาย/แก้ในต้นไม้เดิม; original HEAD/index entries คงเดิม dist เดิมคงอยู่ทั้งหมด งาน candidate แยกใน worktree `codex/showcase-baseline-release-20261029`

Application Git metadata ไม่ได้ตรวจในรอบนี้: UNKNOWN/NOT_INSPECTED. ไม่อ้าง file hashes แทน Git verification ไม่มี Application code/config/deploy, model/dataset/contract changes, ค่าใช้จ่ายใหม่, git add ., reset --hard, clean, whole-tree stash หรือ force push

เก็บ BROWSER_ACCEPTANCE.md และ FINAL_BROWSER_QA_TASK.md เดิมเป็นประวัติที่มีวันที่/ขอบเขตเดิม ไม่เปลี่ยน BLOCKED ให้กลายเป็น PASS รายงานหลังเผยแพร่ไม่เปลี่ยนผล ML หรือ Application deployment

## Rollback เฉพาะ Showcase

หาก release ทำให้บริการเสีย ใช้ Render Dashboard ของ service `srv-dba855m1egvs739o10mg` เลือก deploy ที่ดีเดิม `dep-dbcsio3bc2fs738q7h6g` แล้ว Rollback เมื่อสิทธิ์รองรับ บันทึก deploy ID/status และตรวจ URL/health จริง ไม่ resume/deploy Application หรือ legacy services

หากไม่มี rollback capability ใน connector ให้ revert เฉพาะ release commit ใน release checkout แล้ว push แบบ fast-forward ไป branch ที่เชื่อม เพื่อให้ Auto-Deploy สร้างรุ่นที่มี tree เดิม ห้าม reset working tree เดิมหรือ force push; หาก remote มีงานใหม่ต้องอ่านและรวมอย่างปลอดภัยก่อน

## Files in release

รายชื่อ staged จริงจะเติมก่อน commit ด้านล่าง รวมเฉพาะขอบเขตที่อธิบายข้างต้น

```text
.gitattributes
README.md
docs/application-baseline-2026-10-29/BROWSER_ACCEPTANCE.md
docs/application-baseline-2026-10-29/FINAL_BROWSER_QA_TASK.md
docs/application-baseline-2026-10-29/README.md
docs/application-baseline-2026-10-29/RELEASE_CHECKS.json
docs/application-baseline-2026-10-29/RELEASE_REPORT.md
docs/application-baseline-2026-10-29/SOURCE_MANIFEST.json
frontend/react-app/dist/assets/index-Bc6BcUNt.css
frontend/react-app/dist/assets/index-CP9zO5Dm.js
frontend/react-app/dist/assets/index-CqiQXhC-.js
frontend/react-app/dist/evidence/application-baseline-2026-10-29/abstain-savings.jpg
frontend/react-app/dist/evidence/application-baseline-2026-10-29/history-fixture.jpg
frontend/react-app/dist/evidence/application-baseline-2026-10-29/provenance.json
frontend/react-app/dist/evidence/application-baseline-2026-10-29/scenario-profile.jpg
frontend/react-app/dist/index.html
frontend/react-app/dist/release.json
frontend/react-app/public/evidence/application-baseline-2026-10-29/abstain-savings.jpg
frontend/react-app/public/evidence/application-baseline-2026-10-29/history-fixture.jpg
frontend/react-app/public/evidence/application-baseline-2026-10-29/provenance.json
frontend/react-app/public/evidence/application-baseline-2026-10-29/scenario-profile.jpg
frontend/react-app/src/components/ApplicationBaseline.jsx
frontend/react-app/src/components/ExperimentResults.jsx
frontend/react-app/src/components/Navbar.jsx
frontend/react-app/src/data/applicationBaseline.json
frontend/react-app/src/data/modelEvaluation.json
frontend/react-app/src/data/researchContent.js
frontend/react-app/src/data/researchDetails.js
frontend/react-app/src/i18n/en-research.js
frontend/react-app/src/pages/DatasetAnalyticsPage.jsx
frontend/react-app/src/pages/FlowSensePage.jsx
frontend/react-app/src/pages/TrustGraphPage.jsx
frontend/react-app/src/research.css
scripts/build_showcase_release.py
scripts/verify_showcase_public.py
scripts/verify_showcase_static.py
src/app_v2.py
```
