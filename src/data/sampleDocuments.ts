import { SampleDocument } from "../types";

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: "sample-msa",
    title: "Master Services Agreement & SLA",
    category: "Legal & Contracts",
    description: "Enterprise multi-year cloud infrastructure agreement with SLA terms, financial penalties, and delivery milestones.",
    fileName: "MSA_CloudInfrastructure_NexisVertex_2026.txt",
    type: "text/plain",
    textContent: `================================================================================
MASTER SERVICES AGREEMENT & ENTERPRISE SERVICE LEVEL AGREEMENT (SLA)
Document Reference: MSA-NEX-2026-094
Status: Executed Agreement
================================================================================

PARTIES:
1. Provider: Nexis Cloud Solutions, Inc., a Delaware corporation ("Provider")
2. Client: Vertex Global Enterprises LLC, a California limited liability company ("Client")

1. TERM & CONTRACT VALUE
- Effective Date: October 1, 2026
- Contract Term: 36 Months, expiring September 30, 2029
- Total Contract Value: $485,000.00 USD (payable in equal quarterly installments of $40,416.67 USD)
- Payment Terms: Net 30 days upon invoice receipt

2. KEY DELIVERABLES & PROJECT TIMELINE
The Provider agrees to complete the following critical milestones:
- November 15, 2026: Completion of Phase 1 Core Infrastructure Migration and IAM role configuration. Responsible Party: Nexis DevOps Lead.
- January 10, 2027: Multi-region failover and high-availability disaster recovery testing. Responsible Party: Nexis Infrastructure Team & Vertex Security Lead.
- March 31, 2027: Production Go-Live and final system acceptance sign-off. Responsible Party: Vertex VP of Engineering.
- December 1, 2026: Delivery of updated SOC 2 Type II audit report and ISO 27001 certificate. Responsible Party: Nexis Chief Information Security Officer (CISO).

3. SERVICE LEVEL COMMITMENTS (SLA) & PERFORMANCE METRICS
Provider guarantees the following performance metrics across all production environments:
- Service Availability: 99.98% uptime measured over each calendar month (excluding scheduled maintenance).
- API Round-Trip Latency: < 45 milliseconds average for p95 requests across North America and Europe.
- Incident Response Time (Severity 1 - Critical Outage): Provider will acknowledge and initiate resolution within 15 minutes, 24/7/365.
- Incident Response Time (Severity 2 - Major Degradation): Within 1 hour during business hours.
- Incident Response Time (Severity 3 - Minor Issue): Within 8 business hours.

4. PENALTIES, SERVICE CREDITS & TERMINATION
Failure to meet agreed SLA availability will trigger automatic monthly service credits:
- 99.50% to 99.97% Uptime: 10% credit of the monthly billing fee.
- 99.00% to 99.49% Uptime: 25% credit of the monthly billing fee.
- Below 99.00% Uptime: 50% credit of the monthly billing fee.
- Chronic Failure Clause: If uptime drops below 99.50% in any two consecutive months, Client retains the right to terminate this agreement immediately with zero penalty and receive a full refund of unearned prepaid fees.

5. SECURITY, COMPLIANCE & AUDIT RULES
- Data Encryption: All Client data at rest must be encrypted using AES-256; data in transit must utilize TLS 1.3.
- Data Residency: Client data must reside exclusively within AWS US-East (N. Virginia) and US-West (Oregon) regions.
- Audit Notice: Client or its designated independent auditor may conduct an annual security audit upon 14 business days prior written notice.
- Cyber Insurance: Provider must maintain at least $10,000,000.00 USD in cyber liability and errors & omissions insurance throughout the contract term.

Signed for Provider: Marcus Vance, Chief Executive Officer, Nexis Cloud Solutions Inc.
Signed for Client: Elena Rostova, Chief Technology Officer, Vertex Global Enterprises LLC
Date of Execution: September 28, 2026`,
  },
  {
    id: "sample-financial",
    title: "Q3 FY2026 Financial & Operating Report",
    category: "Finance & Earnings",
    description: "Quarterly corporate earnings release with GAAP metrics, segment revenue breakdown, and board deadlines.",
    fileName: "ApexFinTech_Q3_2026_Earnings_Report.txt",
    type: "text/plain",
    textContent: `================================================================================
APEX FINTECH GLOBAL CORP (NASDAQ: AFGT)
Q3 FY2026 FINANCIAL & OPERATING RESULTS
Quarter Ended: August 31, 2026
Release Date: September 24, 2026
================================================================================

1. EXECUTIVE OVERVIEW
Apex FinTech Global Corp reported record financial performance for the third fiscal quarter of 2026, driven by accelerated adoption of its AI-assisted treasury management platform and expansion in cross-border transaction volume. Total revenue expanded 21.4% year-over-year, while operating cash flow reached an all-time quarterly high.

2. CONSOLIDATED FINANCIAL PERFORMANCE (USD in Millions, except per share data)
Metric | Q3 FY2026 | Q3 FY2025 | YoY Change (%)
------------------------------------------------------------
Total Revenue | $148.60M | $122.40M | +21.4%
Subscription & SaaS Revenue | $118.20M | $94.50M | +25.1%
Transaction & API Fees | $30.40M | $27.90M | +9.0%
Gross Profit | $108.48M | $86.90M | +24.8%
Gross Margin | 73.0% | 71.0% | +200 bps
Operating Income (GAAP) | $38.20M | $28.60M | +33.6%
Operating Margin | 25.7% | 23.4% | +230 bps
Adjusted EBITDA | $46.80M | $39.36M | +18.9%
Net Income | $29.50M | $21.80M | +35.3%
Diluted Earnings Per Share (EPS) | $0.68 | $0.51 | +33.3%
Free Cash Flow | $28.40M | $19.20M | +47.9%

3. BALANCE SHEET & CAPITAL STRUCTURE
- Cash, Cash Equivalents & Short-Term Investments: $112.50M as of August 31, 2026.
- Total Outstanding Debt: $45.00M in 4.25% Senior Secured Notes maturing on November 15, 2028.
- Working Capital: $78.30M with a Current Ratio of 2.4x.
- Share Repurchase Program: $15.00M in common stock repurchased during Q3 FY2026 at an average price of $42.10 per share.

4. OPERATIONAL KPIs & CLIENT METRICS
- Active Enterprise Customers: 2,430 (net increase of 340 customers YoY).
- Annual Recurring Revenue (ARR): $182.00M as of quarter-end.
- Net Revenue Retention (NRR): 124.5% compared to 121.2% in Q3 FY2025.
- Research & Development Spending: $24.80M (representing 16.7% of quarterly revenue).
- Customer Acquisition Cost (CAC) Payback Period: 9.2 months.

5. UPCOMING STATUTORY DEADLINES & KEY DATES
- October 28, 2026: Q3 Investor Earnings Webcast and Q&A session with CEO and CFO (4:30 PM Eastern Time). Stakeholder: Investor Relations.
- November 12, 2026: Form 10-Q filing deadline with the U.S. Securities and Exchange Commission (SEC). Stakeholder: Chief Accounting Officer.
- December 15, 2026: Fiscal 2027 Annual Operating Budget Approval Meeting. Stakeholder: Board of Directors & Executive Committee.
- January 25, 2027: Preliminary FY2026 Full-Year Financial Audit Close. Stakeholder: External Audit Partner (Deloitte LLP).`,
  },
  {
    id: "sample-tech-spec",
    title: "HIPAA Cloud & Cybersecurity Protocol",
    category: "Technical & Healthcare",
    description: "HealthData Lake technical architecture, HIPAA encryption parameters, RTO/RPO limits, and compliance milestones.",
    fileName: "Aegis_HealthDataLake_Security_Spec_2026.txt",
    type: "text/plain",
    textContent: `================================================================================
AEGIS MEDICAL SYSTEMS - TECHNICAL SPECIFICATION & COMPLIANCE DIRECTIVE
Document: ARCH-SPEC-HIPAA-2026.4
Security Classification: Confidential / Healthcare Protected
================================================================================

1. SYSTEM ARCHITECTURE & PURPOSE
This technical specification outlines the infrastructure architecture, cryptographic requirements, and compliance milestones for the Aegis HealthData Lake, a high-throughput multi-tenant clinical storage repository handling Protected Health Information (PHI) across 45 participating hospital networks.

2. TECHNICAL PARAMETERS & HARDWARE SPECIFICATIONS
Parameter / Metric | Specification Standard | Operational Threshold
--------------------------------------------------------------------------------
Data Encryption at Rest | AES-256-GCM | Mandatory hardware-accelerated encryption
Data Encryption in Transit | TLS 1.3 with Perfect Forward Secrecy | Cipher: ECDHE-RSA-AES256-GCM-SHA384
Database Write Throughput | 85,000 sustained IOPS | Peak burst capacity up to 140,000 IOPS
Storage Capacity | 2.4 Petabytes distributed NVMe tier | Auto-scaling trigger at 80% capacity
Network Bandwidth | Dedicated 40 Gbps dual redundant links | Automatic failover < 200 ms
Maximum Tolerable Downtime (MTD) | 2.0 Hours | Hard limit before regulatory breach
Recovery Point Objective (RPO) | ≤ 5 Minutes | Continuous WAL stream replication
Recovery Time Objective (RTO) | ≤ 15 Minutes | Automated multi-region container failover
Session Inactivity Timeout | 15 Minutes | Automatic token invalidation and re-auth

3. AUDITABLE ACTION ITEMS & COMPLIANCE CALENDAR
The following mandatory compliance activities must be completed:
- October 5, 2026: Initiation of Annual Third-Party Penetration Test and Red Team Exercise. Responsible Stakeholder: Mandiant Cyber Security Team.
- October 20, 2026: Deployment of Zero-Trust Network Access (ZTNA) policies across all clinical endpoints. Responsible Stakeholder: Principal Infrastructure Architect.
- November 1, 2026: Submission of HIPAA Security Rule Annual Self-Assessment and OCR Audit Log Package. Responsible Stakeholder: Chief Compliance Officer (CCO).
- November 25, 2026: Disaster Recovery and Cold-Site Failover Drill. Responsible Stakeholder: Site Reliability Engineering (SRE) Director.
- December 1, 2026: Decommissioning of legacy unencrypted HL7 data brokers and final media sanitization (NIST 800-88 compliant). Responsible Stakeholder: Chief Information Officer (CIO).

4. ACCESS CONTROLS & PENALTIES
- Least Privilege Access: Access to raw PHI requires Dual-Custodian Approval (Department Chair + Information Security Officer).
- Audit Logging: All read/write queries to clinical tables are immutably logged to WORM (Write Once, Read Many) S3 Object Lock storage with 7-year retention.
- Policy Violation: Unauthorized extraction of unmasked PHI results in immediate termination of employment, revocation of credentials, and criminal referral under 42 U.S.C. § 1320d-6.`,
  },
];
