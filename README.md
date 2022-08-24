<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p>

<h3 align="center">HTML Multi Slider</h3>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kylelobo/The-Documentation-Compendium.svg)](https://github.com/kylelobo/The-Documentation-Compendium/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> This is a simple HTML slider that can be used to select a range of values.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This is a simple HTML slider that can be used to select a range of values. The selector has 2 built-in handles with room for more in the future with a small rework. The slider is fully customizable and can be used in any project. The slider is also responsive and will scale to the size of the parent container.

## 🏁 Getting Started <a name = "getting_started"></a>

Include the following files in your project:
```MultiSlider.js```
```MultiSlider.css```

init the slider with the following code:
```javascript
var slider = new MultiSlider(
    '#test', // selector
    1, // min value
    25, // max value
    10, // initial value 1
    15, // initial value 2
    times, // labels to display 
    1, // step size 
    all_times // tooltip labels
  );
```