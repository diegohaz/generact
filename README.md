<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/3068563/26764665/8616e6d6-4941-11e7-95eb-e9778ab3a0c5.png" alt="generact" width="300" />
</p>

<p align="center">
  <a href="https://github.com/diegohaz/nod"><img alt="Generated with nod" src="https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square" /></a>
  <a href="https://npmjs.org/package/generact"><img alt="NPM version" src="https://img.shields.io/npm/v/generact.svg?style=flat-square" /></a>
  <a href="https://travis-ci.org/diegohaz/generact"><img alt="Build Status" src="https://img.shields.io/travis/diegohaz/generact/master.svg?style=flat-square" /></a>
  <a href="https://codecov.io/gh/diegohaz/generact/branch/master"><img alt="Coverage Status" src="https://img.shields.io/codecov/c/github/diegohaz/generact/master.svg?style=flat-square" /></a>
</p>

<br>

<p align="center">
  <em>Tool for generating React components by replicating your own.</em><br />
  <em>It's intended to work no matter how your file structure is.</em>
</p>

<br>

<p align="center">
  <img src="https://user-images.githubusercontent.com/3068563/27687316-bb5bd832-5cac-11e7-9761-c489e5a3a9f0.gif" alt="generact" width="800" />
  <br><br>
</p>

<p align="center">
  <em>Are you looking for a VS Code extension? Try <a href="https://github.com/Dennitz/vscode-generact">vscode-generact</a>.</em>
</p>

<br>

> It already works with boilerplates such as [create-react-app](https://github.com/facebookincubator/create-react-app) (above example), [react-boilerplate](https://github.com/react-boilerplate/react-boilerplate), [react-starter-kit](https://github.com/kriasoft/react-starter-kit) and [ARc](https://arc.js.org) (ok, I'm self-promoting here 😆). So, most likely this will work for you with your current project.

## Install

```sh
$ npm install -g generact
```

## Motivation

<p align="center">
  <a href="https://www.facebook.com/groups/228321510706889/permalink/614412725431097/"><img alt="Facebook poll" src="https://cloud.githubusercontent.com/assets/3068563/26765726/79542d66-4958-11e7-91a1-19d55b766f12.png" height="250" /></a>
  <a href="https://twitter.com/diegohaz"><img alt="Facebook poll" src="https://cloud.githubusercontent.com/assets/3068563/26765748/18e53fd2-4959-11e7-93c9-ecc2452ea10e.png" height="250" /></a>
</p>

I usually work on different projects with different file structures. Whenever I needed to create a new component, the approach I used was to copy and paste a similar or very basic component and start writing the new component from it. Talking with other developers, this seemed like a very common process.

However, I've never been satisfied with that. It looked like I was doing a robot job. So why not create a robot to do that?

## Usage

```sh
$ cd ~/my-projects/my-react-project
$ generact
```

That will scan `~/my-projects/my-react-project` for components to replicate.

### Specify another root path to find components

If you want to replicate components from another directory, you can do that by using `root` option:

```sh
$ generact --root relative/or/absolute/path/to/any/react/project
```

### Specify component path to replicate

`generact` will probably find all component files inside the root path automagically (using [list-react-files](https://github.com/diegohaz/list-react-files)). But, if it doesn't, you can still pass in the component path:

```sh
$ generact relative/or/absolute/path/to/component.js
```

## Contributing

PRs are welcome.

Use `npm run watch` while coding.

## License

MIT © [Diego Haz](https://github.com/diegohaz)
