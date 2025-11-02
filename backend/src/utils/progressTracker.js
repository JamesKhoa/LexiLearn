class ProgressTracker {
  constructor() {
    this.progress = new Map();
  }

  init(id) {
    this.progress.set(id, { percentage: 0, message: 'Initializing...' });
  }

  update(id, percentage, message) {
    if (!this.progress.has(id)) {
      this.init(id);
    }
    this.progress.set(id, { percentage, message });
  }

  get(id) {
    return this.progress.get(id) || { percentage: 0, message: 'Unknown progress ID' };
  }

  complete(id) {
    this.progress.set(id, { percentage: 100, message: 'Complete!' });
  }
}

export const progressTracker = new ProgressTracker();
