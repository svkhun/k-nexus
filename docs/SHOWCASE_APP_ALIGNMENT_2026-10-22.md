# K-NEXUS Showcase: problem, data, methods and product rationale

## Intended role

The user clarified that the Showcase is the project's in-depth case study, not part of the banking application or a copy of its interface. The Showcase came first; the separate web app subsequently evolved through feedback. The goal is to bring the explanation up to date with that evolution.

The reading order is **problem → scenarios → data/ML → application of the analysis → feedback-driven changes → evidence and limits**. Application navigation tours, account controls and transfer/savings forms are not mounted in the Showcase. An external app link remains available for readers who want to try the separate implementation.

## Information architecture

| Route | Purpose |
| --- | --- |
| `/` | Origin, two problem dimensions, design thesis and reading guide |
| `/personas` | Three fictional situations, needs, intended responses and testable hypotheses |
| `/flowsense` | Expense target, six features, LightGBM rationale, allocation rules, worked example and evaluation |
| `/trustgraph` | Graph representation, R-GCN and classifier inputs, leakage, policy separation and plan impact |
| `/architecture` | Offline/online responsibilities, clustering, ONNX serving and current/future boundaries |
| `/evolution` | Six themes linking feedback/friction to implemented changes and project explanations |
| `/dataset` | Synthetic-data methodology, sample exploration, evaluation limits and source files |

`/app`, `/simulator` and `/simulator.html` redirect to `/evolution` so earlier links remain useful without restoring application UI. The FastAPI route table also serves the new editorial route directly. The old public simulator HTML is replaced with a small compatibility redirect.

## Source verification

Read training and export code in this repository:

- `src/train_flowsense_cashflow.py`: six features; target is absolute non-salary spending; grouping uses user/timestamp; lags use row shifts; the split is not sufficient evidence of per-user future validation.
- `src/train_trustgraph_two_tier.py`: four account features, R-GCN 4→32→16, cached embeddings, 24 classifier features; `is_scam` enters edge types before test splitting.
- `src/train_clustering.py`: StandardScaler, six partly synthetic behavioral features and KMeans with two clusters; manually assigned cluster interpretations are not population discoveries.
- `src/export_to_onnx.py`: exported LightGBM models; ONNX Runtime is serving infrastructure.

Read current product/implementation notes in `D:/All Project/k-web-application`:

- `docs/PRODUCT_REVIEW_2026-10-15.md`, `savings-sync-2026-10-16.md`, `liquidity-reserve.md`, `transfer-planning.md`, `transfer-cooldown.md`, `try-first-demo.md`.
- `src/flowsense_engine.py`, `src/transfer_planning.py`, `src/app_v2.py` and `src/ui/api.js`.

The feedback themes are an editorial synthesis of the developer's feedback context plus documented implementation changes. They are not invented participant quotations, counts or measured improvements. Product review notes themselves distinguish developer review from formal user research.

CSV row counts verified locally: profiles **1,140**; cashflow transactions **17,039**; graph accounts **1,200**; fraud transactions **6,400**; embeddings **1,200**.

Primary technical references are linked within the relevant pages: LightGBM official documentation, the original R-GCN paper, scikit-learn StandardScaler documentation and ONNX Runtime documentation. The rationale does not claim those references establish efficacy for K-NEXUS.

## Evidence boundaries

- Synthetic datasets and illustrative calculations do not establish customer outcomes.
- TrustGraph's leaked training graph invalidates using earlier AUC/AP as real scam-prevention proof.
- App demo outcomes also include synthetic-label-based policies and explicit blocking; they are not model-only classification results.
- Forecasting, budgeting, savings capacity, waiting periods, explicit confirmation and authentication simulation perform different jobs.
- No new model was trained, no real banking integration added, and no financial/fraud-prevention efficacy claimed in this content update.

## Verification commands

From `frontend/react-app`: `npm.cmd run build`, `npm.cmd run test:i18n`, `npm.cmd run test:plan`.

Browser QA: `node tmp/check-research.cjs` against the production preview. It checks all seven editorial routes in Thai/English at 320, 390, 768 and 1440 px, absence of mounted application forms/tours, legacy redirects, formula examples, data exploration, source expansion and mobile navigation. Screenshots are saved in `output/research-showcase/`.

Results: production build passed; six translation/content checks and five illustrative-calculation checks passed; all seven deployment-configuration tests passed, including direct `/evolution` navigation and the legacy simulator redirect. Browser QA passed without document overflow or captured page/console errors. FastAPI route tests load the actual routing functions independently of unrelated model initialization; this is not a full application/model-inference test. The installed TestClient emits a dependency deprecation warning, which did not fail the checks.

Publishing the repository or deploying the app is outside this local content update.
