# SVG再利用

　`<def>`で定義し、`<use>`でそれを利用する。このとき`fill`や`width`などの属性を付与するとそれが反映される。ただし`<def>`の中で定義されていると`<use>`で指定しても反映されない。なので`<def>`ではなるだけパス形状`d`属性のみ定義し、他はすべて`<use>`で指定するとよい。

```js
const sym = svg({display:`none`},
    defs(
        symbol({id:`svg-icon-coin-mona`, width:()=>size.val, height:()=>size.val, viewBox:()=>`0 0 32 32`},
            path({/*fill:()=>color.fg.val, */d:`M16 32C7.163 32 0 24.837 0 16S7.163 0 16 0s16 7.163 16 16-7.163 16-16 16zm7.53-18.586L22.105 7l-2.797 4.414a14.096 14.096 0 00-6.617 0L9.902 7l-1.43 6.414C6.937 14.642 6 16.247 6 18.009c0 3.86 4.476 6.989 9.997 6.989s9.997-3.13 9.997-6.989c-.001-1.762-.93-3.367-2.465-4.595zM10.442 16.35h-.666l1.627-1.876h1.184l-2.145 1.876zm5.504 4.584l-2.766-4.872.683-.39.617 1.085h3.021l.644-1.09.676.402-2.875 4.865zm5.613-4.584l-2.146-1.876h1.192l1.625 1.876h-.671zm-5.6 3.015l1.075-1.82h-2.108l1.033 1.82z`}),
        ),
    ),
)
```
```js
van.add(document.body, van.tags.main({style:()=>`width:100%;height:100%;color:${color.fg.val};background-color:${color.bg.val};`}, select, sym, 
    svg(use({href:`#svg-icon-coin-mona`})), // 位置がずれる！
    svg({width:()=>size.val, height:()=>size.val}, use({href:`#svg-icon-coin-mona`})), // select色反映されない！
    svg({width:()=>size.val, height:()=>size.val}, use({href:`#svg-icon-coin-mona`, fill:()=>color.fg.val})),
    svg({width:()=>size.val, height:()=>size.val}, use({href:`#svg-icon-coin-mona`, fill:`red`})),
    svg({width:()=>size.val, height:()=>size.val}, use({href:`#svg-icon-coin-mona`, width:32, height:32})),
))
```

