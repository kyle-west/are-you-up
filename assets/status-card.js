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
      this.company = data.page.name;
      this.status = data.status.indicator;
      this.innerHTML = `<a href="${this.navigateUrl}">
        <section class="${this.status}">
        <img src="${this.iconUrl}"/>
        <h1>${this.company}</h1>
        <div class="data">
          <h3>${data.status.description}</h3>
          <p><code>${new Date (data.page.updated_at).toString()}</code></p>
        </div>
        </section>
      </a>`;
    });
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