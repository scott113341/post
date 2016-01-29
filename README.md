# post

[![Version][version-badge]][version-href]
[![Build status][build-badge]][build-href]
[![Dependencies][deps-badge]][deps-href]


## inspiration

`post` is an idea I had a few weeks ago when I was home in Colorado.  I was spending time with my grandma and it made me really sad that I couldn't communicate with her easily while I'm away.  She's hard of hearing and doesn't own a computer.  I realized it would be great if I could send her some pictures and letters every once in a while: postcards!

The whole website is powered by [Lob](https://lob.com/), which is an awesome printing API.  It's pretty cheap too: just $0.70 for a 4"x6" postcard and $1.50 for a collosal 6"x11" postcard!  Since `post` uses the Lob API directly, you pay the Lob price and nothing more.  I'm not out to make money with this project.


## technical summary

Some code things used in `post`:

* React + Redux
* [csjs](https://github.com/rtsao/csjs)
* Babel
* SVG + Canvas + Data URIs
* Travis CI deployment to GitHub Pages
* Ye olde `new XMLHttpRequest();`


[version-badge]: https://img.shields.io/github/tag/scott113341/post.svg?label=version&style=flat-square
[version-href]: https://github.com/scott113341/post/tags

[build-badge]: https://img.shields.io/travis/scott113341/post.svg?style=flat-square
[build-href]: https://travis-ci.org/scott113341/post

[deps-badge]: https://img.shields.io/david/dev/scott113341/post.svg?style=flat-square
[deps-href]: https://david-dm.org/scott113341/post#info=devDependencies
