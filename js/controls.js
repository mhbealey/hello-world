const CIS_CONTROLS = [
  {
    id: 1,
    title: "Inventory and Control of Enterprise Assets",
    description: "Actively manage (inventory, track, and correct) all enterprise assets connected to the infrastructure — physically, virtually, remotely, and those within cloud environments — to accurately know the totality of assets that need to be monitored and protected.",
    category: "basic",
    questions: [
      {
        id: "1.1",
        text: "Do you maintain an up-to-date inventory of all hardware assets (servers, endpoints, network devices, IoT)?",
        weight: 3
      },
      {
        id: "1.2",
        text: "Is your asset inventory automatically discovered and updated (e.g., via scanning tools)?",
        weight: 2
      },
      {
        id: "1.3",
        text: "Do you detect and alert on unauthorized or unmanaged assets connecting to your network?",
        weight: 3
      },
      {
        id: "1.4",
        text: "Do you include remote/cloud assets in your asset inventory?",
        weight: 2
      }
    ]
  },
  {
    id: 2,
    title: "Inventory and Control of Software Assets",
    description: "Actively manage (inventory, track, and correct) all software on the network so that only authorized software is installed and executed, and unauthorized software is found and prevented from installation or execution.",
    category: "basic",
    questions: [
      {
        id: "2.1",
        text: "Do you maintain an authorized software list (allowlist) for all systems?",
        weight: 3
      },
      {
        id: "2.2",
        text: "Do you block or alert on unauthorized software installation or execution?",
        weight: 3
      },
      {
        id: "2.3",
        text: "Do you track and manage software licenses and versions?",
        weight: 2
      },
      {
        id: "2.4",
        text: "Do you remove or disable unsupported/end-of-life software?",
        weight: 2
      }
    ]
  },
  {
    id: 3,
    title: "Data Protection",
    description: "Develop processes and technical controls to identify, classify, securely handle, retain, and dispose of data.",
    category: "basic",
    questions: [
      {
        id: "3.1",
        text: "Do you classify data by sensitivity level (e.g., public, internal, confidential, restricted)?",
        weight: 3
      },
      {
        id: "3.2",
        text: "Is sensitive data encrypted at rest?",
        weight: 3
      },
      {
        id: "3.3",
        text: "Is sensitive data encrypted in transit (e.g., TLS)?",
        weight: 3
      },
      {
        id: "3.4",
        text: "Do you have a documented data retention and disposal policy?",
        weight: 2
      },
      {
        id: "3.5",
        text: "Do you use DLP (Data Loss Prevention) tools to monitor sensitive data?",
        weight: 2
      }
    ]
  },
  {
    id: 4,
    title: "Secure Configuration of Enterprise Assets and Software",
    description: "Establish and maintain the secure configuration of enterprise assets and software to reduce the attack surface and opportunities for attackers.",
    category: "basic",
    questions: [
      {
        id: "4.1",
        text: "Do you use documented security baselines/hardening standards (e.g., CIS Benchmarks) for all systems?",
        weight: 3
      },
      {
        id: "4.2",
        text: "Is configuration management automated (e.g., via Ansible, Puppet, Chef)?",
        weight: 2
      },
      {
        id: "4.3",
        text: "Do you detect and remediate configuration drift from your baselines?",
        weight: 3
      },
      {
        id: "4.4",
        text: "Are default passwords and unnecessary services disabled on all systems?",
        weight: 3
      }
    ]
  },
  {
    id: 5,
    title: "Account Management",
    description: "Use processes and tools to assign and manage authorization to credentials for user accounts, including administrator accounts, as well as service accounts.",
    category: "basic",
    questions: [
      {
        id: "5.1",
        text: "Do you maintain a complete inventory of all user, administrator, and service accounts?",
        weight: 3
      },
      {
        id: "5.2",
        text: "Are dormant/inactive accounts disabled or removed within a defined time period?",
        weight: 3
      },
      {
        id: "5.3",
        text: "Do you enforce the principle of least privilege for all accounts?",
        weight: 3
      },
      {
        id: "5.4",
        text: "Are privileged admin accounts separate from standard user accounts?",
        weight: 2
      }
    ]
  },
  {
    id: 6,
    title: "Access Control Management",
    description: "Use processes and tools to create, assign, manage, and revoke access credentials and privileges for user, administrator, and service accounts.",
    category: "basic",
    questions: [
      {
        id: "6.1",
        text: "Is Multi-Factor Authentication (MFA) enforced for all privileged/admin accounts?",
        weight: 3
      },
      {
        id: "6.2",
        text: "Is MFA enforced for all remote access and VPN connections?",
        weight: 3
      },
      {
        id: "6.3",
        text: "Do you use Role-Based Access Control (RBAC) to manage permissions?",
        weight: 2
      },
      {
        id: "6.4",
        text: "Do you conduct periodic access reviews and recertification?",
        weight: 2
      },
      {
        id: "6.5",
        text: "Is MFA enforced for all SaaS/cloud applications?",
        weight: 3
      }
    ]
  },
  {
    id: 7,
    title: "Continuous Vulnerability Management",
    description: "Develop a plan to continuously assess and track vulnerabilities on all enterprise assets to remediate and minimize the window of opportunity for attackers.",
    category: "foundational",
    questions: [
      {
        id: "7.1",
        text: "Do you perform authenticated vulnerability scans on all enterprise assets regularly (at least quarterly)?",
        weight: 3
      },
      {
        id: "7.2",
        text: "Do you have a documented patch management process with defined SLAs?",
        weight: 3
      },
      {
        id: "7.3",
        text: "Are critical patches applied within 14 days of release?",
        weight: 3
      },
      {
        id: "7.4",
        text: "Do you use vulnerability prioritization based on risk/exploitability (e.g., CVSS, EPSS)?",
        weight: 2
      }
    ]
  },
  {
    id: 8,
    title: "Audit Log Management",
    description: "Collect, alert, review, and retain audit logs of events that could help detect, understand, or recover from an attack.",
    category: "foundational",
    questions: [
      {
        id: "8.1",
        text: "Do you collect audit/event logs from all enterprise assets (endpoints, servers, network devices)?",
        weight: 3
      },
      {
        id: "8.2",
        text: "Are logs stored in a centralized, tamper-protected location (e.g., SIEM)?",
        weight: 3
      },
      {
        id: "8.3",
        text: "Are logs retained for at least 90 days (with longer retention for compliance)?",
        weight: 2
      },
      {
        id: "8.4",
        text: "Do you have automated alerting on suspicious log events?",
        weight: 3
      }
    ]
  },
  {
    id: 9,
    title: "Email and Web Browser Protections",
    description: "Improve protections and detections of threats from email and web vectors, as these are primary entry points for attackers.",
    category: "foundational",
    questions: [
      {
        id: "9.1",
        text: "Do you use email filtering with anti-phishing and anti-spam controls?",
        weight: 3
      },
      {
        id: "9.2",
        text: "Do you implement email authentication (SPF, DKIM, DMARC)?",
        weight: 3
      },
      {
        id: "9.3",
        text: "Do you use web content filtering or secure web gateways?",
        weight: 2
      },
      {
        id: "9.4",
        text: "Do you block access to known malicious domains/URLs?",
        weight: 2
      }
    ]
  },
  {
    id: 10,
    title: "Malware Defenses",
    description: "Prevent or control the installation, spread, and execution of malicious applications, code, and scripts on enterprise assets.",
    category: "foundational",
    questions: [
      {
        id: "10.1",
        text: "Is endpoint protection/anti-malware deployed on all enterprise assets?",
        weight: 3
      },
      {
        id: "10.2",
        text: "Are anti-malware signatures and engines kept up to date (at least weekly)?",
        weight: 3
      },
      {
        id: "10.3",
        text: "Do you use behavior-based or AI/ML threat detection (EDR) beyond signature-only AV?",
        weight: 3
      },
      {
        id: "10.4",
        text: "Are macros and dangerous file types blocked or restricted in email?",
        weight: 2
      }
    ]
  },
  {
    id: 11,
    title: "Data Recovery",
    description: "Establish and maintain data recovery practices sufficient to restore in-scope enterprise assets to a pre-incident and trusted state.",
    category: "foundational",
    questions: [
      {
        id: "11.1",
        text: "Are all critical data and systems backed up at least weekly (daily for critical systems)?",
        weight: 3
      },
      {
        id: "11.2",
        text: "Are backups stored offline or in an isolated environment (air-gapped or immutable)?",
        weight: 3
      },
      {
        id: "11.3",
        text: "Are backup restoration procedures tested at least quarterly?",
        weight: 3
      },
      {
        id: "11.4",
        text: "Do you have documented Recovery Time Objectives (RTO) and Recovery Point Objectives (RPO)?",
        weight: 2
      }
    ]
  },
  {
    id: 12,
    title: "Network Infrastructure Management",
    description: "Establish, implement, and actively manage (track, report, correct) network devices, in order to prevent attackers from exploiting vulnerable network services and access points.",
    category: "foundational",
    questions: [
      {
        id: "12.1",
        text: "Do you maintain up-to-date network diagrams and documentation?",
        weight: 2
      },
      {
        id: "12.2",
        text: "Do you use network segmentation to isolate sensitive systems (e.g., production, PCI, OT)?",
        weight: 3
      },
      {
        id: "12.3",
        text: "Are network device configurations managed and audited regularly?",
        weight: 2
      },
      {
        id: "12.4",
        text: "Is remote network access restricted and protected (VPN, jump hosts)?",
        weight: 3
      }
    ]
  },
  {
    id: 13,
    title: "Network Monitoring and Defense",
    description: "Operate processes and tooling to establish and maintain comprehensive network monitoring and defense against security threats across the enterprise's network infrastructure and user base.",
    category: "foundational",
    questions: [
      {
        id: "13.1",
        text: "Do you use Intrusion Detection/Prevention Systems (IDS/IPS) on your network?",
        weight: 3
      },
      {
        id: "13.2",
        text: "Do you monitor network traffic for anomalies and threats?",
        weight: 3
      },
      {
        id: "13.3",
        text: "Do you use DNS filtering to block malicious domains?",
        weight: 2
      },
      {
        id: "13.4",
        text: "Is traffic between network segments monitored and filtered (e.g., east-west traffic)?",
        weight: 2
      }
    ]
  },
  {
    id: 14,
    title: "Security Awareness and Skills Training",
    description: "Establish and maintain a security awareness program to influence behavior among the workforce to be security conscious and properly skilled.",
    category: "foundational",
    questions: [
      {
        id: "14.1",
        text: "Do you conduct security awareness training for all employees at least annually?",
        weight: 3
      },
      {
        id: "14.2",
        text: "Do you conduct phishing simulation exercises?",
        weight: 3
      },
      {
        id: "14.3",
        text: "Do you provide role-specific security training (e.g., for developers, IT admins)?",
        weight: 2
      },
      {
        id: "14.4",
        text: "Do you track training completion and measure security behavior improvement?",
        weight: 2
      }
    ]
  },
  {
    id: 15,
    title: "Service Provider Management",
    description: "Develop a process to evaluate service providers who hold sensitive data or are responsible for an enterprise's critical IT platforms or processes.",
    category: "organizational",
    questions: [
      {
        id: "15.1",
        text: "Do you maintain an inventory of all third-party service providers with data access?",
        weight: 2
      },
      {
        id: "15.2",
        text: "Do you assess and document the security posture of service providers (e.g., SOC 2, questionnaires)?",
        weight: 3
      },
      {
        id: "15.3",
        text: "Do contracts with service providers include security requirements and breach notification?",
        weight: 3
      },
      {
        id: "15.4",
        text: "Do you monitor service providers for ongoing security compliance?",
        weight: 2
      }
    ]
  },
  {
    id: 16,
    title: "Application Software Security",
    description: "Manage the security life cycle of in-house developed, hosted, or acquired software to prevent, detect, and remediate security weaknesses before they can impact the enterprise.",
    category: "organizational",
    questions: [
      {
        id: "16.1",
        text: "Do you use a secure software development lifecycle (SSDLC) with security checkpoints?",
        weight: 3
      },
      {
        id: "16.2",
        text: "Do you perform Static Application Security Testing (SAST) or code reviews?",
        weight: 3
      },
      {
        id: "16.3",
        text: "Do you perform Dynamic Application Security Testing (DAST) on web applications?",
        weight: 2
      },
      {
        id: "16.4",
        text: "Do you manage and track third-party/open source software vulnerabilities (SCA)?",
        weight: 2
      },
      {
        id: "16.5",
        text: "Do you use a Web Application Firewall (WAF) for internet-facing applications?",
        weight: 2
      }
    ]
  },
  {
    id: 17,
    title: "Incident Response Management",
    description: "Establish a program to develop and maintain an incident response capability (e.g., policies, plans, procedures, defined roles, training, and communications) to prepare, detect, and quickly respond to an attack.",
    category: "organizational",
    questions: [
      {
        id: "17.1",
        text: "Do you have a documented Incident Response Plan (IRP)?",
        weight: 3
      },
      {
        id: "17.2",
        text: "Is the incident response plan tested via tabletop or simulation exercises at least annually?",
        weight: 3
      },
      {
        id: "17.3",
        text: "Do you have a designated Incident Response Team with defined roles and responsibilities?",
        weight: 3
      },
      {
        id: "17.4",
        text: "Do you have established communication procedures (internal and external) for incidents?",
        weight: 2
      }
    ]
  },
  {
    id: 18,
    title: "Penetration Testing",
    description: "Test the effectiveness and resiliency of enterprise assets through identifying and exploiting weaknesses in controls, and simulating the objectives and actions of an attacker.",
    category: "organizational",
    questions: [
      {
        id: "18.1",
        text: "Do you conduct external penetration tests at least annually?",
        weight: 3
      },
      {
        id: "18.2",
        text: "Do you conduct internal penetration tests or red team exercises?",
        weight: 3
      },
      {
        id: "18.3",
        text: "Are penetration tests conducted by qualified internal or external parties?",
        weight: 2
      },
      {
        id: "18.4",
        text: "Do you track and remediate findings from penetration tests with defined timelines?",
        weight: 2
      }
    ]
  }
];

const RESPONSE_OPTIONS = [
  { value: 0, label: "Not Implemented", description: "No controls in place", color: "#dc2626" },
  { value: 1, label: "Partially Implemented", description: "Controls planned or partially in place", color: "#f59e0b" },
  { value: 2, label: "Largely Implemented", description: "Controls mostly in place with minor gaps", color: "#84cc16" },
  { value: 3, label: "Fully Implemented", description: "Controls fully in place and documented", color: "#16a34a" }
];

const CATEGORY_LABELS = {
  basic: "Basic Controls (IG1)",
  foundational: "Foundational Controls (IG2)",
  organizational: "Organizational Controls (IG3)"
};

const RISK_LEVELS = [
  { min: 0, max: 25, label: "Critical Risk", color: "#dc2626", bg: "#fef2f2", description: "Significant security gaps. Immediate action required." },
  { min: 25, max: 50, label: "High Risk", color: "#ea580c", bg: "#fff7ed", description: "Major controls missing. High priority remediation needed." },
  { min: 50, max: 70, label: "Medium Risk", color: "#d97706", bg: "#fffbeb", description: "Some controls in place. Focused improvement needed." },
  { min: 70, max: 85, label: "Low Risk", color: "#16a34a", bg: "#f0fdf4", description: "Good security posture. Continue strengthening controls." },
  { min: 85, max: 101, label: "Minimal Risk", color: "#0d9488", bg: "#f0fdfa", description: "Strong security posture. Maintain and continuously improve." }
];
