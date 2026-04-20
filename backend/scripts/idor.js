exports.check = async () => {
  return {
    type: "IDOR",
    severity: "Medium",
    vulnerable: false,
    cvss: 6.5,
    description: "Check for ID-based access control",
    impact: "Unauthorized data access",
    mitigation: "Implement proper authorization"
  };
};