# TM↓

Markdown in your terminal

* Works with links, tables, code blocks, and more
* Pipable : `cat readme.md | tm`
* Adapts to your terminal theme
* Compatible with CI/CD

<!-- ![image demo]() -->

### Install

```
npm install -g terminal-markdown
```

(or `yarn global add terminal-markdown`)

### Usage

```
tm <your-md-file>
```

or

```
cat <your-md-file> | tm
```

The second usage allows you to combine terminal-markdown with other commands.

🍿 For example, you can request this readme (that you are currently reading) and display it :

```
curl -s https://raw.githubusercontent.com/lucleray/terminal-markdown/master/readme.md | tm
```

### Support

✔︎ Terminal-markdown supports everything (CommonMark and Github Flavoured Markdown), except :

* **Images** are replaced by alt texts
* **HTML** won't be displayed
* **Footnotes** but they are also not supported on Github
* **Alignment** of tables is not taken in account

🚨 Depending on your terminal, some things might change :

* [Links](https://google.fr) are [not always supported](https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda)
* _Emphasis_ is not always supported
* ~~Delete~~ is not always supported

### Roadmap

* [x] Links in [compatible terminals](https://gist.github.com/egmontkob/eb114294efbcd5adb1944c9f3cb5feda)
* [ ] Syntax highlighting for code blocks
* [ ] Table alignment
* [ ] [Images ?](https://github.com/sindresorhus/terminal-image)
