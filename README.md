# [post][post-href]

## inspiration

`post` is an idea I had when I was home in Colorado. I was spending time with my grandma and it made
me really sad that I couldn't communicate with her easily while I'm away. She's hard of hearing and
doesn't own a computer. I realized it would be great if I could send her some pictures and letters
every once in a while: postcards!

The whole website is powered by [Lob][lob-href], which is an awesome printing API. It's pretty cheap
too: just $0.70 for a 4"x6" postcard and $1.50 for a colossal 6"x11" postcard! Since `post` uses
the Lob API directly, you pay the Lob price and nothing more. I'm not out to make money with this
project.

## technical summary

Some code things used in `post`:

- React + Redux Toolkit, in TypeScript
- CSS Modules
- [esbuild][esbuild-href] for bundling
- [canvg][canvg-href] for rendering the postcard into a Lob-friendly format
- Deployed as a static site to my personal Kubernetes cluster

There is no backend. Postcards are rendered to PNG entirely in the browser and
posted straight to Lob. Your API key and saved addresses live in `localStorage`.

[post-href]: https://post.scotthardy.me
[lob-href]: https://lob.com
[esbuild-href]: https://esbuild.github.io
[canvg-href]: https://github.com/canvg/canvg
