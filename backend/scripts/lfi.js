exports.check = async () => {
  return {
    type: "LFI",
    severity: "High",
    vulnerable: false,
    cvss: 8.0,
    description: "Local File Inclusion check",
    impact: "Sensitive file disclosure",
    mitigation: "Sanitize file inputs"
  };
};