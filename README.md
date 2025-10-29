🧾 Workflow Overview

1️⃣ Trigger
	•	A new high or critical finding is detected from Black Duck or Checkmarx pipelines.
	•	The finding triggers the need for a policy exception (manual or automated ticket creation).

2️⃣ Request Submission (Application Team)
	•	User fills a ServiceNow Exception Request Form with:
	•	Application name
	•	Business owner / contact info
	•	Tool source (Black Duck / Checkmarx)
	•	Finding details (e.g., CWE ID, component, severity, description)
	•	Reason for exception (why remediation is not feasible)
	•	Proposed mitigation or compensating controls
	•	Proposed end date (based on severity)
	•	Attachments (e.g., screenshots, scan report, email approvals)

3️⃣ SSG Review
	•	ServiceNow automatically assigns the ticket (or creates an SCTASK) to the SSG queue.
	•	SSG reviews:
	•	Validates details & justification
	•	Adds recommendations and/or compensating controls
	•	Approves/rejects or routes to SG&R for final decision
	•	Adds comments and recommendations in a structured field (e.g., “SSG Recommendation”)

4️⃣ SG&R Final Approval
	•	SG&R reviews SSG’s recommendations.
	•	Either:
	•	Approves the exception → sets approved until date (based on severity)
	•	Rejects the request → sends back to application team with comments

5️⃣ Expiry Tracking
	•	Each exception must have an end date.
	•	ServiceNow sends automated notifications:
	•	15 days before expiry
	•	On the day of expiry
	•	Allows extension requests through a related “Extension Request” ticket or workflow.

6️⃣ Search & Reporting
	•	Tickets should be searchable by:
	•	Application name
	•	Ticket number
	•	Finding ID (e.g., Black Duck or Checkmarx ID)
	•	Ability to filter by status (Pending SSG, Pending SG&R, Approved, Expired, etc.)
	•	Exportable reports (optional) showing active and expired exceptions.


Severity
Maximum Exception Period
Review Frequency
Critical
90 days
Monthly
High
180 days
Quarterly


Extension Workflow
	•	Application team can request an extension before expiry.
	•	New “Extension” ticket linked to the original exception ticket.
	•	Must include:
	•	Updated justification
	•	Current remediation status
	•	New proposed end date
	•	Follows same approval workflow (SSG → SG&R).


Technical Requirements (for Developer)
	1.	Form Fields
	•	Application Name (lookup)
	•	Exception Type (Checkmarx / Black Duck)
	•	Severity (Critical / High)
	•	Finding ID
	•	Description
	•	Justification
	•	Proposed End Date (auto-restricted based on severity)
	•	Attachments
	•	SSG Recommendation (field visible to SSG only)
	•	SG&R Decision (dropdown: Approve / Reject)
	•	Approved Until (date)
	•	Current Status (Draft / Pending SSG / Pending SG&R / Approved / Rejected / Expired)
	2.	Automation Rules
	•	Auto-assign to SSG group upon submission.
	•	Notify SG&R once SSG completes review.
	•	Auto-close ticket after expiry (status = “Expired”).
	•	Send email notifications to requestor & SSG at key milestones.
	3.	Search & Reporting
	•	Indexed by application, ticket number, and finding ID.
	•	Dashboard for active, upcoming, and expired exceptions.

Example Workflow
	1.	Dev submits exception for AppX → Checkmarx → Critical finding.
	2.	Ticket auto-assigned to SSG.
	3.	SSG adds recommendation → moves to SG&R.
	4.	SG&R approves for 90 days → end date auto-set.
	5.	Notifications sent before expiry → extension request if needed.
