# abcd — portfolio

A personal product design portfolio. Home page, a Work section with case
studies, and an interactive 3D hero.

```
nothingdesign/
├── index.html          home page — hero + Work section
├── styles.css
├── assets/              centerpiece image for the hero
└── work/
    ├── article.css      shared case-study layout
    ├── shared.css       shared nav/footer chrome
    ├── aithraa/
    ├── estbuild/
    └── pinnacle-ai/      one index.html per case study
```

No build step and no dependencies. Open `index.html` in a browser, or serve
the folder (`python3 -m http.server`) if you'd rather avoid `file://`.
