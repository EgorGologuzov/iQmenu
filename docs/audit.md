# npm audit report

@tootallnate/once  <3.0.1
@tootallnate/once vulnerable to Incorrect Control Flow Scoping - https://github.com/advisories/GHSA-vpq2-c234-7xj6
fix available via `npm audit fix`
node_modules/@tootallnate/once
  http-proxy-agent  4.0.1 - 5.0.0
  Depends on vulnerable versions of @tootallnate/once
  node_modules/http-proxy-agent
    jsdom  16.6.0 - 22.1.0
    Depends on vulnerable versions of http-proxy-agent
    node_modules/jsdom
      jest-environment-jsdom  27.0.1 - 30.0.0-rc.1
      Depends on vulnerable versions of jsdom
      node_modules/jest-environment-jsdom
        jest-config  27.0.1 - 27.5.1
        Depends on vulnerable versions of jest-environment-jsdom
        Depends on vulnerable versions of jest-runner
        node_modules/jest-config
          @jest/core  27.0.1 - 27.5.1
          Depends on vulnerable versions of jest-config
          Depends on vulnerable versions of jest-runner
          node_modules/@jest/core
          jest-cli  27.0.1 - 27.5.1
          Depends on vulnerable versions of @jest/core
          Depends on vulnerable versions of jest-config
          node_modules/jest-cli
            jest  27.0.1 - 27.5.1
            Depends on vulnerable versions of @jest/core
            Depends on vulnerable versions of jest-cli
            node_modules/jest
        jest-runner  27.0.4 - 27.5.1
        Depends on vulnerable versions of jest-environment-jsdom
        node_modules/jest-runner

ajv  <6.14.0 || >=7.0.0-alpha.0 <8.18.0
Severity: moderate
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
ajv has ReDoS when using `$data` option - https://github.com/advisories/GHSA-2g4f-4pwh-qvx6
fix available via `npm audit fix`
node_modules/ajv
node_modules/ajv-formats/node_modules/ajv
node_modules/schema-utils/node_modules/ajv
node_modules/workbox-build/node_modules/ajv

axios  1.0.0 - 1.14.0
Severity: high
Axios is vulnerable to DoS attack through lack of data size check - https://github.com/advisories/GHSA-4hjh-wcwx-xvwj
Axios is Vulnerable to Denial of Service via __proto__ Key in mergeConfig - https://github.com/advisories/GHSA-43fc-jf86-j433
Axios has a NO_PROXY Hostname Normalization Bypass that Leads to SSRF - https://github.com/advisories/GHSA-3p68-rc4w-qgx5
Axios has Unrestricted Cloud Metadata Exfiltration via Header Injection Chain - https://github.com/advisories/GHSA-fvcv-3m26-pcqx
fix available via `npm audit fix`
node_modules/axios

brace-expansion  <=1.1.12 || 2.0.0 - 2.0.2
Severity: moderate
brace-expansion Regular Expression Denial of Service vulnerability - https://github.com/advisories/GHSA-v6h2-p8h4-qcjw
brace-expansion Regular Expression Denial of Service vulnerability - https://github.com/advisories/GHSA-v6h2-p8h4-qcjw
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
brace-expansion: Zero-step sequence causes process hang and memory exhaustion - https://github.com/advisories/GHSA-f886-m6hf-6m8v
fix available via `npm audit fix`
node_modules/brace-expansion
node_modules/filelist/node_modules/brace-expansion
node_modules/sucrase/node_modules/brace-expansion

flatted  <=3.4.1
Severity: high
flatted vulnerable to unbounded recursion DoS in parse() revive phase - https://github.com/advisories/GHSA-25h7-pfq9-p65f
Prototype Pollution via parse() in NodeJS flatted - https://github.com/advisories/GHSA-rf6f-7fwh-wjgh
fix available via `npm audit fix`
node_modules/flatted

follow-redirects  <=1.15.11
Severity: moderate
follow-redirects leaks Custom Authentication Headers to Cross-Domain Redirect Targets - https://github.com/advisories/GHSA-r4q5-vmmm-2653
fix available via `npm audit fix`
node_modules/follow-redirects

form-data  3.0.0 - 3.0.3 || 4.0.0 - 4.0.3
Severity: critical
form-data uses unsafe random function in form-data for choosing boundary - https://github.com/advisories/GHSA-fjxv-7rqg-78g4
form-data uses unsafe random function in form-data for choosing boundary - https://github.com/advisories/GHSA-fjxv-7rqg-78g4
fix available via `npm audit fix`
node_modules/axios/node_modules/form-data
node_modules/form-data

glob  10.2.0 - 10.4.5
Severity: high
glob CLI: Command injection via -c/--cmd executes matches with shell:true - https://github.com/advisories/GHSA-5j98-mcp5-4vw2
fix available via `npm audit fix`
node_modules/sucrase/node_modules/glob

http-proxy-middleware  1.3.0 - 2.0.8
Severity: moderate
http-proxy-middleware allows fixRequestBody to proceed even if bodyParser has failed - https://github.com/advisories/GHSA-9gqv-wp59-fq42
http-proxy-middleware can call writeBody twice because "else if" is not used - https://github.com/advisories/GHSA-4www-5p9h-95mh
fix available via `npm audit fix`
node_modules/http-proxy-middleware

js-yaml  <3.14.2 || >=4.0.0 <4.1.1
Severity: moderate
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
js-yaml has prototype pollution in merge (<<) - https://github.com/advisories/GHSA-mh29-5h37-fv8m
fix available via `npm audit fix`
node_modules/@eslint/eslintrc/node_modules/js-yaml
node_modules/eslint/node_modules/js-yaml
node_modules/js-yaml

jsonpath  *
Severity: high
JSONPath vulnerable to Prototype Pollution due to insufficient input validation of object keys in lib/index.js - https://github.com/advisories/GHSA-6c59-mwgh-r2x6
jsonpath has Arbitrary Code Injection via Unsafe Evaluation of JSON Path Expressions - https://github.com/advisories/GHSA-87r5-mp6g-5w5j
Depends on vulnerable versions of underscore
fix available via `npm audit fix`
node_modules/jsonpath

lodash  <=4.17.23
Severity: high
Lodash has Prototype Pollution Vulnerability in `_.unset` and `_.omit` functions - https://github.com/advisories/GHSA-xxjr-mmjv-4gpg
lodash vulnerable to Code Injection via `_.template` imports key names - https://github.com/advisories/GHSA-r5fr-rjxr-66jc
lodash vulnerable to Prototype Pollution via array path bypass in `_.unset` and `_.omit` - https://github.com/advisories/GHSA-f23m-r3pf-42rh
fix available via `npm audit fix`
node_modules/lodash

minimatch  <=3.1.3 || 5.0.0 - 5.1.7 || 9.0.0 - 9.0.6
Severity: high
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has a ReDoS via repeated wildcards with non-matching literal in pattern - https://github.com/advisories/GHSA-3ppc-4f35-3m26
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch has ReDoS: matchOne() combinatorial backtracking via multiple non-adjacent GLOBSTAR segments - https://github.com/advisories/GHSA-7r86-cg39-jmmj
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
minimatch ReDoS: nested *() extglobs generate catastrophically backtracking regular expressions - https://github.com/advisories/GHSA-23c5-xmqv-rm74
fix available via `npm audit fix`
node_modules/filelist/node_modules/minimatch
node_modules/minimatch
node_modules/sucrase/node_modules/minimatch

node-forge  <=1.3.3
Severity: high
node-forge has ASN.1 Unbounded Recursion - https://github.com/advisories/GHSA-554w-wpv2-vw27
node-forge has an Interpretation Conflict vulnerability via its ASN.1 Validator Desynchronization - https://github.com/advisories/GHSA-5gfm-wpxj-wjgq
node-forge is vulnerable to ASN.1 OID Integer Truncation - https://github.com/advisories/GHSA-65ch-62r8-g69g
Forge has a basicConstraints bypass in its certificate chain verification (RFC 5280 violation) - https://github.com/advisories/GHSA-2328-f5f3-gj25
Forge has signature forgery in Ed25519 due to missing S > L check - https://github.com/advisories/GHSA-q67f-28xg-22rw
Forge has Denial of Service via Infinite Loop in BigInteger.modInverse() with Zero Input - https://github.com/advisories/GHSA-5m6q-g25r-mvwx
Forge has signature forgery in RSA-PKCS due to ASN.1 extra field   - https://github.com/advisories/GHSA-ppp5-5v6c-4jwp
fix available via `npm audit fix`
node_modules/node-forge

nth-check  <2.0.1
Severity: high
Inefficient Regular Expression Complexity in nth-check - https://github.com/advisories/GHSA-rp65-9cf3-cjxr
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/svgo/node_modules/nth-check
  css-select  <=3.1.0
  Depends on vulnerable versions of nth-check
  node_modules/svgo/node_modules/css-select
    svgo  1.0.0 - 1.3.2 || 2.1.0 - 2.8.0
    Depends on vulnerable versions of css-select
    node_modules/postcss-svgo/node_modules/svgo
    node_modules/svgo
      @svgr/plugin-svgo  <=5.5.0
      Depends on vulnerable versions of svgo
      node_modules/@svgr/plugin-svgo
        @svgr/webpack  4.0.0 - 5.5.0
        Depends on vulnerable versions of @svgr/plugin-svgo
        node_modules/@svgr/webpack
          react-scripts  >=0.1.0
          Depends on vulnerable versions of @svgr/webpack
          Depends on vulnerable versions of css-minimizer-webpack-plugin
          Depends on vulnerable versions of jest
          Depends on vulnerable versions of resolve-url-loader
          Depends on vulnerable versions of webpack-dev-server
          Depends on vulnerable versions of workbox-webpack-plugin
          node_modules/react-scripts

on-headers  <1.1.0
on-headers is vulnerable to http response header manipulation - https://github.com/advisories/GHSA-76c9-3jph-rj3q
fix available via `npm audit fix`
node_modules/on-headers
  compression  1.0.3 - 1.8.0
  Depends on vulnerable versions of on-headers
  node_modules/compression

path-to-regexp  <0.1.13
Severity: high
path-to-regexp vulnerable to Regular Expression Denial of Service via multiple route parameters - https://github.com/advisories/GHSA-37ch-88jc-xwx2
fix available via `npm audit fix`
node_modules/path-to-regexp
  express  4.0.0-rc1 - 4.21.2 || 5.0.0-alpha.1 - 5.0.1
  Depends on vulnerable versions of body-parser
  Depends on vulnerable versions of path-to-regexp
  Depends on vulnerable versions of qs
  node_modules/express

picomatch  <=2.3.1
Severity: high
Picomatch: Method Injection in POSIX Character Classes causes incorrect Glob Matching - https://github.com/advisories/GHSA-3v7f-55p6-f55p
Picomatch has a ReDoS vulnerability via extglob quantifiers - https://github.com/advisories/GHSA-c2c7-rcm5-vvqj
fix available via `npm audit fix`
node_modules/picomatch

postcss  <8.4.31
Severity: moderate
PostCSS line return parsing error - https://github.com/advisories/GHSA-7fh5-64p2-3v2j
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/resolve-url-loader/node_modules/postcss
  resolve-url-loader  0.0.1-experiment-postcss || 3.0.0-alpha.1 - 4.0.0
  Depends on vulnerable versions of postcss
  node_modules/resolve-url-loader

qs  <=6.14.1
Severity: moderate
qs's arrayLimit bypass in comma parsing allows denial of service - https://github.com/advisories/GHSA-w7fw-mjwx-w883
qs's arrayLimit bypass in its bracket notation allows DoS via memory exhaustion - https://github.com/advisories/GHSA-6rw7-vpxm-498p
fix available via `npm audit fix`
node_modules/qs
  body-parser  1.19.0 - 1.20.3 || 2.0.0-beta.1 - 2.0.2
  Depends on vulnerable versions of qs
  node_modules/body-parser

react-router  7.0.0-pre.0 - 7.12.0-pre.0
Severity: high
React Router allows a DoS via cache poisoning by forcing SPA mode - https://github.com/advisories/GHSA-f46r-rw29-r322
React Router has CSRF issue in Action/Server Action Request Processing - https://github.com/advisories/GHSA-h5cw-625j-3rxh
React Router vulnerable to XSS via Open Redirects - https://github.com/advisories/GHSA-2w69-qvjg-hvjx
React Router SSR XSS in ScrollRestoration - https://github.com/advisories/GHSA-8v8x-cx79-35w7
React Router has unexpected external redirect via untrusted paths - https://github.com/advisories/GHSA-9jcx-v3wj-wh4m
React Router has XSS Vulnerability - https://github.com/advisories/GHSA-3cgp-3xvw-98x8
React Router allows pre-render data spoofing on React-Router framework mode - https://github.com/advisories/GHSA-cpj6-fhp6-mr6j
fix available via `npm audit fix`
node_modules/react-router

rollup  <2.80.0
Severity: high
Rollup 4 has Arbitrary File Write via Path Traversal - https://github.com/advisories/GHSA-mw96-cpmx-2vgc
fix available via `npm audit fix`
node_modules/rollup

serialize-javascript  <=7.0.4
Severity: high
Serialize JavaScript is Vulnerable to RCE via RegExp.flags and Date.prototype.toISOString() - https://github.com/advisories/GHSA-5c6j-r48x-rmvq
Serialize JavaScript has CPU Exhaustion Denial of Service via crafted array-like objects - https://github.com/advisories/GHSA-qj8w-gfj5-8c6v
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/rollup-plugin-terser/node_modules/serialize-javascript
node_modules/serialize-javascript
  css-minimizer-webpack-plugin  <=7.0.4
  Depends on vulnerable versions of serialize-javascript
  node_modules/css-minimizer-webpack-plugin
  rollup-plugin-terser  3.0.0 || >=4.0.4
  Depends on vulnerable versions of serialize-javascript
  node_modules/rollup-plugin-terser
    workbox-build  5.0.0-alpha.0 - 7.0.0
    Depends on vulnerable versions of rollup-plugin-terser
    node_modules/workbox-build
      workbox-webpack-plugin  5.0.0-alpha.0 - 7.0.0
      Depends on vulnerable versions of workbox-build
      node_modules/workbox-webpack-plugin
  terser-webpack-plugin  <=5.3.16
  Depends on vulnerable versions of serialize-javascript
  node_modules/terser-webpack-plugin


underscore  <=1.13.7
Severity: high
Underscore has unlimited recursion in _.flatten and _.isEqual, potential for DoS attack - https://github.com/advisories/GHSA-qpx9-hpmf-5gmw
fix available via `npm audit fix`
node_modules/underscore

uuid  <14.0.0
Severity: moderate
uuid: Missing buffer bounds check in v3/v5/v6 when buf is provided - https://github.com/advisories/GHSA-w5hq-g745-h8pq
fix available via `npm audit fix --force`
Will install react-scripts@0.0.0, which is a breaking change
node_modules/uuid
  sockjs  >=0.3.17
  Depends on vulnerable versions of uuid
  node_modules/sockjs
    webpack-dev-server  *
    Depends on vulnerable versions of sockjs
    node_modules/webpack-dev-server

webpack  5.49.0 - 5.104.0
webpack buildHttp: allowedUris allow-list bypass via URL userinfo (@) leading to build-time SSRF behavior - https://github.com/advisories/GHSA-8fgc-7cc6-rx7x
webpack buildHttp HttpUriPlugin allowedUris bypass via HTTP redirects → SSRF + cache persistence - https://github.com/advisories/GHSA-38r7-794h-5758
fix available via `npm audit fix`
node_modules/webpack


yaml  1.0.0 - 1.10.2 || 2.0.0 - 2.8.2
Severity: moderate
yaml is vulnerable to Stack Overflow via deeply nested YAML collections - https://github.com/advisories/GHSA-48c2-rrv3-qjmp
yaml is vulnerable to Stack Overflow via deeply nested YAML collections - https://github.com/advisories/GHSA-48c2-rrv3-qjmp
fix available via `npm audit fix`
node_modules/postcss-load-config/node_modules/yaml
node_modules/yaml

51 vulnerabilities (13 low, 12 moderate, 25 high, 1 critical)

To address issues that do not require attention, run:
  npm audit fix

To address all issues (including breaking changes), run:
  npm audit fix --force