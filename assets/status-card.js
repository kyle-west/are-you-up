class StatusCard extends HTMLElement {
  static get is () {
    return 'status-card';
  }

  static register () {
    window.customElements.define(this.is, this);
  }

  connectedCallback () {
    this.statusUrl = this.getAttribute('status-url');
    this.navigateUrl = new URL(this.statusUrl).origin;
    this.iconUrl = this.getAttribute('icon-url');
    this.fetchAndRender();
    setInterval(this.fetchAndRender.bind(this), 10000);
  }

  fetchAndRender () {
    fetch(this.statusUrl).then(r=>r.json()).then(data => {
      const normalizedData = this.normalizeApiResponse(data);
      this.company = normalizedData.company;
      this.status = normalizedData.status;
      this.innerHTML = `<a href="${this.navigateUrl}" target="_blank">
        <section class="${this.status}">
        <img src="${this.iconUrl}"/>
        <h1>${this.company}</h1>
        <div class="data">
          <h3>${normalizedData.description}</h3>
          <p><code>${normalizedData.updatedAt}</code></p>
        </div>
        </section>
      </a>`;
    });
  }

  normalizeApiResponse (data) {
    // StatusPage.io v2 API format
    if (data.page && data.status) {
      return {
        company: data.page.name,
        status: data.status.indicator,
        description: data.status.description,
        updatedAt: new Date(data.page.updated_at).toString()
      };
    }

    // Heroku API format
    if (data.status && typeof data.status === 'object' && !data.status.indicator) {
      const statuses = Object.entries(data.status);
      const hasIssues = data.issues && data.issues.length > 0;
      const allGreen = statuses.every(([_, status]) => status === 'green');

      let indicator = 'none';
      let description = 'All Systems Operational';

      if (hasIssues) {
        indicator = 'major';
        description = `${data.issues.length} Active Issue${data.issues.length > 1 ? 's' : ''}`;
      } else if (!allGreen) {
        indicator = 'minor';
        const problemAreas = statuses.filter(([_, status]) => status !== 'green');
        description = `Issues in: ${problemAreas.map(([name]) => name).join(', ')}`;
      }

      return {
        company: this.getAttribute('name') || new URL(this.statusUrl).hostname.split('.')[0],
        status: indicator,
        description: description,
        updatedAt: new Date().toString()
      };
    }

    // Fallback for unknown formats
    return {
      company: this.getAttribute('name') || 'Unknown',
      status: 'none',
      description: 'Unknown Status Format',
      updatedAt: new Date().toString()
    };
  }

  set status (value) {
    window.notifyStatusChange(this.company, value, this._status)
    this._status = value;
  }
  get status () {
    return this._status || 'none'
  }
}

StatusCard.register();