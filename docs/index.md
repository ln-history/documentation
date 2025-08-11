---
pageType: home

hero:
  name: ln-history
  text: Analyze Lightning Network Gossip Messages
  tagline: Lightning fast snapshot generation, snapshot-diff calculation and much more analysis! 
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/direct_request/index.html
    - theme: alt
      text: Documentation
      link: /guide/
  image:
    src: /rspress-icon.png
    alt: Logo
features:
  - title: Zero Infrastructure  
    details: Request data from the live-api for free and work locally. Analyze (historic) snapshots, calculate their difference or look into gossip messages by node_id or scid.  
    link: ./guide/direct_request/index.html
    icon: 📊
  - title: Use your own collected gossip messages
    details: Bulk import your own gossip messages into an efficiently indexed Postgres database and analyse your own data. No trust required.
    link: ./guide/bulk_import/index.html
    icon: 🏺
  - title: Real time and historic analysis
    details: Collect gossip messages in real time. Analyze historic and the latest gossip messages - always ahead!
    link: ./guide/real_time/index.html
    icon: 👑
---
