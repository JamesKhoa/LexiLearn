export class QualityControl {
  validatePrompt(prompt) {
    const issues = [];
    if (prompt.match(/\b(\w+)\b.*\b\1\b.*\b\1\b/)) {
      issues.push('Repeated names may cause duplicate characters');
    }
    const restrictedTerms = ['explicit', 'nude', 'violent', 'gore'];
    restrictedTerms.forEach(term => {
      if (prompt.toLowerCase().includes(term)) {
        issues.push(`Contains restricted term: ${term}`);
      }
    });
    if (!prompt.includes('[scene-')) {
      issues.push('Missing scene consistency markers');
    }
    return issues;
  }

  async preprocessScript(script) {
    let processed = this.removeDuplicateReferences(script);
    processed = this.ensureContinuity(processed);
    processed = this.validateTechnicalSpecs(processed);
    return processed;
  }

  removeDuplicateReferences(script) {
    const lines = script.split('\n');
    const seen = new Set();
    return lines
      .filter(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('INT.') || trimmed.startsWith('EXT.')) {
          if (seen.has(trimmed)) {
            return false;
          }
          seen.add(trimmed);
        }
        return true;
      })
      .join('\n');
  }

  ensureContinuity(script) {
    return script.replace(/CUT TO:/g, '\nCUT TO:\n');
  }

  validateTechnicalSpecs(script) {
    return script;
  }
}
