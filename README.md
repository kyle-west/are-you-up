# Are you up? (aka `RU↑`)

There are a number of services I care about knowing what their status is daily. 
Instead of going to each of their websites to check on them, I built this _simple_
(another word for _ugly_) dashboard.

The statuses are displayed using Native Web Components. The `/assets/palces.json`
file holds the config for what services to listen to. It requires that the service
has an implementation of the [StatusPage.io v2 API](https://help.statuspage.io/knowledge_base/topics/api-information).

This is under an MIT licence. Feel free to fork this repo and add your own services!

Checkout the current [Status Page](https://kyle-west.github.io/are-you-up/)!
